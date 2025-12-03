import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import Onboarding from '../Screens/Onboarding';
import CustomerStack from './CustomerStack';
import BeauticianStack from './BeauticianStack';
const Stack = createStackNavigator();

const AppNavigator = () => {
  const isAuth = useSelector(state => state.isAuth);
  const userType = useSelector(state => state.userType);

  return (
    <NavigationContainer>
      {isAuth ? (
        userType === 'beautician' ? <BeauticianStack /> : <CustomerStack />
      ) : (
        <Stack.Navigator
          initialRouteName="Onboarding"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="CustomerStack" component={CustomerStack} />
          <Stack.Screen name="BeauticianStack" component={BeauticianStack} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;

