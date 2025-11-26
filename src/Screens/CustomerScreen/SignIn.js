import React, {useState} from 'react';
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../Constants/Colors';
import {Font} from '../../Constants/Font';
import Typography from '../../Component/UI/Typography';
import Input from '../../Component/Input';
import Button from '../../Component/Button';
import {ImageConstant} from '../../Constants/ImageConstant';
import {useNavigation, useRoute} from '@react-navigation/native';
import {validateMobileNumber} from '../../Utils/Validation';
import {customerSendOTP} from '../../Backend/CustomerAPI';
import SimpleToast from 'react-native-simple-toast';

const {width} = Dimensions.get('window');

const SignIn = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userType = route?.params?.userType || 'customer';
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (value) => {
    setPhoneNumber(value);
    // Clear error when user starts typing
    if (phoneError) {
      setPhoneError('');
    }
  };

  const handleSendOTP = () => {
    // Validate phone number
    const validation = validateMobileNumber(phoneNumber);
    
    if (!validation.isValid) {
      // Set appropriate error message
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
      return;
    }

    // If validation passes, call API to send OTP
    setPhoneError('');
    setLoading(true);

    const requestData = {
      user_type: 'user',
      phone: validation.cleanMobile,
    };

    customerSendOTP(
      requestData,
      (response) => {
        setLoading(false);
        console.log('OTP sent successfully:', response);
        SimpleToast.show('OTP sent successfully', SimpleToast.SHORT);
        // Navigate to OTP screen
        navigation.navigate('OTPVerify', {
          phoneNumber: validation.cleanMobile,
          userType: userType,
        });
      },
      (error) => {
        setLoading(false);
        console.log('OTP send error:', error);
        const errorMessage = error?.data?.message || error?.message || 'Failed to send OTP. Please try again.';
        SimpleToast.show(errorMessage, SimpleToast.SHORT);
        setPhoneError(errorMessage);
      },
    );
  };

 

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
      
      <LinearGradient
        colors={[Colors.white, Colors.lightGreen]}
        start={{x: 0, y: 1}}
        end={{x: 0, y: 0}}
        style={styles.backgroundGradient}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Header */}
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
           
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Typography
              size={35}
              type={Font.GeneralSans_Bold}
              color="#00210B"
              style={styles.title}>
              Sign In
            </Typography>

            <Typography
              size={20}
              type={Font.GeneralSans_Regular}
              color="#383838"
              style={styles.subtitle}>
              Welcome back!{'\n'}Please sign in to continue.
            </Typography>

            <View style={styles.inputContainer}>
              <Input
                title="Phone Number"
                placeholder="phone number"
                value={phoneNumber}
                onChange={handlePhoneChange}
                keyboardType="phone-pad"
                showTitle={true}
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                error={phoneError}
                maxLength={10}
              />
            </View>

            <Button
              title={loading ? "SENDING..." : "SEND OTP"}
              onPress={handleSendOTP}
              style={styles.button}
              linerColor={[Colors.zyaraGreen, Colors.zyaraGreen]}
              title_style={styles.buttonText}
              disabled={loading}
            />

          
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.signupLink} 
        onPress={()=>navigation.navigate('SignUp')}>
              <Typography
                size={16}
                type={Font.GeneralSans_Regular}
                color={Colors.black}
                style={styles.signupText}>
                Don't have an account?{' '}
                <Typography
                  size={16}
                  type={Font.GeneralSans_Semibold}
                  color={Colors.zyaraGreen}>
                   Signup here
                </Typography>
              </Typography>
            </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignIn;

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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 50,
    paddingBottom: 20,
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
  inputStyle: {
    width: width - 44,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    shadowColor: '#000',
    shadowOffset: {
      width: 15,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 22.5,
    elevation: 8,
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  dividerLine: {
    width: 110,
    height: 1,
    backgroundColor: '#DADADA',
  },
  orText: {
    marginHorizontal: 15,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 10,
    height: 55,
    paddingHorizontal: 15,
  },
  socialIconContainer: {
    marginRight: 10,
  },
  googleIconPlaceholder: {
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
  },
  appleIconPlaceholder: {
    width: 20,
    height: 20,
    backgroundColor: Colors.black,
    borderRadius: 2,
  },
  socialButtonText: {},
  signupLink: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  signupText: {
    textAlign: 'center',
  },
});
