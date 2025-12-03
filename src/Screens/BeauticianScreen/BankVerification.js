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
import {useDispatch} from 'react-redux';
import {beauticianSignupStep4} from '../../Backend/BeauticianAPI';
import SimpleToast from 'react-native-simple-toast';
import ScreenHeader from '../../Component/ScreenHeader';
import {isAuth, setUserType, userDetails, Token} from '../../Redux/action';
import { SafeAreaView } from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');

const BankVerification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const token = route?.params?.token;
  const beauticianId = route?.params?.beauticianId;
  const [formData, setFormData] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    }
    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (formData.accountNumber.length < 9 || formData.accountNumber.length > 18) {
      newErrors.accountNumber = 'Account number must be 9-18 digits';
    }
    if (!formData.confirmAccountNumber.trim()) {
      newErrors.confirmAccountNumber = 'Please confirm account number';
    } else if (formData.accountNumber !== formData.confirmAccountNumber) {
      newErrors.confirmAccountNumber = 'Account numbers do not match';
    }
    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())) {
      newErrors.ifscCode = 'Please enter a valid IFSC code';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!token) {
      SimpleToast.show('Authentication token missing', SimpleToast.SHORT);
      return;
    }

    setLoading(true);

    const step4Data = {
      account_holder_name: formData.accountHolderName.trim(),
      bank_name: formData.bankName.trim(),
      account_number: formData.accountNumber.trim(),
      ifsc_code: formData.ifscCode.trim().toUpperCase(),
    };

    beauticianSignupStep4(
      step4Data,
      token,
      (response) => {
        setLoading(false);
        console.log('Step 4 completed successfully:', response);
        SimpleToast.show('Bank account submitted for verification', SimpleToast.SHORT);
        
        // Extract user data from response
        const userData = response?.beautician || response?.user || response?.data?.beautician || response?.data?.user || response?.data || {};
        const responseToken = response?.token || response?.data?.token || response?.data?.access_token || token;
        
        // Save token to Redux (use response token if available, otherwise use existing token)
        if (responseToken) {
          dispatch(Token(responseToken));
        }
        
        // Set auth state after signup is complete
        dispatch(isAuth(true));
        dispatch(setUserType('beautician'));
        
        // Save user details to Redux
        if (userData && Object.keys(userData).length > 0) {
          dispatch(userDetails(userData));
        }
        
        // Navigate to Home after successful submission
        navigation.reset({
          index: 0,
          routes: [{name: 'Home', params: {userType: 'beautician'}}],
        });
      },
      (error) => {
        setLoading(false);
        console.log('Step 4 error:', error);
        const errorMessage = error?.data?.message || error?.message || 'Failed to submit bank details. Please try again.';
        SimpleToast.show(errorMessage, SimpleToast.SHORT);
      },
    );
  };

  const handleSaveAccount = () => {
    // Validate required fields for save
    if (!formData.accountHolderName.trim() || !formData.bankName.trim() || 
        !formData.accountNumber.trim() || !formData.ifscCode.trim()) {
      SimpleToast.show('Please fill all required fields', SimpleToast.SHORT);
      return;
    }

    if (!token) {
      SimpleToast.show('Authentication token missing', SimpleToast.SHORT);
      return;
    }

    setSaving(true);

    const step4Data = {
      account_holder_name: formData.accountHolderName.trim(),
      bank_name: formData.bankName.trim(),
      account_number: formData.accountNumber.trim(),
      ifsc_code: formData.ifscCode.trim().toUpperCase(),
    };

    beauticianSignupStep4(
      step4Data,
      token,
      (response) => {
        setSaving(false);
        console.log('Bank account saved successfully:', response);
        SimpleToast.show('Bank account saved successfully', SimpleToast.SHORT);
        
        // Extract user data from response
        const userData = response?.beautician || response?.user || response?.data?.beautician || response?.data?.user || response?.data || {};
        const responseToken = response?.token || response?.data?.token || response?.data?.access_token || token;
        
        // Save token to Redux (use response token if available, otherwise use existing token)
        if (responseToken) {
          dispatch(Token(responseToken));
        }
        
        // Set auth state after signup is complete
        dispatch(isAuth(true));
        dispatch(setUserType('beautician'));
        
        // Save user details to Redux
        if (userData && Object.keys(userData).length > 0) {
          dispatch(userDetails(userData));
        }
        
        // Navigate to Home
        navigation.reset({
          index: 0,
          routes: [{name: 'Home', params: {userType: 'beautician'}}],
        });
      },
      (error) => {
        setSaving(false);
        console.log('Save account error:', error);
        const errorMessage = error?.data?.message || error?.message || 'Failed to save bank account. Please try again.';
        SimpleToast.show(errorMessage, SimpleToast.SHORT);
      },
    );
  };

  return (
    <SafeAreaView style={{flex:1,  backgroundColor:Colors.lightGreen}}>
    <View style={styles.container}>
 

      <LinearGradient
        colors={[Colors.lightGreen, Colors.white]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.backgroundGradient}
      />

      {/* Fixed Header */}
      <ScreenHeader title="Bank Verification" showGreenLine={true} />

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
              size={26}
              type={Font.GeneralSans_Semibold}
              color={Colors.black}
              style={styles.title}>
              Add Bank Account
            </Typography>

            <Typography
              size={18}
              type={Font.GeneralSans_Regular}
              color="#505050"
              style={styles.subtitle}>
              Bank verification
            </Typography>

            <View style={styles.inputContainer}>
              <Typography
                size={16}
                type={Font.GeneralSans_Medium}
                color="#0A0A0A"
                style={styles.inputTitle}>
                Account Holder Name
              </Typography>
              <Input
                placeholder="Enter account holder's name"
                value={formData.accountHolderName}
                onChange={value => handleInputChange('accountHolderName', value)}
                showTitle={false}
                placeholderTextColor="#8C8C8C"
                error={errors.accountHolderName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Typography
                size={16}
                type={Font.GeneralSans_Medium}
                color="#0A0A0A"
                style={styles.inputTitle}>
                Bank Name
              </Typography>
              <Input
                placeholder="select"
                value={formData.bankName}
                onChange={value => handleInputChange('bankName', value)}
                showTitle={false}
                placeholderTextColor="#8C8C8C"
                error={errors.bankName}
                onPress={() => {
                  // Handle bank name picker
                }}
              />
            </View>

            <View style={styles.inputContainer}>
              <Typography
                size={16}
                type={Font.GeneralSans_Medium}
                color="#0A0A0A"
                style={styles.inputTitle}>
                Account Number
              </Typography>
              <Input
                placeholder="enter account number"
                value={formData.accountNumber}
                onChange={value => handleInputChange('accountNumber', value)}
                keyboardType="numeric"
                showTitle={false}
                placeholderTextColor="#8C8C8C"
                error={errors.accountNumber}
                maxLength={18}
              />
            </View>

            <View style={styles.inputContainer}>
              <Typography
                size={16}
                type={Font.GeneralSans_Medium}
                color="#0A0A0A"
                style={styles.inputTitle}>
                Confirm Account Number
              </Typography>
              <Input
                placeholder="re-enter account number"
                value={formData.confirmAccountNumber}
                onChange={value => handleInputChange('confirmAccountNumber', value)}
                keyboardType="numeric"
                showTitle={false}
                placeholderTextColor="#8C8C8C"
                error={errors.confirmAccountNumber}
                maxLength={18}
              />
            </View>

            <View style={styles.inputContainer}>
              <Typography
                size={16}
                type={Font.GeneralSans_Medium}
                color="#0A0A0A"
                style={styles.inputTitle}>
                IFSC Code
              </Typography>
              <Input
                placeholder="enter IFSC code"
                value={formData.ifscCode}
                onChange={value => handleInputChange('ifscCode', value.toUpperCase())}
                showTitle={false}
                placeholderTextColor="#8C8C8C"
                error={errors.ifscCode}
                maxLength={11}
              />
            </View>

            <Typography
              size={14}
              type={Font.GeneralSans_Regular}
              color={Colors.black}
              style={styles.infoText}>
              🔒 Your bank details are secure and used only for payouts.
            </Typography>

            <TouchableOpacity
              onPress={handleSaveAccount}
              style={[styles.saveButton, (saving || loading) && {opacity: 0.5}]}
              disabled={saving || loading}>
              <Typography
                size={18}
                type={Font.GeneralSans_Medium}
                color={Colors.zyaraGreen}
                style={styles.saveButtonText}>
                {saving ? "SAVING..." : "SAVE ACCOUNT"}
              </Typography>
            </TouchableOpacity>

            <Button
              title={loading ? "SUBMITTING..." : "SUBMIT FOR VERIFICATION"}
              disabled={loading || saving}
              onPress={handleSubmit}
              style={styles.button}
              linerColor={[Colors.zyaraGreen, Colors.zyaraGreen]}
              title_style={styles.buttonText}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
    </SafeAreaView> );
};

export default BankVerification;

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
    paddingBottom: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  title: {
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  subtitle: {
    marginBottom: 30,
    letterSpacing: 0.02,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputTitle: {
    marginBottom: 10,
  },
  infoText: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  saveButton: {
    width: width - 44,
    height: 60,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.zyaraGreen,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  button: {
    width: width - 44,
    height: 60,
    marginVertical: 10,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 18,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

