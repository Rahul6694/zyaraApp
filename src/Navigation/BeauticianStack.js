import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Login from '../Screens/BeauticianScreen/Login';
import SignUp from '../Screens/BeauticianScreen/SignUp';
import OTPVerify from '../Screens/BeauticianScreen/OTPVerify';
import ProfileSetup from '../Screens/BeauticianScreen/ProfileSetup';
import KYCVerificationStep1 from '../Screens/BeauticianScreen/KYCVerificationStep1';
import KYCVerificationStep2 from '../Screens/BeauticianScreen/KYCVerificationStep2';
import BankVerification from '../Screens/BeauticianScreen/BankVerification';
import BeauticianSettingProfile from '../Screens/BeauticianScreen/BeauticianSettingProfile';
import BeauticianManageAdresss from '../Screens/BeauticianScreen/BeauticianManageAdresss';
import CMSScreen from '../Screens/CMSScreen';
import createBottomTabNavigator from '../Navigation/BeauticianBottomTabs';

const Stack = createStackNavigator();
const BeauticianStack = () => {
  const navigation = useNavigation();
  const isAuth = useSelector(state => state.isAuth);
  const token = useSelector(state => state.Token);
  const userType = useSelector(state => state.userType);

  useEffect(() => {
    // If user is authenticated and is beautician, navigate to Home
    if (isAuth && token && userType === 'beautician') {
      navigation.reset({
        index: 0,
        routes: [{name: 'Home', params: {userType: 'beautician'}}],
      });
    }
  }, [isAuth, token, userType, navigation]);

  // Determine initial route based on auth state
  const initialRouteName = isAuth && token && userType === 'beautician' ? 'Home' : 'Login';

  return (
  
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen 
        name="Login" 
        component={Login}
        initialParams={{userType: 'beautician'}}
      />
      <Stack.Screen 
        name="SignIn" 
        component={SignUp}
        initialParams={{userType: 'beautician'}}
      />
      <Stack.Screen 
        name="OTPVerify" 
        component={OTPVerify}
        initialParams={{userType: 'beautician'}}
      />
     
      <Stack.Screen 
        name="ProfileSetup" 
        component={ProfileSetup}
        initialParams={{userType: 'beautician'}}
      />
      <Stack.Screen 
        name="KYCVerificationStep1" 
        component={KYCVerificationStep1}
        initialParams={{userType: 'beautician'}}
      />
      <Stack.Screen 
        name="KYCVerificationStep2" 
        component={KYCVerificationStep2}
        initialParams={{userType: 'beautician'}}
      />
      <Stack.Screen 
        name="BankVerification" 
        component={BankVerification}
        initialParams={{userType: 'beautician'}}
      />
      <Stack.Screen 
        name="CMSScreen" 
        component={CMSScreen}
      />
      <Stack.Screen 
        name="Home" 
        component={createBottomTabNavigator}
        initialParams={{userType: 'beautician'}}
      />
      <Stack.Screen 
        name="BeauticianSettingProfile" 
        component={BeauticianSettingProfile}
      
      />
      <Stack.Screen 
        name="BeauticianManageAdresss" 
        component={BeauticianManageAdresss}
      
      />
      
    </Stack.Navigator>
  );
};

export default BeauticianStack;

