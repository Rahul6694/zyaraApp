import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignIn from '../Screens/CustomerScreen/SignIn';
import OTPVerify from '../Screens/CustomerScreen/OTPVerify';


const Stack = createStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen 
        name="SignIn" 
        component={SignIn}
        initialParams={{userType: 'customer'}}
      />
      <Stack.Screen 
        name="OTPVerify" 
        component={OTPVerify}
        initialParams={{userType: 'customer'}}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;

