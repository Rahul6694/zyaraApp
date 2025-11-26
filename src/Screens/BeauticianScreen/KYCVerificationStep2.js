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
import DocumentUpload from '../../Component/DocumentUpload';
import {beauticianSignupStep3} from '../../Backend/BeauticianAPI';
import SimpleToast from 'react-native-simple-toast';
import DropdownNew from '../../Component/DropdownNew';
import ScreenHeader from '../../Component/ScreenHeader';

const {width} = Dimensions.get('window');

const KYCVerificationStep2 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const token = route?.params?.token;
  const beauticianId = route?.params?.beauticianId;
  const [idProof, setIdProof] = useState(null);
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [licenseType, setLicenseType] = useState(null);
  const [licenseDoc, setLicenseDoc] = useState(null);

  // ID Proof options
  const idProofOptions = [
    {label: 'Aadhaar ID', value: 'Aadhaar ID'},
    {label: 'PAN Card', value: 'PAN Card'},
    {label: 'Driving License', value: 'Driving License'},
    {label: 'Voter ID', value: 'Voter ID'},
    {label: 'Passport', value: 'Passport'},
  ];

  // License Type options
  const licenseTypeOptions = [
    {label: 'Beauty License', value: 'Beauty License'},
    {label: 'Cosmetology Certificate', value: 'Cosmetology Certificate'},
    {label: 'Hair Styling Certificate', value: 'Hair Styling Certificate'},
    {label: 'Makeup Artist Certificate', value: 'Makeup Artist Certificate'},
    {label: 'Spa Therapy Certificate', value: 'Spa Therapy Certificate'},
    {label: 'Other', value: 'Other'},
  ];
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    idFront: '',
    idBack: '',
    licenseDoc: '',
  });

  const handleContinue = () => {
    const newErrors = {
      idFront: '',
      idBack: '',
      licenseDoc: '',
    };
    let hasError = false;

    // Validate required fields
    if (!idFront) {
      newErrors.idFront = 'Please upload ID proof front';
      hasError = true;
    }
    if (!idBack) {
      newErrors.idBack = 'Please upload ID proof back';
      hasError = true;
    }
    if (!licenseDoc) {
      newErrors.licenseDoc = 'Please upload beauty certificate';
      hasError = true;
    }
    
    if (hasError) {
      setErrors(newErrors);
      return;
    }

    if (!token) {
      SimpleToast.show('Authentication token missing', SimpleToast.SHORT);
      return;
    }

    setErrors({
      idFront: '',
      idBack: '',
      licenseDoc: '',
    });

    setLoading(true);

    // Create FormData for step3
    const formData = new FormData();
    formData.append('id_proof_front', {
      uri: idFront.path || idFront.uri,
      type: idFront.mime || 'image/jpeg',
      name: idFront.filename || 'id_proof_front.jpg',
    });
    formData.append('id_proof_back', {
      uri: idBack.path || idBack.uri,
      type: idBack.mime || 'image/jpeg',
      name: idBack.filename || 'id_proof_back.jpg',
    });
    formData.append('beauty_certificates', {
      uri: licenseDoc.path || licenseDoc.uri,
      type: licenseDoc.mime || 'image/jpeg',
      name: licenseDoc.filename || 'beauty_certificate.jpg',
    });

    beauticianSignupStep3(
      formData,
      token,
      (response) => {
        setLoading(false);
        console.log('Step 3 completed successfully:', response);
        SimpleToast.show('Documents uploaded successfully', SimpleToast.SHORT);
        
        // Navigate to Step 4 (BankVerification)
        navigation.navigate('BankVerification', {
          token: token,
          beauticianId: beauticianId || response?.beautician_id || response?.data?.beautician_id,
        });
      },
      (error) => {
        setLoading(false);
        console.log('Step 3 error:', error);
        const errorMessage = error?.data?.message || error?.message || 'Failed to upload documents. Please try again.';
        SimpleToast.show(errorMessage, SimpleToast.SHORT);
      },
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <LinearGradient
        colors={[Colors.lightGreen, Colors.white]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.backgroundGradient}
      />

      {/* Fixed Header */}
      <ScreenHeader title="KYC / Verification" showGreenLine={true} />

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
              Verify Your Account
            </Typography>

            <Typography
              size={18}
              type={Font.GeneralSans_Regular}
              color="#505050"
              style={styles.subtitle}>
              Upload your ID & certifications to gain trust
            </Typography>

            <View style={styles.inputContainer}>
              <Typography
                size={16}
                type={Font.GeneralSans_Medium}
                color="#0A0A0A"
                style={styles.inputTitle}>
                Select ID Proof
              </Typography>
              <DropdownNew
                data={idProofOptions}
                value={idProof}
                onChange={(item) => setIdProof(item.value)}
                placeholder="Select ID Proof"
                containerStyle={styles.dropdownContainer}
                style_dropdown={styles.dropdown}
                selectedTextStyleNew={styles.dropdownText}
                marginHorizontal={0}
                width="100%"
              />
            </View>

            <View style={styles.idUploadRow}>
              <View style={styles.idUploadItem}>
                <Typography
                  size={16}
                  type={Font.GeneralSans_Regular}
                  color={Colors.black}
                  style={styles.uploadTitle}>
                  Upload {idProof || 'ID Proof'} Front
                </Typography>
                <View style={styles.uploadContainer}>
                  <DocumentUpload
                    images={idFront || ImageConstant.upload}
                    text="drag and drop to upload"
                    text2="Front"
                    onChage={image => {
                      setIdFront(image);
                      if (errors.idFront) {
                        setErrors(prev => ({...prev, idFront: ''}));
                      }
                    }}
                    style={styles.idUploadBox}
                  />
                </View>
                {errors.idFront ? (
                  <Typography
                    size={12}
                    type={Font.GeneralSans_Regular}
                    color={Colors.red}
                    style={styles.errorText}>
                    {errors.idFront}
                  </Typography>
                ) : null}
              </View>

              <View style={styles.idUploadItem}>
                <Typography
                  size={16}
                  type={Font.GeneralSans_Regular}
                  color={Colors.black}
                  style={styles.uploadTitle}>
                  Upload {idProof || 'ID Proof'} Back
                </Typography>
                <View style={styles.uploadContainer}>
                  <DocumentUpload
                    images={idBack || ImageConstant.upload}
                    text="drag and drop to upload"
                    text2="Back"
                    onChage={image => {
                      setIdBack(image);
                      if (errors.idBack) {
                        setErrors(prev => ({...prev, idBack: ''}));
                      }
                    }}
                    style={styles.idUploadBox}
                  />
                </View>
                {errors.idBack ? (
                  <Typography
                    size={12}
                    type={Font.GeneralSans_Regular}
                    color={Colors.red}
                    style={styles.errorText}>
                    {errors.idBack}
                  </Typography>
                ) : null}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Typography
                size={16}
                type={Font.GeneralSans_Medium}
                color="#0A0A0A"
                style={styles.inputTitle}>
                Beauty License / Certificates
              </Typography>
              <DropdownNew
                data={licenseTypeOptions}
                value={licenseType}
                onChange={(item) => setLicenseType(item.value)}
                placeholder="Select License Type"
                containerStyle={styles.dropdownContainer}
                style_dropdown={styles.dropdown}
                selectedTextStyleNew={styles.dropdownText}
                marginHorizontal={0}
                width="100%"
              />
            </View>

            <View style={styles.uploadSection}>
              <Typography
                size={16}
                type={Font.GeneralSans_Regular}
                color={Colors.black}
                style={styles.uploadTitle}>
                Upload {licenseType || 'Certificate'}
              </Typography>
              <View style={styles.uploadContainer}>
                <DocumentUpload
                  images={licenseDoc || ImageConstant.upload}
                  text="drag and drop to upload"
                  onChage={image => {
                    setLicenseDoc(image);
                    if (errors.licenseDoc) {
                      setErrors(prev => ({...prev, licenseDoc: ''}));
                    }
                  }}
                  style={styles.uploadBox}
                />
              </View>
              {errors.licenseDoc ? (
                <Typography
                  size={12}
                  type={Font.GeneralSans_Regular}
                  color={Colors.red}
                  style={styles.errorText}>
                  {errors.licenseDoc}
                </Typography>
              ) : null}
            </View>

            <Button
              title={loading ? "UPLOADING..." : "CONTINUE"}
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
  );
};

export default KYCVerificationStep2;

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
  idProofInput: {
    textTransform: 'capitalize',
    fontSize: 18,
  },
  licenseInput: {
    textTransform: 'lowercase',
  },
  idUploadRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25,
    justifyContent: 'space-between',
  },
  idUploadItem: {
    width: (width - 44 - 12) / 2, // Half width minus gap
  },
  uploadSection: {
    marginBottom: 25,
  },
  uploadTitle: {
    marginBottom: 10,
  },
  uploadContainer: {
    width: '100%',
  },
  idUploadBox: {
    width: '100%',
    height: 113,
  },
  uploadBox: {
    width: '100%',
    height: 130.11,
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
  errorText: {
    marginTop: 5,
    marginLeft: 5,
  },
  dropdownContainer: {
    marginHorizontal: 0,
    marginVertical: 0,
    width: '100%',
  },
  dropdown: {
    height: 60,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingHorizontal: 15,
    backgroundColor: Colors.white,
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.black,
  },
});

