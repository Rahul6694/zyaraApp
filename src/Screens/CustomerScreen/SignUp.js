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
import ScreenHeader from '../../Component/ScreenHeader';

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
        <ScreenHeader
          showLogo={true}
          showGreenLine={false}
          style={{ paddingTop: 10 }}
          onBackPress={() => navigation.navigate('Onboarding')}
        />

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
                size={32}
                type={Font.GeneralSans_Bold}
                color={Colors.textPrimary}
                style={styles.title}>
                Sign Up
              </Typography>

              <Typography
                size={16}
                type={Font.GeneralSans_Regular}
                color={Colors.textSecondary}
                style={styles.subtitle}>
                Create your account to get started.
              </Typography>

              {/* Profile Picture Upload */}
              <View style={styles.profilePictureContainer}>
                <TouchableOpacity
                  onPress={() => setShowImageModal(true)}
                  activeOpacity={0.8}>
                  <View style={styles.profilePictureBox}>
                    {profilePicture ? (
                      <Image
                        source={{ uri: profilePicture.path || profilePicture.uri }}
                        style={styles.profileImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Typography
                        size={40}
                        type={Font.GeneralSans_Semibold}
                        color={Colors.zyaraGreen}>
                        {name.trim() ? name.trim().charAt(0).toUpperCase() : '+'}
                      </Typography>
                    )}
                  </View>
                  <Image
                    source={ImageConstant.editcammra}
                    style={styles.cameraBadge}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Typography
                  size={14}
                  type={Font.GeneralSans_Medium}
                  color={Colors.textSecondary}
                  style={styles.profilePlaceholderText}>
                  {profilePicture ? 'Change profile photo' : 'Add profile photo (optional)'}
                </Typography>
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
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  activeOpacity={0.7}>
                  <View
                    style={[
                      styles.checkbox,
                      agreeToTerms && styles.checkboxActive,
                      !!termsError && styles.checkboxError,
                    ]}>
                    {agreeToTerms && <View style={styles.checkmark} />}
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
                title="Send OTP"
                onPress={handleSignUp}
                style={styles.button}
                title_style={styles.buttonText}
                loader={loading}
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
    backgroundColor: Colors.white,
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
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  title: {
    marginBottom: 6,
  },
  subtitle: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 4,
  },
  button: {
    width: width - 44,
    marginVertical: 12,
  },
  buttonText: {
    letterSpacing: 0.5,
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
    marginBottom: 24,
    alignItems: 'center',
  },
  profilePictureBox: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: Colors.brandSoft,
    borderWidth: 2,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#0F2A1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  cameraBadge: {
    position: 'absolute',
    right: -4,
    bottom: -2,
    width: 36,
    height: 36,
  },
  profilePlaceholderText: {
    textAlign: 'center',
    marginTop: 10,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  toggleContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.greyBorder,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.zyaraGreen,
    borderColor: Colors.zyaraGreen,
  },
  checkboxError: {
    borderColor: Colors.danger,
  },
  // Tick drawn with two borders of a rotated box
  checkmark: {
    width: 6,
    height: 11,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.white,
    transform: [{ rotate: '45deg' }],
    marginTop: -2,
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Font.GeneralSans_Regular,
    color: Colors.textSecondary,
  },
  termsTextRegular: {
    fontFamily: Font.GeneralSans_Regular,
    color: Colors.textSecondary,
  },
  termsLink: {
    fontFamily: Font.GeneralSans_Medium,
    color: Colors.zyaraGreen,
    textDecorationLine: 'underline',
  },
  errorText: {
    marginBottom: 4,
    marginLeft: 34,
  },
});

