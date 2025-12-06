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
  TextInput,
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
import { beauticianSignupStep2 } from '../../Backend/BeauticianAPI';
import SimpleToast from 'react-native-simple-toast';
import { validateName, validateEmail, validateMobileNumber } from '../../Utils/Validation';
import ScreenHeader from '../../Component/ScreenHeader';
import { getCMSData } from '../../Backend/CMSAPI';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ProfileSetup = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const token = route?.params?.token;
  const number = route?.params?.number;

  const beauticianId = route?.params?.beauticianId;
  const [formData, setFormData] = useState({
    fullName: '',
    salonName: '',
    phoneNumber: '+91',
    email: '',
    location: '',
    experience: '',
  });
  const [errors, setErrors] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
  if (number) {
    setFormData(prev => ({ ...prev, phoneNumber: '+91 ' + number }));
  }
}, [number]);
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleContinue = () => {
    const newErrors = {};

    // Validate Full Name
    const nameValidation = validateName(formData.fullName);
    if (!nameValidation.isValid) {
      if (nameValidation.errors.includes('name_required')) {
        newErrors.fullName = 'Full name is required';
      } else if (nameValidation.errors.includes('name_too_short')) {
        newErrors.fullName = 'Name must be at least 2 characters';
      } else if (nameValidation.errors.includes('name_too_long')) {
        newErrors.fullName = 'Name must be less than 50 characters';
      }
    }

    // Validate Salon/Brand Name
    const salonValidation = validateName(formData.salonName);
    if (!salonValidation.isValid) {
      if (salonValidation.errors.includes('name_required')) {
        newErrors.salonName = 'Salon/Brand name is required';
      } else if (salonValidation.errors.includes('name_too_short')) {
        newErrors.salonName = 'Salon name must be at least 2 characters';
      } else if (salonValidation.errors.includes('name_too_long')) {
        newErrors.salonName = 'Salon name must be less than 50 characters';
      }
    }

    // Validate Email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      if (emailValidation.errors.includes('email_required')) {
        newErrors.email = 'Email is required';
      } else if (emailValidation.errors.includes('email_invalid')) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Validate Phone Number
    const phoneNumber = formData.phoneNumber.replace(/^\+91\s*/, '').trim();
    const phoneValidation = validateMobileNumber(phoneNumber);
    if (!phoneValidation.isValid) {
      if (phoneValidation.errors.includes('mobile_required')) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (phoneValidation.errors.includes('mobile_too_short') || phoneValidation.errors.includes('mobile_too_long')) {
        newErrors.phoneNumber = 'Phone number must be 10 digits';
      } else if (phoneValidation.errors.includes('mobile_invalid')) {
        newErrors.phoneNumber = 'Please enter a valid phone number';
      } else if (phoneValidation.errors.includes('mobile_invalid_format')) {
        newErrors.phoneNumber = 'Phone number must contain only digits';
      }
    }

    // Validate Location
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.trim().length < 3) {
      newErrors.location = 'Location must be at least 3 characters';
    }

    // Validate Experience
    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience is required';
    } else {
      const experienceNum = parseInt(formData.experience, 10);
      if (isNaN(experienceNum) || experienceNum < 0) {
        newErrors.experience = 'Experience must be a valid number';
      } else if (experienceNum > 50) {
        newErrors.experience = 'Experience cannot exceed 50 years';
      }
    }

    // Validate Terms Agreement
    if (!agreeToTerms) {
      newErrors.agreeToTerms = 'Please agree to Terms and Conditions';
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

    // Extract phone number (already validated above)
    const phoneNumberClean = formData.phoneNumber.replace(/^\+91\s*/, '').trim();
    const phoneValidationFinal = validateMobileNumber(phoneNumberClean);
    const cleanPhoneNumber = phoneValidationFinal.cleanMobile;

    // Extract city and state from location (assuming format: "City, State" or just "City")
    const locationParts = formData.location.split(',').map(s => s.trim());
    const city = locationParts[0] || '';
    const state = locationParts[1] || '';

    const step2Data = {
      beautician_id: beauticianId || 0, // Will be set by backend if 0
      name: formData.fullName.trim(),
      number: cleanPhoneNumber,
      email: formData.email.trim(),
      business_name: formData.salonName.trim(),
      city: city,
      state: state,
      address: formData.location.trim(),
      experience: parseInt(formData.experience) || 0,
    };

    beauticianSignupStep2(
      step2Data,
      token,
      (response) => {
        setLoading(false);
        console.log('Step 2 completed successfully:', response);
        SimpleToast.show('Profile details saved successfully', SimpleToast.SHORT);

        // Navigate to Step 3 (KYCVerificationStep2)
        navigation.navigate('KYCVerificationStep2', {
          token: token,
        
          beauticianId: beauticianId || response?.beautician_id || response?.data?.beautician_id,
        });
      },
      (error) => {
        setLoading(false);
        console.log('Step 2 error:', error);
        const errorMessage = error?.data?.message || error?.message || 'Failed to save profile. Please try again.';
        SimpleToast.show(errorMessage, SimpleToast.SHORT);
      },
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.lightGreen }}>
      <View style={styles.container}>

        <LinearGradient
          colors={[Colors.lightGreen, Colors.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.backgroundGradient}
        />
        {/* Fixed Header */}
        <ScreenHeader title="Profile Setup" showGreenLine={true} />
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
                Set Up Your Profile
              </Typography>

              <Typography
                size={18}
                type={Font.GeneralSans_Regular}
                color="#505050"
                style={styles.subtitle}>
                Let your customers know you better
              </Typography>

              <View style={styles.inputContainer}>
                <Input
                  title="Full Name"
                  placeholder="enter full name"
                  value={formData.fullName}
                  onChange={value => handleInputChange('fullName', value)}
                  showTitle={true}
                  placeholderTextColor="#8C8C8C"
                  error={errors.fullName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  title="Salon/Brand Name"
                  placeholder="enter name"
                  value={formData.salonName}
                  onChange={value => handleInputChange('salonName', value)}
                  showTitle={true}
                  placeholderTextColor="#8C8C8C"
                  error={errors.salonName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Typography
                  size={16}
                  type={Font.GeneralSans_Medium}
                  color="#0A0A0A"
                  style={styles.inputTitle}>
                  Phone Number
                </Typography>
                <View style={styles.phoneNumberContainer}>
                  <View style={styles.countryCodeBox}>
                    <Typography
                      size={16}
                      type={Font.GeneralSans_Medium}
                      color="#2F2E2E">
                      +91
                    </Typography>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="enter mobile number"
                    placeholderTextColor="#8C8C8C"
                   value={number}     // route se aa raha number show hoga
  editable={false}  
                    
                    keyboardType="phone-pad"
                  />
                </View>
                {errors.phoneNumber && (
                  <Typography
                    size={12}
                    type={Font.GeneralSans_Regular}
                    color={Colors.red}
                    style={styles.errorText}>
                    {errors.phoneNumber}
                  </Typography>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Input
                  title="Email Address"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={value => handleInputChange('email', value)}
                  keyboardType="email-address"
                  showTitle={true}
                  placeholderTextColor="#8C8C8C"
                  error={errors.email}
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  title="Location"
                  placeholder="Select Location"
                  value={formData.location}
                  onChange={value => handleInputChange('location', value)}
                  showTitle={true}
                  placeholderTextColor="#8C8C8C"
                  error={errors.location}
                  onPress={() => {
                    // Handle location picker
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  title="Experience (Years)"
                  placeholder="select year"
                  value={formData.experience}
                  onChange={value => handleInputChange('experience', value)}
                  keyboardType="numeric"
                  showTitle={true}
                  placeholderTextColor="#8C8C8C"
                  error={errors.experience}
                  onPress={() => {
                    // Handle experience picker
                  }}
                />
              </View>

              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={styles.toggleContainer}
                  onPress={() => setAgreeToTerms(!agreeToTerms)}
                  activeOpacity={0.7}>
                  <View
                    style={[
                      styles.toggle,
                      agreeToTerms && styles.toggleActive,
                    ]}>
                    {agreeToTerms ? <View style={styles.toggleCircle} /> : <View style={{
                      width: 22.73,
                      height: 22.73,
                      borderRadius: 11.365,
                      backgroundColor: '#ffffff',
                      alignSelf: 'flex-start',
                    }} />}
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
              {errors.agreeToTerms && (
                <Typography
                  size={12}
                  type={Font.GeneralSans_Regular}
                  color={Colors.red}
                  style={styles.errorText}>
                  {errors.agreeToTerms}
                </Typography>
              )}

              <Button
                title={loading ? "SAVING..." : "CONTINUE"}
                disabled={loading}
                onPress={handleContinue}
                style={styles.button}
                linerColor={[Colors.zyaraGreen, Colors.zyaraGreen]}
                title_style={styles.buttonText}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default ProfileSetup;

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
  inputTitle: {
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    gap: 0,
  },
  countryCodeBox: {
    width: 60,
    height: 60,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 0,
  },
  phoneInput: {
    flex: 1,
    height: 60,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderLeftWidth: 0,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: Font.GeneralSans_Regular,
    color: Colors.black,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
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
    backgroundColor: Colors.white,
    alignSelf: 'flex-end',
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
    marginTop: -15,
    marginBottom: 10,
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
});

