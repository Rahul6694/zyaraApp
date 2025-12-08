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
import SubCategories from '../Screens/CustomerScreen/SubCategories';
import ChooseBeauticians from '../Screens/CustomerScreen/ChooseBeauticians';
import ServiceDetails from '../Screens/CustomerScreen/ServiceDetails';
import SelectLocation from '../Screens/CustomerScreen/SelectLocation';
import AddNewAddress from '../Screens/CustomerScreen/AddNewAddress';
import AddToCart from '../Screens/CustomerScreen/AddToCart';
import SlotBooking from '../Screens/CustomerScreen/SlotBooking';
import BookingRequest from '../Screens/CustomerScreen/BookingRequest';
import Congratulations from '../Screens/CustomerScreen/Congratulations';
import SettingsScreen from '../Screens/CustomerScreen/SettingsScreen';

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

       <Stack.Screen 
        name="SubCategories" 
        component={SubCategories}
    
      />

       <Stack.Screen 
        name="ChooseBeauticians" 
        component={ChooseBeauticians}
    
      />

       <Stack.Screen 
        name="ServiceDetails" 
        component={ServiceDetails}
    
      />

       <Stack.Screen 
        name="SelectLocation" 
        component={SelectLocation}
    
      />

       <Stack.Screen 
        name="AddNewAddress" 
        component={AddNewAddress}
    
      />

       <Stack.Screen 
        name="AddToCart" 
        component={AddToCart}
    
      />

       <Stack.Screen 
        name="SlotBooking" 
        component={SlotBooking}
    
      />

       <Stack.Screen 
        name="BookingRequest" 
        component={BookingRequest}
    
      />

       <Stack.Screen 
        name="Congratulations" 
        component={Congratulations}
    
      />

       <Stack.Screen 
        name="SettingsScreen" 
        component={SettingsScreen}
      />
      
    </Stack.Navigator>
  
  );
};

export default CustomerStack;

