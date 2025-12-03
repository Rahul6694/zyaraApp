import React, { useState, useRef } from 'react';
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
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { Colors } from '../../Constants/Colors';
import { Font } from '../../Constants/Font';
import Typography from '../../Component/UI/Typography';
import Button from '../../Component/Button';
import { ImageConstant } from '../../Constants/ImageConstant';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { validateOTP } from '../../Utils/Validation';
import { beauticianVerifyOTP, beauticianResendOTPSignup, beauticianSendOTP } from '../../Backend/BeauticianAPI';
import SimpleToast from 'react-native-simple-toast';
import ScreenHeader from '../../Component/ScreenHeader';
import { Token, setUserType, isAuth, userDetails } from '../../Redux/action';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CELL_COUNT = 4;

const OTPVerify = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const phoneNumber = route?.params?.phoneNumber || '+91 9977787907';
  const userType = route?.params?.userType || 'beautician';
  const step = route?.params?.step;

  const isLogin = route?.params?.isLogin || false;
  const [value, setValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleOTPChange = (text) => {
    setValue(text);
    if (otpError) {
      setOtpError('');
    }
  };

  const handleSubmit = () => {
    // Validate OTP (4 digits)
    if (value.length !== CELL_COUNT) {
      setOtpError('Please enter 4 digit code');
      return;
    }

    if (!/^\d+$/.test(value)) {
      setOtpError('OTP must contain only digits');
      return;
    }

    // If validation passes, verify OTP via API
    setOtpError('');
    setLoading(true);

    const requestData = {
      number: phoneNumber,
      otp: value,
    };

    beauticianVerifyOTP(
      requestData,
      (response) => {
        setLoading(false);
        console.log('OTP verified successfully:', response);
        SimpleToast.show('OTP verified successfully', SimpleToast.SHORT);
        const token = response?.token || response?.data?.token || response?.data?.access_token;
        const beauticianId = response?.beautician_id || response?.data?.beautician_id || response?.data?.id;
        const userData = response?.beautician || response?.user || response?.data?.beautician || response?.data?.user || response?.data || {};
        if (step === 0) {
          navigation.navigate('KYCVerificationStep1', {
            userType: userType,
            token: token,
            beauticianId: beauticianId,
          });
        } else {
          dispatch(Token(token));
          dispatch(isAuth(true));
          dispatch(setUserType('beautician'));

          // Save user details to Redux
          if (userData && Object.keys(userData).length > 0) {
            dispatch(userDetails(userData));
          }

          // Navigate to Home screen
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home', params: { userType: 'beautician' } }],
          });
        }


      },
      (error) => {
        setLoading(false);
        console.log('OTP verification error:', error);
        const errorMessage = error?.data?.message || error?.message || 'Invalid OTP. Please try again.';
        SimpleToast.show(errorMessage, SimpleToast.SHORT);
        setOtpError(errorMessage);
      },
    );
  };

  const handleResend = () => {
    setValue('');
    setOtpError('');
    setResending(true);

    if (isLogin) {
      // For login flow - use send-otp API
      const requestData = {
        phone: phoneNumber,
      };

      beauticianSendOTP(
        requestData,
        (response) => {
          setResending(false);
          console.log('OTP resent successfully:', response);
          SimpleToast.show('OTP resent successfully', SimpleToast.SHORT);
        },
        (error) => {
          setResending(false);
          console.log('Resend OTP error:', error);
          const errorMessage = error?.data?.message || error?.message || 'Failed to resend OTP. Please try again.';
          SimpleToast.show(errorMessage, SimpleToast.SHORT);
        },
      );
    } else {
      // For signup flow - use send-otp API (same as initial send)
      const requestData = {
        phone: phoneNumber,
      };

      beauticianSendOTP(
        requestData,
        (response) => {
          setResending(false);
          console.log('OTP resent successfully:', response);
          SimpleToast.show('OTP resent successfully', SimpleToast.SHORT);
        },
        (error) => {
          setResending(false);
          console.log('Resend OTP error:', error);
          const errorMessage = error?.data?.message || error?.message || 'Failed to resend OTP. Please try again.';
          SimpleToast.show(errorMessage, SimpleToast.SHORT);
        },
      );
    }
  };

  const handleChangeNumber = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.lightGreen }}>
      <View style={styles.container}>


        {/* Background Gradient */}
        <LinearGradient
          colors={[Colors.white, Colors.lightGreen]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.backgroundGradient}
        />

        {/* Fixed Header */}
        <ScreenHeader showLogo={true} style={{ paddingTop: 10 }} showGreenLine={false} />

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
                OTP Verify
              </Typography>

              <Typography
                size={20}
                type={Font.GeneralSans_Regular}
                color="#383838"
                style={styles.subtitle}>
                Please enter {CELL_COUNT} digit code sent to you at {phoneNumber}
              </Typography>

              {/* OTP Label */}
              <Typography
                size={16}
                type={Font.GeneralSans_Regular}
                color="#282727"
                style={styles.otpLabel}>
                OTP
              </Typography>

              {/* OTP Input */}
              <View style={styles.otpContainer}>
                <CodeField
                  ref={ref}
                  {...props}
                  value={value}
                  onChangeText={handleOTPChange}
                  cellCount={CELL_COUNT}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  renderCell={({ index, symbol, isFocused }) => (
                    <View
                      key={index}
                      style={[
                        styles.cell,
                        isFocused && styles.focusCell,
                      ]}
                      onLayout={getCellOnLayoutHandler(index)}>
                      <Typography
                        size={24}
                        type={Font.GeneralSans_Medium}
                        color={Colors.black}
                        style={styles.cellText}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Typography>
                    </View>
                  )}
                />
                {otpError && (
                  <Typography
                    size={12}

                    type={Font.GeneralSans_Regular}
                    color={Colors.red}
                    style={styles.errorText}>
                    {otpError}
                  </Typography>
                )}
              </View>

              <Button
                title={loading ? "VERIFYING..." : "SUBMIT"}
                onPress={handleSubmit}
                style={styles.button}
                linerColor={[Colors.zyaraGreen, Colors.zyaraGreen]}
                title_style={styles.buttonText}
                disabled={loading}
              />
            </View>
          </ScrollView>
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={handleResend} disabled={resending}>
              <Typography
                size={16}
                type={Font.GeneralSans_Regular}
                color={resending ? Colors.gray : Colors.black}
                style={styles.linkText}>
                {resending ? 'Resending...' : (
                  <>
                    Didn't get the code{' '}
                    <Typography
                      size={16}
                      type={Font.GeneralSans_Semibold}
                      color={Colors.zyaraGreen}>
                      Resend Code
                    </Typography>
                  </>
                )}
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleChangeNumber} style={styles.changeNumber}>
              <Typography
                size={14}
                type={Font.GeneralSans_Medium}
                color={Colors.zyaraGreen}
                style={styles.changeNumberText}>
                Change Number
              </Typography>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>);
};

export default OTPVerify;

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
    paddingBottom: 20,
  },
  logo: {
    width: 72,
    height: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  title: {
    marginBottom: 15,

  },
  otpLabel: {
    marginTop: 20
  },
  subtitle: {
    marginBottom: 20,

  },
  otpContainer: {
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  cell: {
    width: '22%',
    height: 70,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    backgroundColor: Colors.white,

  },
  focusCell: {
    borderColor: Colors.zyaraGreen,
    borderWidth: 2,
  },
  cellText: {
    textAlign: 'center',
  },
  errorText: {
    marginTop: 10,
    textAlign: 'right'
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
  linksContainer: {
    alignItems: 'center',

    marginBottom: 10
  },
  linkText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  changeNumberText: {
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});
