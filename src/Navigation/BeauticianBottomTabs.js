import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ImageConstant } from '../Constants/ImageConstant';
import BeauticianHome from '../Screens/BeauticianScreen/BeauticianHome';
import MyProfileScreenBeauty from '../Screens/BeauticianScreen/MyProfileScreenBeauty'
import BeauticianBookings from '../Screens/BeauticianScreen/BeauticianBookings';
import BeauticianEarnings from '../Screens/BeauticianScreen/BeauticianEarnings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TabBar from '../Component/TabBar';

function DummyScreen() {
  return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
}
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: ImageConstant.home2,
  'My Booking': ImageConstant.Calander,
  Earning: ImageConstant.pay,
  Chat: ImageConstant.chat,
  Account: ImageConstant.account,
};

export default function BeauticianBottomTabs() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom, backgroundColor: 'white' }}>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => (
          <TabBar {...props} icons={TAB_ICONS} fallbackIcon={ImageConstant.buket} />
        )}
      >
        <Tab.Screen name="Home" component={BeauticianHome} />
        <Tab.Screen name="My Booking" component={BeauticianBookings} />
        <Tab.Screen name="Earning" component={BeauticianEarnings} />
        <Tab.Screen name="Chat" component={DummyScreen} />
        <Tab.Screen name="Account" component={MyProfileScreenBeauty} />
      </Tab.Navigator>
    </View>
  );
}
