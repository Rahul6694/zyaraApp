import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './src/Navigation/AppNavigator';

const App = () => {
  useEffect(() => {
    // Hide splash screen when app is ready
    // Using setTimeout to ensure navigation is fully initialized
    const timer = setTimeout(() => {
      SplashScreen.hide();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

export default App;