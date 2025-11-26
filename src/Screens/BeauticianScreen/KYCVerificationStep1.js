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
import ImageModal from '../../Component/Modals/ImageModal';
import ScreenHeader from '../../Component/ScreenHeader';
import {beauticianSignupStep1} from '../../Backend/BeauticianAPI';
import SimpleToast from 'react-native-simple-toast';

const {width} = Dimensions.get('window');

const KYCVerificationStep1 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const token = route?.params?.token;
  const beauticianId = route?.params?.beauticianId;
  const [profileImage, setProfileImage] = useState(null);
  const [coverBanner, setCoverBanner] = useState(null);
  const [bio, setBio] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentUploadType, setCurrentUploadType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    profileImage: '',
    coverBanner: '',
    bio: '',
  });

  const handleContinue = () => {
    const newErrors = {
      profileImage: '',
      coverBanner: '',
      bio: '',
    };
    let hasError = false;

    // Validate required fields
    if (!profileImage) {
      newErrors.profileImage = 'Please upload profile picture';
      hasError = true;
    }
    if (!coverBanner) {
      newErrors.coverBanner = 'Please upload cover banner';
      hasError = true;
    }
    if (!bio.trim()) {
      newErrors.bio = 'Please enter bio';
      hasError = true;
    } else if (bio.trim().length < 10) {
      newErrors.bio = 'Bio must be at least 10 characters';
      hasError = true;
    } else if (bio.trim().length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
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
      profileImage: '',
      coverBanner: '',
      bio: '',
    });

    setLoading(true);

    // Create FormData for step1
    const formData = new FormData();
    formData.append('profile_picture', {
      uri: profileImage.path || profileImage.uri,
      type: profileImage.mime || 'image/jpeg',
      name: profileImage.filename || 'profile_picture.jpg',
    });
    formData.append('banner', {
      uri: coverBanner.path || coverBanner.uri,
      type: coverBanner.mime || 'image/jpeg',
      name: coverBanner.filename || 'banner.jpg',
    });
    formData.append('bio', bio.trim());

    beauticianSignupStep1(
      formData,
      token,
      (response) => {
        setLoading(false);
        console.log('Step 1 completed successfully:', response);
        SimpleToast.show('Profile picture and banner uploaded successfully', SimpleToast.SHORT);
        
        // Navigate to Step 2 (ProfileSetup)
        navigation.navigate('ProfileSetup', {
          token: token,
          beauticianId: beauticianId || response?.beautician_id || response?.data?.beautician_id,
        });
      },
      (error) => {
        setLoading(false);
        console.log('Step 1 error:', error);
        const errorMessage = error?.data?.message || error?.message || 'Failed to upload. Please try again.';
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
      <ScreenHeader title="Profile Setup" />

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
              Upload Profile Picture
            </Typography>

            <Typography
              size={18}
              type={Font.GeneralSans_Regular}
              color="#505050"
              style={styles.subtitle}>
              Upload Profile Picture, Cover Banner & Bio
            </Typography>

            <View style={styles.uploadSection}>
              <Typography
                size={16}
                type={Font.GeneralSans_Medium}
                color="#0A0A0A"
                style={styles.uploadTitle}>
                Salon Logo
              </Typography>
              <View style={styles.circularUploadContainer}>
                <TouchableOpacity
                  style={styles.circularUpload}
                  onPress={() => {
                    setShowImageModal(true);
                    setCurrentUploadType('profileImage');
                    if (errors.profileImage) {
                      setErrors(prev => ({...prev, profileImage: ''}));
                    }
                  }}>
                  {profileImage && (profileImage.uri || profileImage.path) ? (
                    <Image
                      source={{uri: profileImage.uri || profileImage.path}}
                      style={styles.circularImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.circularPlaceholder}>
                      <Image source={ImageConstant.cammra} style={{height:40, width:40, tintColor:'green'}}/>
                     
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              {errors.profileImage ? (
                <Typography
                  size={12}
                  type={Font.GeneralSans_Regular}
                  color={Colors.red}
                  style={styles.errorText}>
                  {errors.profileImage}
                </Typography>
              ) : null}
            </View>

            <View style={styles.uploadSection}>
              <Typography
                size={16}
                type={Font.GeneralSans_Medium}
                color="#0A0A0A"
                style={styles.uploadTitle}>
                Upload Cover Banner
              </Typography>
              <View style={styles.uploadContainer}>
                <DocumentUpload
                  images={coverBanner || ImageConstant.upload}
                  text="drag and drop to upload"
                  onChage={image => {
                    console.log('Cover banner selected:', image);
                    setCoverBanner(image);
                    if (errors.coverBanner) {
                      setErrors(prev => ({...prev, coverBanner: ''}));
                    }
                  }}
                  style={styles.uploadBox}
                />
              </View>
              {errors.coverBanner ? (
                <Typography
                  size={12}
                  type={Font.GeneralSans_Regular}
                  color={Colors.red}
                  style={styles.errorText}>
                  {errors.coverBanner}
                </Typography>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Input
                title="Bio"
                placeholder="enter bio"
                value={bio}
                onChange={(text) => {
                  setBio(text);
                  if (errors.bio) {
                    setErrors(prev => ({...prev, bio: ''}));
                  }
                }}
                multiline
                numberOfLines={4}
                showTitle={true}
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                error={errors.bio}
              />
            </View>

            <Button
              title={loading ? "UPLOADING..." : "CONTINUE"}
              onPress={handleContinue}
              style={styles.button}
              linerColor={[Colors.zyaraGreen, Colors.zyaraGreen]}
              title_style={styles.buttonText}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ImageModal
        showModal={showImageModal}
        selected={v => {
          console.log('ImageModal selected:', v);
          if (v && v.length > 0) {
            const imageObj = v[0];
            console.log('Image object:', imageObj);
            if (currentUploadType === 'profileImage') {
              setProfileImage(imageObj);
              console.log('Profile image set:', imageObj);
            } else if (currentUploadType === 'coverBanner') {
              setCoverBanner(imageObj);
              console.log('Cover banner set:', imageObj);
            }
          }
          setShowImageModal(false);
          setCurrentUploadType(null);
        }}
        close={() => {
          setShowImageModal(false);
          setCurrentUploadType(null);
        }}
      />
    </View>
  );
};

export default KYCVerificationStep1;

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
  uploadSection: {
    marginBottom: 25,
  },
  uploadTitle: {
    marginBottom: 10,
  },
  circularUploadContainer: {
    alignItems: 'flex-start',
    marginTop: 10,
  },
  circularUpload: {
    width: 150.28,
    height: 150.28,
    borderRadius: 75.14,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  circularImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75.14,
  },
  circularPlaceholder: {
    width: 138.4,
    height: 138.4,
    borderRadius: 69.2,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.white,
  },
  cameraIconContainer: {
    width: 37.5,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cameraIconOuter: {
    width: 24,
    height: 20,
    backgroundColor: Colors.zyaraGreen,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconInner: {
    width: 12,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.38)',
    borderRadius: 1,
  },
  uploadText: {
    textAlign: 'center',
    textTransform: 'lowercase',
    fontSize: 12,
  },
  uploadContainer: {
    width: '100%',
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
});

