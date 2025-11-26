import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../Constants/Colors';
import {Font} from '../Constants/Font';
import Typography from '../Component/UI/Typography';
import {ImageConstant} from '../Constants/ImageConstant';

const {width, height} = Dimensions.get('window');

const Onboarding = ({navigation}) => {
  const [selectedUserType, setSelectedUserType] = useState('customer');

  const handleUserTypeSelect = type => {
    setSelectedUserType(type);
    // Navigate immediately when user type is selected
    if (type === 'customer') {
      navigation.navigate('CustomerStack', {
        screen: 'SignIn',
        params: {userType: 'customer'},
      });
    } else {
      navigation.navigate('BeauticianStack', {
        screen: 'Login',
        params: {userType: 'beautician'},
      });
    }
  };

  const handleLogin = () => {
    if (selectedUserType === 'customer') {
      navigation.navigate('CustomerStack', {
        screen: 'SignIn',
        params: {userType: 'customer'},
      });
    } else {
      navigation.navigate('BeauticianStack', {
        screen: 'Login',
        params: {userType: 'beautician'},
      });
    }
  };

  const handleContinue = () => {
    if (selectedUserType === 'customer') {
      navigation.navigate('CustomerStack');
    } else {
      navigation.navigate('BeauticianStack');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.contentContainer}>
        <View style={styles.illustrationWrapper}>
          <Image
            source={ImageConstant.girl}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
        <View style={styles.greenLine} />
        <Image
          source={ImageConstant.welcome}
          style={styles.welcomeImage}
          resizeMode="contain"
        />

        <Image
          source={ImageConstant.zyaraApp}
          style={styles.appNameImage}
          resizeMode="contain"
        />

  
        <Typography
          size={16}
          type={Font.GeneralSans_Medium}
          color={Colors.black}
          style={styles.userTypeTitle}>
          Choose your user type
        </Typography>

        <View style={styles.buttonRow}>

          <TouchableOpacity
            style={[
              styles.userTypeButton,
              selectedUserType !== 'customer' && styles.userTypeButtonInactive,
            ]}
            onPress={() => handleUserTypeSelect('customer')}>
            <View style={styles.iconContainer}>
              <Image
                source={ImageConstant.image1}
                style={[
                  styles.customerIcon,
                  selectedUserType === 'customer' && styles.customerIconSelected,
                ]}
                resizeMode="contain"
              />
            </View>
            <Typography
              size={16}
              type={Font.GeneralSans_Regular}
              color={
                selectedUserType === 'customer'
                  ? Colors.white
                  : Colors.black
              }
              style={styles.customerButtonText}>
              I'm a {'\n'}Customer
            </Typography>
          </TouchableOpacity>

        
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              styles.userTypeButtonOutline,
              selectedUserType === 'beautician' && styles.userTypeButtonSelected,
            ]}
            onPress={() => handleUserTypeSelect('beautician')}>
            <View style={styles.iconContainerOutline}>
              <Image
                source={ImageConstant.image2}
                style={[
                  styles.beauticianIcon,
                  selectedUserType === 'beautician' && styles.beauticianIconSelected,
                ]}
                resizeMode="contain"
              />
            </View>
            <Typography
              size={16}
              type={Font.GeneralSans_Regular}
              color={
                selectedUserType === 'beautician'
                  ? Colors.white
                  : Colors.black
              }
              style={styles.beauticianButtonText}>
              I'm a{'\n'} Beautician
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        {/* <View style={styles.loginContainer} >
          <View style={styles.loginTextContainer}>
            <Typography
              size={16}
              type={Font.GeneralSans_Regular}
              color="#090909"
              style={styles.loginText}>
              Already have an account?{' '}
            </Typography>
            <TouchableOpacity onPress={handleLogin}>

          
            <Typography
              size={16}
              type={Font.GeneralSans_Semibold}
              color={Colors.zyaraGreen}>
              Login
            </Typography>
            </TouchableOpacity>
          </View>
        </View> */}
      </View>

   
      <LinearGradient
        colors={[Colors.white, Colors.lightGreen]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.bottomGradient}
      />

     
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    position: 'relative',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  bottomGradient: {
    position: 'absolute',
    width: width,
    height: height * 0.4,
    bottom: 0,
    left: 0,
    zIndex: 0,
  },
  illustrationWrapper: {
    width: width * 0.58,
    height: width *0.8,
    alignSelf: 'center',
    marginTop: 40,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
 
 
  illustration: {
  height:339,
   position:'absolute',
   top:74
  },
  greenLine: {
    width: width * 0.74,
    height: 1,
    backgroundColor: Colors.zyaraGreen,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  welcomeImage: {
    width: width * 0.26,
    height: 52,
    alignSelf: 'center',
    marginTop: 20,
  },
  appNameImage: {
    width: width * 0.64,
    height: 80,
    alignSelf: 'center',
    marginTop: 10,
  },
  userTypeTitle: {
    textTransform: 'capitalize',
    marginTop: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 0,
    gap: 12,
  },
  userTypeButton: {
    width: (width - 60) / 2,
    height: 120,
    backgroundColor: Colors.zyaraGreen,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.zyaraGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 15,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 22.5,
    elevation: 8,
  },
  userTypeButtonActive: {
    backgroundColor: Colors.zyaraGreen,
  },
  userTypeButtonInactive: {
    backgroundColor: Colors.white,
    borderColor: Colors.greyBorder,
    shadowOpacity: 0,
    elevation: 0,
  },
  userTypeButtonOutline: {
    backgroundColor: Colors.white,
    borderColor: Colors.greyBorder,
    shadowOpacity: 0,
    elevation: 0,
  },
  userTypeButtonSelected: {
    backgroundColor: Colors.zyaraGreen,
    borderColor: Colors.zyaraGreen,
    shadowColor: '#000',
    shadowOffset: {
      width: 15,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 22.5,
    elevation: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconContainerOutline: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  customerIcon: {
    width: 43,
    height: 44,
    tintColor: Colors.zyaraGreen,
  },
  customerIconSelected: {
    tintColor: Colors.white,
  },
  beauticianIcon: {
    width: 43,
    height: 44,
    tintColor: Colors.zyaraGreen,
  },
  beauticianIconSelected: {
    tintColor: Colors.white,
  },
  customerButtonText: {
    textAlign: 'center',
  },
  beauticianButtonText: {
    textAlign: 'center',
  },
  loginContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: width * 0.55,
  },
  loginTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {},
  bottomNavBar: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 36,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIndicator: {
    width: width * 0.35,
    height: 6,
    backgroundColor: 'rgba(143, 143, 143, 0.15)',
    borderRadius: 100,
  },
});
