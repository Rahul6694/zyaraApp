import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Onboarding from '../Screens/Onboarding';
import CustomerStack from './CustomerStack';
import BeauticianStack from './BeauticianStack';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="CustomerStack" component={CustomerStack} />
        <Stack.Screen name="BeauticianStack" component={BeauticianStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

