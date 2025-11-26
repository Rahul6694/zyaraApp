import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignIn from '../Screens/CustomerScreen/SignIn';
import SignUp from '../Screens/CustomerScreen/SignUp';
import OTPVerify from '../Screens/CustomerScreen/OTPVerify';
import Home from '../Screens/CustomerScreen/Home';

const Stack = createStackNavigator();

const CustomerStack = () => {
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
        name="SignUp" 
        component={SignUp}
        initialParams={{userType: 'customer'}}
      />
      <Stack.Screen 
        name="OTPVerify" 
        component={OTPVerify}
        initialParams={{userType: 'customer'}}
      />
      <Stack.Screen 
        name="Home" 
        component={Home}
        initialParams={{userType: 'customer'}}
      />
    </Stack.Navigator>
  );
};

export default CustomerStack;

