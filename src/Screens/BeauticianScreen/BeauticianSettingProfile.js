import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../Constants/Colors';
import Input from '../../Component/Input';
import Button from '../../Component/Button';
import { ImageConstant } from '../../Constants/ImageConstant';
import { useNavigation } from '@react-navigation/native';
import ImageModal from '../../Component/Modals/ImageModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../Component/ScreenHeader';
import Typography from '../../Component/UI/Typography';
import { Font } from '../../Constants/Font';

const { width } = Dimensions.get('window');

const BeauticianSettingProfile = () => {
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [brandName, setBrandName] = useState(''); // FIXED
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [loading, setLoading] = useState(false);

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


                <ScreenHeader title="Profile Setup" showGreenLine={true} />




                {/* Body */}
                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.content}>
                            <Typography color='#0A0A0A' size={16} marginBottom={19} type={Font.GeneralSans_Medium}> Profile Photo</Typography>
                            {/* Profile Photo */}
                            <View style={styles.profilePictureContainer}>
                                <View style={styles.profilePictureBox}>
                                    {profilePicture ? (
                                        <Image
                                            source={{ uri: profilePicture.path || profilePicture.uri }}
                                            style={styles.profileImage}
                                        />
                                    ) : (
                                        <Image
                                            source={ImageConstant.girl}
                                            style={styles.profileImage}
                                            resizeMode="cover"
                                        />
                                    )}
                                </View>

                                {/* Camera Icon FIXED */}
                                <TouchableOpacity
                                    style={styles.editCam}
                                    onPress={() => setShowImageModal(true)}
                                >
                                    <Image
                                        source={ImageConstant.editcammra}
                                        style={{ height: 42, width: 42, resizeMode: 'contain' }}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Input Fields */}
                            <View style={styles.inputContainer}>
                                <Input
                                    source={ImageConstant.user}
                                    showImage={true}
                                    title="Full Name"
                                    placeholder="Enter Name"
                                    value={name}
                                    onChange={setName}
                                    keyboardType="default"
                                    showTitle={true}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Input
                                    source={ImageConstant.user}
                                    showImage={true}
                                    title="Salon/Brand Name"
                                    placeholder="Enter salon name"
                                    value={brandName}
                                    onChange={setBrandName}
                                    keyboardType="default"
                                    showTitle={true}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Input
                                    title="Phone Number"
                                    placeholder="Enter Mobile Number"
                                    value={phoneNumber}
                                    onChange={setPhoneNumber}
                                    keyboardType="number-pad"
                                    countryPicker={true}
                                    showTitle={true}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Input
                                    source={ImageConstant.email}
                                    showImage={true}
                                    title="Email Address"
                                    placeholder="example@gmail.com"
                                    value={email}
                                    onChange={setEmail}
                                    keyboardType="email-address"
                                    showTitle={true}
                                />
                            </View>

                            {/* Update Button */}
                            <Button
                                title={loading ? 'UPDATING...' : 'UPDATE'}
                                onPress={() => console.log('Update pressed')}
                                style={styles.button}
                                linerColor={[Colors.zyaraGreen, Colors.zyaraGreen]}
                                title_style={styles.buttonText}
                                disabled={loading}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                {/* Image Picker Modal */}
                <ImageModal
                    showModal={showImageModal}
                    selected={(images) => {
                        if (images?.length) setProfilePicture(images[0]);
                        setShowImageModal(false);
                    }}
                    close={() => setShowImageModal(false)}
                    mediaType="photo"
                />
            </View>
        </SafeAreaView>
    );
};

export default BeauticianSettingProfile;

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

    keyboardView: { flex: 1, paddingTop: 20 },

    scrollContent: {
        paddingBottom: 40,
    },

    content: { paddingHorizontal: 22, paddingTop: 10 },

    profilePictureContainer: {
        marginBottom: 30,

    },

    profilePictureBox: {
        width: 120,
        height: 120,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },

    profileImage: { width: '100%', height: '100%' },

    // FIXED CAMERA POSITION
    editCam: {
        position: 'absolute',
        bottom: -15,
        left: 80,
    },

    inputContainer: { marginBottom: 20 },

    button: {
        width: width - 44,
        height: 55,
        marginTop: 15,
        borderRadius: 12,
        alignSelf: 'center',
    },

    buttonText: { fontSize: 18 },
});
