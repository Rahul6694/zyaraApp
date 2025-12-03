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
import Typography from '../../Component/UI/Typography';
import Input from '../../Component/Input';
import Button from '../../Component/Button';
import { ImageConstant } from '../../Constants/ImageConstant';
import { useNavigation } from '@react-navigation/native';
import ImageModal from '../../Component/Modals/ImageModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Font } from '../../Constants/Font';

const { width } = Dimensions.get('window');

const SignUp = () => {
    const navigation = useNavigation();

    const [name, setName] = useState('rohtash');
    const [email, setEmail] = useState('rohtashverma2580@gmail.com');
    const [phoneNumber, setPhoneNumber] = useState('6283721954');
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

                                {/* Camera Icon */}
                                <TouchableOpacity style={styles.editCam} onPress={() => setShowImageModal(true)}>
                                    <Image
                                        source={ImageConstant.editcammra}
                                        style={{ height: 42, width: 42, resizeMode: 'contain' }}
                                    />
                                </TouchableOpacity>


                                <Typography style={styles.nameLabel} size={24} type={Font.GeneralSans_Bold}>{name}</Typography>
                                <Typography style={styles.emailLabel} size={18}>{email}</Typography>
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
                                    placeholderTextColor="rgba(0,0,0,0.5)"
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
                                    placeholderTextColor="rgba(0,0,0,0.5)"
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
                                    placeholderTextColor="rgba(0,0,0,0.5)"
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

export default SignUp;

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

    button: {
        width: width - 44,
        height: 55,
        marginTop: 15,
        borderRadius: 12,
    },

    buttonText: { fontSize: 18 },
});
