import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ImageConstant } from '../Constants/ImageConstant';
import HomeScreen from '../Screens/CustomerScreen/Home';
import MyProfileScreen from '../Screens/CustomerScreen/MyProfileScreen'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function DummyScreen() {
  return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
}

const Tab = createBottomTabNavigator();


function CustomTabBar({ state, navigation }) {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => navigation.navigate(route.name);

        let iconSource = ImageConstant.buket;

        if (route.name === 'Home') iconSource = ImageConstant.home2;
        if (route.name === 'Categories') iconSource = ImageConstant.Categories;
        if (route.name === 'My Booking') iconSource = ImageConstant.Calander;
        if (route.name === 'Account') iconSource = ImageConstant.account;

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
         
            {isFocused ? <View style={styles.activeLine} /> : <View style={styles.inactiveLine} />}

         
            <Image
              source={iconSource}
              style={[
                styles.icon,
                isFocused ? {tintColor:'#0DA678'}: null
               
              ]}
              resizeMode="contain"
            />

            <Text
              style={{
                fontSize: 12,
                marginTop: 5,
                color: isFocused ? "#0DA678" : "#6D6D6D",
                fontWeight: isFocused ? "600" : "400",
              }}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


export default function BottomTabs() {
  const insets = useSafeAreaInsets();
  return (
   <View style={{flex:1, paddingBottom:insets.bottom}}>


      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Categories" component={DummyScreen} />
        <Tab.Screen name="My Booking" component={DummyScreen} />
        <Tab.Screen name="Account" component={MyProfileScreen} />
      </Tab.Navigator>
      </View>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  tabContainer: {
    height: 90,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",

    
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: -2 },
    // shadowOpacity: 0.08,
    // shadowRadius: 8,
    // elevation: 5,
  },

  tabButton: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    width: 26,
    height: 26,
    marginTop: 6,
  },

  activeLine: {
    width: '100%',
    height: 2,
    backgroundColor: "#0DA678",
    borderRadius: 10,

    position:'absolute',
    top:0
  },

  inactiveLine: {
    width: '100%',
    height: 2,
    position:'absolute',
    top:0,
    backgroundColor: "transparent",
 
  },
});
