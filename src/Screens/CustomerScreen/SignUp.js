import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../Constants/Colors';
import { Font } from '../../Constants/Font';
import Typography from '../../Component/UI/Typography';
import Input from '../../Component/Input';
import Button from '../../Component/Button';
import { ImageConstant } from '../../Constants/ImageConstant';
import { useNavigation, useRoute } from '@react-navigation/native';
import { validateMobileNumber } from '../../Utils/Validation';
import { customerSignup } from '../../Backend/CustomerAPI';
import SimpleToast from 'react-native-simple-toast';
import ImageModal from '../../Component/Modals/ImageModal';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const SignUp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userType = route?.params?.userType || 'customer';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const number = route?.params?.phoneNumber || '';
  const [phoneNumber, setPhoneNumber] = useState(number);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNameChange = (value) => {
    setName(value);
    if (nameError) {
      setNameError('');
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handlePhoneChange = (value) => {
    setPhoneNumber(number);
    if (phoneError) {
      setPhoneError('');
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = () => {
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Validate phone number
    const validation = validateMobileNumber(phoneNumber);
    if (!validation.isValid) {
      if (validation.errors.includes('mobile_required')) {
        setPhoneError('Phone number is required');
      } else if (validation.errors.includes('mobile_too_short')) {
        setPhoneError('Phone number must be 10 digits');
      } else if (validation.errors.includes('mobile_too_long')) {
        setPhoneError('Phone number must be 10 digits');
      } else if (validation.errors.includes('mobile_invalid')) {
        setPhoneError('Please enter a valid phone number');
      } else if (validation.errors.includes('mobile_invalid_format')) {
        setPhoneError('Phone number must contain only digits');
      } else {
        setPhoneError('Please enter a valid phone number');
      }
      isValid = false;
    }

    // Validate Terms and Conditions
    if (!agreeToTerms) {
      setTermsError('Please agree to Terms and Conditions');
      isValid = false;
    } else {
      setTermsError('');
    }

    if (!isValid) {
      return;
    }

    // If validation passes, call signup API first
    setLoading(true);

    // Create FormData for signup
    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('email', email.trim());
    formData.append('number', number.trim());

    // Add profile picture if selected
    if (profilePicture) {
      formData.append('profile_picture', {
        uri: profilePicture.path || profilePicture.uri,
        type: profilePicture.mime || 'image/jpeg',
        name: profilePicture.filename || 'profile_picture.jpg',
      });
    }

    customerSignup(
      formData,
      (response) => {
        setLoading(false);
        console.log('Signup API called successfully:', response);
        SimpleToast.show('OTP sent to your phone', SimpleToast.SHORT);
        // Navigate to OTP screen for verification
        navigation.navigate('OTPVerify', {
          phoneNumber: validation.cleanMobile,
          userType: userType,
          isSignUp: true,
        });
      },
      (error) => {
        setLoading(false);
        console.log('Signup error:', error);
        const errorMessage = error?.data?.message || error?.message || 'Failed to create account. Please try again.';
        SimpleToast.show(errorMessage, SimpleToast.SHORT);
        // Show error on appropriate field
        if (errorMessage.toLowerCase().includes('email')) {
          setEmailError(errorMessage);
        } else if (errorMessage.toLowerCase().includes('phone') || errorMessage.toLowerCase().includes('number')) {
          setPhoneError(errorMessage);
        } else {
          setPhoneError(errorMessage);
        }
      },
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.lightGreen }}>
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.white, Colors.lightGreen]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.backgroundGradient}
        />

        {/* Fixed Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={ImageConstant.BackArrow}
              style={styles.backArrow}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image
              source={ImageConstant.zyara}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.placeholder} />
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {/* Content */}
            <View style={styles.content}>
              <Typography
                size={35}
                type={Font.GeneralSans_Bold}
                color="#00210B"
                style={styles.title}>
                Sign Up
              </Typography>

              <Typography
                size={20}
                type={Font.GeneralSans_Regular}
                color="#383838"
                style={styles.subtitle}>
                Create your account{'\n'}to get started.
              </Typography>

              {/* Profile Picture Upload */}
              <View style={styles.profilePictureContainer}>
                <Typography
                  size={16}
                  type={Font.GeneralSans_Medium}
                  color={Colors.black}
                  style={styles.profilePictureTitle}>
                  Profile Picture
                </Typography>
                <TouchableOpacity
                  style={styles.profilePictureBox}
                  onPress={() => setShowImageModal(true)}
                  activeOpacity={0.7}>
                  {profilePicture ? (
                    <Image
                      source={{ uri: profilePicture.path || profilePicture.uri }}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.profilePlaceholder}>
                      <Typography
                        size={40}
                        type={Font.GeneralSans_Regular}
                        color={Colors.gray}>
                        📷
                      </Typography>
                      <Typography
                        size={12}
                        type={Font.GeneralSans_Regular}
                        color={Colors.gray}
                        style={styles.profilePlaceholderText}>
                        Tap to upload
                      </Typography>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Input
                  title="Full Name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={handleNameChange}
                  keyboardType="default"
                  showTitle={true}
                  placeholderTextColor="rgba(0, 0, 0, 0.5)"
                  error={nameError}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  title="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  keyboardType="email-address"
                  showTitle={true}
                  placeholderTextColor="rgba(0, 0, 0, 0.5)"
                  error={emailError}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  title="Phone Number"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  editable={false}
                  onChange={handlePhoneChange}
                  keyboardType="phone-pad"
                  showTitle={true}
                  placeholderTextColor="rgba(0, 0, 0, 0.5)"
                  error={phoneError}
                  maxLength={10}
                />
              </View>

              {/* Terms and Conditions */}
              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={styles.toggleContainer}
                  onPress={() => {
                    setAgreeToTerms(!agreeToTerms);
                    if (termsError) {
                      setTermsError('');
                    }
                  }}
                  activeOpacity={0.7}>
                  <View
                    style={[
                      styles.toggle,
                      agreeToTerms && styles.toggleActive,
                    ]}>
                    {agreeToTerms ? (
                      <View style={styles.toggleCircle} />
                    ) : (
                      <View style={styles.toggleCircleOff} />
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('CMSScreen', { slug: 'terms-conditions' })}
                  activeOpacity={0.7}
                  style={styles.termsTextContainer}>
                  <Text style={styles.termsText}>
                    <Text style={styles.termsTextRegular}>
                      By sign-up, you agree to our{' '}
                    </Text>
                    <Text style={styles.termsLink}>
                      Terms and Conditions
                    </Text>
                    <Text style={styles.termsTextRegular}>
                      .
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
              {termsError ? (
                <Typography
                  size={12}
                  type={Font.GeneralSans_Regular}
                  color={Colors.red}
                  style={styles.errorText}>
                  {termsError}
                </Typography>
              ) : null}

              <Button
                title={loading ? "SENDING..." : "SEND OTP"}
                onPress={handleSignUp}
                style={styles.button}
                linerColor={[Colors.zyaraGreen, Colors.zyaraGreen]}
                title_style={styles.buttonText}
                disabled={loading}
              />
            </View>
          </ScrollView>
          {/* <TouchableOpacity
          style={styles.signinLink}
          onPress={() => navigation.goBack()}>
          <Typography
            size={16}
            type={Font.GeneralSans_Regular}
            color={Colors.black}
            style={styles.signinText}>
            Already have an account?{' '}
            <Typography
              size={16}
              type={Font.GeneralSans_Semibold}
              color={Colors.zyaraGreen}>
              Sign In
            </Typography>
          </Typography>
        </TouchableOpacity> */}
        </KeyboardAvoidingView>

        {/* Image Modal for Profile Picture */}
        <ImageModal
          showModal={showImageModal}
          selected={(images) => {
            if (images && images.length > 0) {
              setProfilePicture(images[0]);
            }
            setShowImageModal(false);
          }}
          close={() => setShowImageModal(false)}
          mediaType="photo"
        />
      </View>
    </SafeAreaView>);
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  backgroundGradient: {
    position: 'absolute',
    width: width,
    height: '100%',
    top: 0,
    left: 0,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 20,
    zIndex: 10,
  },
  backArrow: {
    width: 24,
    height: 24,
    tintColor: Colors.black,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 72,
    height: 30,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  title: {
    marginBottom: 15,
  },
  subtitle: {
    marginBottom: 30,
    letterSpacing: 0.02,
  },
  inputContainer: {
    marginBottom: 20,
  },
  button: {
    width: width - 44,
    height: 60,
    marginVertical: 20,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 18,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  signinLink: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  signinText: {
    textAlign: 'center',
  },
  profilePictureContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  profilePictureTitle: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  profilePictureBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  profilePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    tintColor: Colors.gray,
    marginBottom: 5,
  },
  profilePlaceholderText: {
    textAlign: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    marginTop: 10,
  },
  toggleContainer: {
    marginRight: 10,
    marginTop: 2,
  },
  toggle: {
    width: 50,
    height: 29.31,
    backgroundColor: '#DDDDDD',
    borderRadius: 17.5,
    justifyContent: 'center',
    paddingHorizontal: 3.41,
  },
  toggleActive: {
    backgroundColor: Colors.zyaraGreen,
  },
  toggleCircle: {
    width: 22.73,
    height: 22.73,
    borderRadius: 11.365,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-end',
  },
  toggleCircleOff: {
    width: 22.73,
    height: 22.73,
    borderRadius: 11.365,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: 16,
    fontFamily: Font.GeneralSans_Regular,
    color: Colors.black,
    letterSpacing: 0.02,
    lineHeight: 24,
    flexWrap: 'wrap',
  },
  termsTextRegular: {
    fontFamily: Font.GeneralSans_Regular,
    color: Colors.black,
  },
  termsLink: {
    fontFamily: Font.GeneralSans_Medium,
    color: Colors.zyaraGreen,
    textDecorationLine: 'underline',
  },
  errorText: {
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 22,
  },
});

