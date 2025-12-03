import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './src/Redux/store';
import AppNavigator from './src/Navigation/AppNavigator';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from './src/Constants/Colors';
import { StatusBar } from 'react-native';

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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
  
          <StatusBar barStyle="dark-content" translucent backgroundColor={'translucent'}/>
          <AppNavigator />

            
      </PersistGate>
    </Provider>
  );
};

export default App;