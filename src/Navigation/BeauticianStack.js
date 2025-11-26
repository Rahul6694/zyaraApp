import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../Screens/BeauticianScreen/Login';
import SignUp from '../Screens/BeauticianScreen/SignUp';
import OTPVerify from '../Screens/BeauticianScreen/OTPVerify';
import ProfileSetup from '../Screens/BeauticianScreen/ProfileSetup';
import KYCVerificationStep1 from '../Screens/BeauticianScreen/KYCVerificationStep1';
import KYCVerificationStep2 from '../Screens/BeauticianScreen/KYCVerificationStep2';
import BankVerification from '../Screens/BeauticianScreen/BankVerification';
import Home from '../Screens/CustomerScreen/Home';

const Stack = createStackNavigator();

const BeauticianStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
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
        name="Home" 
        component={Home}
        initialParams={{userType: 'beautician'}}
      />
    </Stack.Navigator>
  );
};

export default BeauticianStack;

