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
import {beauticianSendOTP} from '../../Backend/BeauticianAPI';
import SimpleToast from 'react-native-simple-toast';
import ScreenHeader from '../../Component/ScreenHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');

const Login = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userType = route?.params?.userType || 'beautician';
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
      phone: validation.cleanMobile,
    };

    beauticianSendOTP(
      requestData,
      (response) => {
        setLoading(false);
        console.log('OTP sent successfully:', response);
        SimpleToast.show('OTP sent successfully', SimpleToast.SHORT);
        // Navigate to OTP screen for login
        navigation.navigate('OTPVerify', {
          phoneNumber: validation.cleanMobile,
          userType: userType,
          isLogin: true,
          step: response.data.signup_step
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
    <SafeAreaView style={{flex:1,  backgroundColor:Colors.lightGreen}}>
    <View style={styles.container}>
 
      
      <LinearGradient
        colors={[Colors.white, Colors.lightGreen]}
        start={{x: 0, y: 1}}
        end={{x: 0, y: 0}}
        style={styles.backgroundGradient}
      />

      {/* Fixed Header */}
      <ScreenHeader style={{paddingTop:10}} showLogo={true} showGreenLine={false} />

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
              Login
            </Typography>

            <Typography
              size={20}
              type={Font.GeneralSans_Regular}
              color="#383838"
              style={styles.subtitle}>
              Welcome back!{'\n'}Please login to continue.
            </Typography>

            <View style={styles.inputContainer}>
              <Input
                title="Phone Number"
                placeholder="Enter your phone number"
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
        {/* <TouchableOpacity 
          style={styles.signupLink}
          onPress={() => navigation.navigate('SignIn')}>
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
              SignUp here 
            </Typography>
          </Typography>
        </TouchableOpacity> */}
      </KeyboardAvoidingView>
    </View>
    </SafeAreaView>
  );
};

export default Login;

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
  signupLink: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  signupText: {
    textAlign: 'center',
  },
});

