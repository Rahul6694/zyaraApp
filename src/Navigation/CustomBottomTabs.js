import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ImageConstant } from '../Constants/ImageConstant';
import HomeScreen from '../Screens/CustomerScreen/Home';
import MyProfileScreen from '../Screens/CustomerScreen/MyProfileScreen'
import Categories from '../Screens/CustomerScreen/Categories'
import MyBookings from '../Screens/CustomerScreen/MyBookings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TabBar from '../Component/TabBar';

function DummyScreen() {
  return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
}

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: ImageConstant.home2,
  Categories: ImageConstant.Categories,
  'My Booking': ImageConstant.Calander,
  Account: ImageConstant.account,
};

export default function BottomTabs() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom, backgroundColor: 'white' }}>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => (
          <TabBar {...props} icons={TAB_ICONS} fallbackIcon={ImageConstant.buket} />
        )}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Categories" component={Categories} />
        <Tab.Screen name="My Booking" component={MyBookings} />
        <Tab.Screen name="Account" component={MyProfileScreen} />
      </Tab.Navigator>
    </View>
  );
}
