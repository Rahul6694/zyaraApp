import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import SignIn from '../Screens/CustomerScreen/SignIn';
import SignUp from '../Screens/CustomerScreen/SignUp';
import OTPVerify from '../Screens/CustomerScreen/OTPVerify';
import CMSScreen from '../Screens/CMSScreen';
import  CustomBottomTabs from './CustomBottomTabs';
import SettingProfile from '../Screens/CustomerScreen/SettingProfile';
import HelpSupport from '../Screens/CustomerScreen/HelpSupport';
import ManageAdresss from '../Screens/CustomerScreen/ManageAdresss';

const Stack = createStackNavigator();

const CustomerStack = () => {
  const navigation = useNavigation();
  const isAuth = useSelector(state => state.isAuth);
  const token = useSelector(state => state.Token);
  const userType = useSelector(state => state.userType);

  useEffect(() => {
    // If user is authenticated and is customer, navigate to Home
    if (isAuth &&  userType === 'customer') {
      navigation.reset({
        index: 0,
        routes: [{name: 'Home', params: {userType: 'customer'}}],
      });
    }
  }, [isAuth, token, userType, navigation]);

  // Determine initial route based on auth state
  const initialRouteName = isAuth && token && userType === 'customer' ? 'Home' : 'SignIn';

  return (



    <Stack.Navigator
      initialRouteName={initialRouteName}
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
        name="CMSScreen" 
        component={CMSScreen}
      />
      <Stack.Screen 
        name="Home" 
        component={CustomBottomTabs}
        initialParams={{userType: 'customer'}}
      />
        <Stack.Screen 
        name="SettingProfile" 
        component={SettingProfile}
    
      />

       <Stack.Screen 
        name="HelpSupport" 
        component={HelpSupport}
    
      />

       <Stack.Screen 
        name="ManageAdresss" 
        component={ManageAdresss}
    
      />
      
    </Stack.Navigator>
  
  );
};

export default CustomerStack;

