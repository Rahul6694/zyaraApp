import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../Constants/Colors';
import Typography from '../../Component/UI/Typography';
import Input from '../../Component/Input';
import Button from '../../Component/Button';
import { ImageConstant } from '../../Constants/ImageConstant';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ImageModal from '../../Component/Modals/ImageModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Font } from '../../Constants/Font';
import { BASE_URL } from '../../Backend/env';
import { getUserProfile, updateUserProfile } from '../../Backend/CustomerAPI';
import SimpleToast from 'react-native-simple-toast';
import { useSelector, useDispatch } from 'react-redux';
import { userDetails } from '../../Redux/action';

const { width } = Dimensions.get('window');

const SettingProfile = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const currentUserDetails = useSelector(state => state.userDetails) || {};

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [originalProfilePicture, setOriginalProfilePicture] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [fetchingProfile, setFetchingProfile] = useState(true);
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phoneNumber: '',
    });

    // Fetch profile data from API when component mounts or comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchUserProfile();
        }, [])
    );

    const fetchUserProfile = () => {
        setFetchingProfile(true);
        getUserProfile(
            res => {
                const profileData = res?.data || res;
                
                if (profileData) {
                    // Update name - always set if available
                    const userName = profileData.name || profileData.full_name || '';
                    if (userName) {
                        setName(userName);
                    }
                    
                    // Update email - always set if available
                    if (profileData.email) {
                        setEmail(profileData.email);
                    }
                    
                    // Update phone - always set if available
                    const userPhone = profileData.phone || profileData.number || profileData.mobile || '';
                    if (userPhone) {
                        setPhoneNumber(userPhone);
                    }
                    
                    // Update profile picture - always set if available
                    let profilePicUrl = null;
                    if (profileData.profile_picture || profileData.profile_pic || profileData.avatar) {
                        const profilePic = profileData.profile_picture || profileData.profile_pic || profileData.avatar;
                        profilePicUrl = profilePic;
                        if (profilePic) {
                            let imageUri;
                            if (profilePic.startsWith('http://') || profilePic.startsWith('https://')) {
                                imageUri = { uri: profilePic };
                            } else {
                                const baseDomain = BASE_URL.replace('/api/', '').replace(/\/$/, '');
                                const imagePath = profilePic.startsWith('/') ? profilePic : `/${profilePic}`;
                                imageUri = { uri: `${baseDomain}${imagePath}` };
                            }
                            
                            if (imageUri) {
                                setProfilePicture(imageUri);
                                setOriginalProfilePicture(imageUri);
                                setImageError(false);
                            }
                        }
                    }
                    
                    // Update Redux store with fetched profile data
                    // Always use fresh data from API, don't fallback to old Redux data
                    const updatedUserDetails = {
                        ...currentUserDetails,
                        name: userName || '',
                        full_name: userName || '',
                        email: profileData.email || '',
                        phone: userPhone || '',
                        number: userPhone || '',
                        mobile: userPhone || '',
                        profile_picture: profilePicUrl || null,
                        profile_pic: profilePicUrl || null,
                        avatar: profilePicUrl || null,
                    };
                    dispatch(userDetails(updatedUserDetails));
                }
                setFetchingProfile(false);
            },
            err => {
                SimpleToast.show('Failed to load profile data', SimpleToast.SHORT);
                setFetchingProfile(false);
            }
        );
    };

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        // Remove spaces, dashes, and country code if present
        const cleanedPhone = phone.replace(/[\s\-+()]/g, '');
        // Check if phone has exactly 10 digits
        return cleanedPhone.length === 10 && /^\d+$/.test(cleanedPhone);
    };

    const validateForm = () => {
        const newErrors = {
            name: '',
            email: '',
            phoneNumber: '',
        };
        let isValid = true;

        // Validate name
        if (!name.trim()) {
            newErrors.name = 'Please enter your name';
            isValid = false;
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
            isValid = false;
        }

        // Validate email
        if (!email.trim()) {
            newErrors.email = 'Please enter your email';
            isValid = false;
        } else if (!validateEmail(email.trim())) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Validate phone
        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = 'Please enter your phone number';
            isValid = false;
        } else if (!validatePhone(phoneNumber.trim())) {
            newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleUpdate = () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({ name: '', email: '', phoneNumber: '' });

        // Create FormData
        const formData = new FormData();
        
        // Add profile picture only if it's a new image (has path property from image picker)
        // Check if it's a new image by checking if it has 'path' property (from image picker)
        // or if it's different from original (not a URL string)
        const isNewImage = profilePicture && (
            profilePicture.path || 
            (profilePicture.uri && !profilePicture.uri.startsWith('http') && !profilePicture.uri.startsWith('https'))
        );
        
        if (isNewImage) {
            const imageUri = profilePicture.path || profilePicture.uri;
            formData.append('profile_picture', {
                uri: imageUri,
                type: profilePicture.mime || 'image/jpeg',
                name: profilePicture.filename || imageUri.split('/').pop() || 'profile_picture.jpg',
            });
        }
        
        formData.append('name', name.trim());
        formData.append('email', email.trim());
        formData.append('number', phoneNumber.trim());

        updateUserProfile(
            formData,
            res => {
                setLoading(false);
                
                SimpleToast.show('Profile updated successfully', SimpleToast.SHORT);
                
                // Re-fetch profile data from users/profile API to get latest updated data
                // This ensures we get the most up-to-date data from server
                setTimeout(() => {
                    fetchUserProfile();
                    
                    // Navigate back after fetch completes
                    
                }, 500);
            },
            err => {
                const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update profile';
                SimpleToast.show(errorMessage, SimpleToast.SHORT);
                setLoading(false);
            }
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.lightGreen }}>
            <View style={styles.container}>

                {/* Background */}
                <LinearGradient
                    colors={[Colors.white, Colors.lightGreen]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.backgroundGradient}
                />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={ImageConstant.BackArrow}
                            style={styles.backArrow}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <View style={styles.placeholder} />
                </View>

                {/* Body */}
                {fetchingProfile ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={Colors.zyaraGreen} />
                    </View>
                ) : (
                    <KeyboardAvoidingView
                        style={styles.keyboardView}
                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                    >
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.content}>

                            {/* Profile Photo */}
                            <View style={styles.profilePictureContainer}>
                                <View
                                    style={styles.profilePictureBox}

                                >
                                    {profilePicture && !imageError ? (
                                        <Image
                                            source={{
                                                uri: profilePicture.path || profilePicture.uri || (typeof profilePicture === 'string' ? profilePicture : null)
                                            }}
                                            style={styles.profileImage}
                                            onError={() => {
                                                setImageError(true);
                                            }}
                                            onLoad={() => {
                                                setImageError(false);
                                            }}
                                        />
                                    ) : (
                                        <Image
                                            source={ImageConstant.girl}
                                            style={styles.profileImage}
                                            resizeMode="cover"
                                        />
                                    )}
                                </View>

                                {/* Camera Icon */}
                                <TouchableOpacity style={styles.editCam} onPress={() => setShowImageModal(true)}>
                                    <Image
                                        source={ImageConstant.editcammra}
                                        style={{ height: 42, width: 42, resizeMode: 'contain' }}
                                    />
                                </TouchableOpacity>


                                <Typography style={styles.nameLabel} size={24} type={Font.GeneralSans_Bold}>
                                    {name || 'User'}
                                </Typography>
                                <Typography style={styles.emailLabel} size={18}>
                                    {email || 'example@gmail.com'}
                                </Typography>
                            </View>

                            {/* Input Fields */}
                            <View style={styles.inputContainer}>
                                <Input
                                    source={ImageConstant.user}
                                    showImage={true}
                                    title="Full Name"
                                    placeholder="Enter Name"
                                    value={name}
                                    onChange={(text) => {
                                        setName(text);
                                        if (errors.name) {
                                            setErrors({ ...errors, name: '' });
                                        }
                                    }}
                                    keyboardType="default"
                                    showTitle={true}
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                />
                                {errors.name ? (
                                    <Typography style={styles.errorText} size={12} color="#FF0000">
                                        {errors.name}
                                    </Typography>
                                ) : null}
                            </View>

                            <View style={styles.inputContainer}>
                                <Input
                                    source={ImageConstant.email}
                                    showImage={true}
                                    title="Email Address"
                                    placeholder="example@gmail.com"
                                    value={email}
                                    onChange={(text) => {
                                        setEmail(text);
                                        if (errors.email) {
                                            setErrors({ ...errors, email: '' });
                                        }
                                    }}
                                    keyboardType="email-address"
                                    showTitle={true}
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                />
                                {errors.email ? (
                                    <Typography style={styles.errorText} size={12} color="#FF0000">
                                        {errors.email}
                                    </Typography>
                                ) : null}
                            </View>

                            <View style={styles.inputContainer}>
                                <Input
                                    title="Phone Number"
                                    placeholder="Enter Mobile Number"
                                    value={phoneNumber}
                                    onChange={(text) => {
                                        setPhoneNumber(text);
                                        if (errors.phoneNumber) {
                                            setErrors({ ...errors, phoneNumber: '' });
                                        }
                                    }}
                                    keyboardType="number-pad"
                                    countryPicker={true}
                                    showTitle={true}
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                />
                                {errors.phoneNumber ? (
                                    <Typography style={styles.errorText} size={12} color="#FF0000">
                                        {errors.phoneNumber}
                                    </Typography>
                                ) : null}
                            </View>

                            {/* Update Button */}
                            <Button
                                title={loading ? 'UPDATING...' : 'UPDATE'}
                                onPress={handleUpdate}
                                style={styles.button}
                                linerColor={[Colors.zyaraGreen, Colors.zyaraGreen]}
                                title_style={styles.buttonText}
                                disabled={loading || fetchingProfile}
                            />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                )}

                {/* Image Picker Modal */}
                <ImageModal
                    showModal={showImageModal}
                    selected={(images) => {
                        if (images?.length) {
                            const selectedImage = images[0];
                            // Store the image object with path, uri, mime, etc.
                            setProfilePicture(selectedImage);
                        }
                        setShowImageModal(false);
                    }}
                    close={() => setShowImageModal(false)}
                    mediaType="photo"
                />
            </View>
        </SafeAreaView>
    );
};

export default SettingProfile;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },

    backgroundGradient: {
        position: 'absolute',
        width: width,
        height: '100%',
        top: 0,
        left: 0,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 22,
        paddingVertical: 15,
    },

    backArrow: { width: 24, height: 24, tintColor: Colors.black },

    placeholder: { width: 24 },

    content: { paddingHorizontal: 22, paddingTop: 10 },

    profilePictureContainer: { alignItems: 'center', marginBottom: 20 },

    profilePictureBox: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },

    profileImage: { width: '100%', height: '100%' },

    editCam: {
      
        position: 'absolute',
        bottom: 40,
        right: '34%'

    },

    nameLabel: {
        marginTop: 10,
   
        color: Colors.black,
    },

    emailLabel: {

        color: '#9796A1',
        opacity: 0.6,
        marginTop: 2,
    },

    inputContainer: { marginBottom: 20 },

    errorText: {
        marginTop: 5,
        marginLeft: 5,
    },

    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    button: {
        width: width - 44,
        height: 55,
        marginTop: 15,
        borderRadius: 12,
    },

    buttonText: { fontSize: 18 },
});
