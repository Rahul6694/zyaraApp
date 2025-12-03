import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ScreenHeader from '../../Component/ScreenHeader'
import { useDispatch, useSelector } from "react-redux";
import {  logOut } from "../../Redux/action";
import Typography from "../../Component/UI/Typography";
import { Font } from "../../Constants/Font";
import { ImageConstant } from "../../Constants/ImageConstant";
import { Text } from "react-native-gesture-handler";
import { beauticianLogout } from "../../Backend/BeauticianAPI";
import SimpleToast from "react-native-simple-toast";
import { BASE_URL } from "../../Backend/env";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MyProfileScreenBeauty = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector(state => state.userDetails) || {};
  const [imageError, setImageError] = useState(false);
  
  // Extract user data with fallback values
  const userName = userDetails?.name || userDetails?.full_name || 'User';
  const userEmail = userDetails?.email || '';
  const userPhone = userDetails?.phone || userDetails?.number || userDetails?.mobile || '';
  
  // Get profile picture and format URL
  let profilePicture = userDetails?.profile_picture || userDetails?.profile_pic || userDetails?.avatar || null;
  
  // Format profile picture URL
  if (profilePicture && !imageError) {
    // If URL is relative, prepend BASE_URL
    if (profilePicture && !profilePicture.startsWith('http://') && !profilePicture.startsWith('https://')) {
      // Remove /api/ from BASE_URL to get base domain
      const baseDomain = BASE_URL.replace('/api/', '').replace(/\/$/, '');
      // Ensure profile picture path starts with /
      const imagePath = profilePicture.startsWith('/') ? profilePicture : `/${profilePicture}`;
      profilePicture = `${baseDomain}${imagePath}`;
    }
  }

  const handleLogout = () => {
    // Call logout API first
    beauticianLogout(
      (response) => {
        // API call successful, clear Redux state
        dispatch(logOut());
        SimpleToast.show('Logged out successfully', SimpleToast.SHORT);
      },
      (error) => {
        // Even if API fails, clear local state
        console.log('Logout API error:', error);
    dispatch(logOut());
        SimpleToast.show('Logged out', SimpleToast.SHORT);
      }
    );
  }; 
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, {paddingTop:insets.top}]}>
       <LinearGradient
          colors={["#FFFFFF", "#EFFFF4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex:1 }}
        >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ScreenHeader title='My Profile' titlecolor={'white'} imgstyle={{tintColor:'white'}} style={{paddingHorizontal:0}} showGreenLine={false}/>
          <View style={styles.profileRow}>
            <View style={styles.emojiBox}>
              {profilePicture && !imageError ? (
                <Image 
                  source={{uri: profilePicture}} 
                  style={{height:'100%', width:'100%', resizeMode:'cover', borderRadius: 10}}
                  onError={() => {
                    console.log('Profile image failed to load:', profilePicture);
                    setImageError(true);
                  }}
                  onLoad={() => {
                    console.log('Profile image loaded successfully:', profilePicture);
                  }}
                />
              ) : (
                <Image 
                  source={ImageConstant.user2} 
                  style={{height:'100%', width:'100%', resizeMode:'cover', borderRadius: 10}}
                />
              )}
              <TouchableOpacity style={{position:'absolute', bottom:-5, right:-5}}>
              <Image source={ ImageConstant.editcammra} style={{height:27, width:27, resizeMode:'contain', }}/>
              </TouchableOpacity>
            </View>
            <View style={{ marginLeft: 12 }}>
              <Typography 
                size={22}
                color="white"
                type={Font.GeneralSans_Semibold}
              >
                {userName}
              </Typography>

              {userEmail ? (
                <Typography 
                  size={16}
                  color="white"
                  type={Font.GeneralSans_Regular}
                >
                  {userEmail}
                </Typography>
              ) : null}

              {userPhone ? (
                <Typography 
                  size={16}
                  color="white"
                  type={Font.GeneralSans_Regular}
                >
                  {userPhone}
                </Typography>
              ) : null}
            </View>

            <TouchableOpacity style={styles.editBtn}>
             <Image source={ImageConstant.edit} style={{height:18, width:18, resizeMode:'contain'}}/>
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.topRow}>
          <TopBox icon={ImageConstant.heart} label="Favorites" />
          <TopBox icon={ImageConstant.booking} label="My Booking" />
          <TopBox  icon={ImageConstant.pay} label="Help Center" />
        </View>

        {/* MENU LIST */}
        <View style={styles.menuContainer}>
          <MenuItem title="My Profile" icon={ImageConstant.user} subtitle="View or change profile details" />
          <MenuItem title="Manage Address" icon={ImageConstant.location2} subtitle="Share, Edit & Add Address" />
          <MenuItem title="Help & Support" icon={ImageConstant.help} subtitle="FAQs and links" />
          <MenuItem title="Settings" icon={ImageConstant.setting} subtitle="Manage your account setting" />
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <View  style={styles.logoutGradient}>
            <View style={{backgroundColor:'white', height:40, width:40, borderRadius:10, justifyContent:'center', alignItems:'center'}}>

         
            <Image source={ImageConstant.logout} style={{height:20, width:22, resizeMode:'contain'}}/>
            </View>
            <Typography 
              size={16}
              color="white"
              marginLeft={10}
              type={Font.GeneralSans_Medium}
            >
              LOG OUT
            </Typography>
          </View>
        </TouchableOpacity>
      </ScrollView>
      </LinearGradient>
    </View>
  );
};

/* TOP BOX COMPONENT */
const TopBox = ({ label , icon}) => (
  <TouchableOpacity style={styles.topBox}>
    <Image source={icon} style={{height:20, width:23, resizeMode:'contain', marginBottom:6}}/>
    <Typography 
      size={16}
      color="#111719"
      type={Font.GeneralSans_Medium}
    >
      {label}
    </Typography>
  </TouchableOpacity>
);

/* MENU ITEM COMPONENT */
const MenuItem = ({ title, subtitle, icon }) => (
  <TouchableOpacity style={styles.menuItem}>
    <View style={{ flexDirection: "row", justifyContent:'space-between', alignItems:'center' }}>

     <View style={{flexDirection:'row', alignItems:'center'}}>
     <Image source={icon} style={{height:28, width:28, resizeMode:'contain', marginRight:20}}/>
     <View>

    
     <Typography 
        size={16}
        color="#000000"
        type={Font.GeneralSans_Medium}
      >
        {title}
      </Typography>

      <Typography 
        size={12}
        marginTop={3}
        color="#515154"
        type={Font.GeneralSans_Regular}
      >
        {subtitle}
      </Typography>
      </View>
     </View>
      <Image source={ImageConstant.nextarrow} style={{height:12, width:6, resizeMode:'contain'}}/>
    </View>
  </TouchableOpacity>
);

export default MyProfileScreenBeauty;


const styles = StyleSheet.create({
  container: { flex: 1,  backgroundColor:"#00B172" },

  header: {
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor:"#00B172"
  },

  profileRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingTop: 20 
  },

  emojiBox: {
    width: 90,
    height: 90,
    padding:5,
    backgroundColor: "#ffffff55",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:'white'
  },

  editBtn: { 
    marginLeft: "auto", 
    padding: 8 
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF4E6",
    padding: 15,
  },

  topBox: {
    backgroundColor: "#fff",
    width: '30%',
    height: 80,
    borderRadius: 12,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  menuContainer: { marginTop: 12 },

  menuItem: {
    
    borderWidth: 1,
    borderColor: "#E3E3E3",
    width: '90%',
    alignSelf: 'center',
    marginBottom: 15,
    borderRadius: 20,
    height:81,
    justifyContent:'center',
    paddingHorizontal:20
  },

  logoutBtn: { 
    marginHorizontal: 20, 
    marginTop: 25, 
    width: '40%', 
    alignSelf: 'center' 
  },

  logoutGradient: {
    padding: 14,
    borderRadius: 12,
  width:169,
    alignItems: "center",
    backgroundColor:"#00B172",
    flexDirection:'row'
    
  },
});
