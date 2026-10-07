import React, { useState, useRef, useEffect } from 'react';
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
const CELL_GAP = 14;
// Boxes span exactly the button width (screen minus 22px padding each side)
const CELL_SIZE = Math.min((width - 44 - CELL_GAP * (CELL_COUNT - 1)) / CELL_COUNT, 72);
const RESEND_SECONDS = 30;

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
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const displayPhone = String(phoneNumber).startsWith('+') ? phoneNumber : `+91 ${phoneNumber}`;
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });

  // Countdown before the code can be resent
  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }
    const timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);
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
          setSecondsLeft(RESEND_SECONDS);
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
          setSecondsLeft(RESEND_SECONDS);
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
                size={32}
                type={Font.GeneralSans_Bold}
                color={Colors.textPrimary}
                style={styles.title}>
                OTP Verify
              </Typography>

              <Typography
                size={16}
                type={Font.GeneralSans_Regular}
                color={Colors.textSecondary}
                style={styles.subtitle}>
                Please enter the {CELL_COUNT} digit code sent to{'\n'}
                <Typography size={16} type={Font.GeneralSans_Semibold} color={Colors.textPrimary}>
                  {displayPhone}
                </Typography>
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
                  autoFocus
                  renderCell={({ index, symbol, isFocused }) => (
                    <View
                      key={index}
                      style={[
                        styles.cell,
                        symbol && styles.filledCell,
                        isFocused && styles.focusCell,
                        !!otpError && styles.errorCell,
                      ]}
                      onLayout={getCellOnLayoutHandler(index)}>
                      <Typography
                        size={26}
                        type={Font.GeneralSans_Semibold}
                        color={Colors.textPrimary}
                        style={styles.cellText}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Typography>
                    </View>
                  )}
                />
                {!!otpError && (
                  <Typography
                    size={13}
                    type={Font.GeneralSans_Medium}
                    color={Colors.danger}
                    style={styles.errorText}>
                    {otpError}
                  </Typography>
                )}
              </View>

              <Button
                title="Verify"
                onPress={handleSubmit}
                style={styles.button}
                title_style={styles.buttonText}
                loader={loading}
              />
            </View>
          </ScrollView>
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={handleResend} disabled={resending || secondsLeft > 0}>
              <Typography
                size={15}
                type={Font.GeneralSans_Regular}
                color={Colors.textSecondary}
                style={styles.linkText}>
                {resending ? 'Resending...' : (
                  <>
                    Didn't get the code?{' '}
                    <Typography
                      size={15}
                      type={Font.GeneralSans_Semibold}
                      color={secondsLeft > 0 ? Colors.textMuted : Colors.zyaraGreen}>
                      {secondsLeft > 0
                        ? `Resend in 0:${String(secondsLeft).padStart(2, '0')}`
                        : 'Resend Code'}
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
    marginBottom: 10,
  },
  subtitle: {
    lineHeight: 24,
    marginBottom: 32,
  },
  otpContainer: {
    marginBottom: 12,
  },
  codeFieldRoot: {
    width: '100%',
    justifyContent: 'space-between',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  filledCell: {
    borderColor: Colors.zyaraGreen,
    backgroundColor: Colors.brandTint,
  },
  focusCell: {
    borderColor: Colors.zyaraGreen,
    borderWidth: 2,
  },
  errorCell: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerSoft,
  },
  cellText: {
    textAlign: 'center',
  },
  errorText: {
    marginTop: 10,
  },
  button: {
    width: width - 44,
    marginVertical: 12,
  },
  buttonText: {
    letterSpacing: 0.5,
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
