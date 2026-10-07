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
import { customerLogout } from "../../Backend/CustomerAPI";
import SimpleToast from "react-native-simple-toast";
import { BASE_URL } from "../../Backend/env";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Shadow } from "../../Constants/Colors";

const MyProfileScreen = ({ navigation }) => {
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
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    // Call logout API first
    customerLogout(
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

  return (
    <View style={[styles.container, {paddingTop:insets.top}]}>
       <LinearGradient
          colors={[Colors.background, Colors.lightGreen]}
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
                  style={styles.avatar}
                  onError={() => setImageError(true)}
                />
              ) : (
                <Image
                  source={ImageConstant.user2}
                  style={styles.avatar}
                />
              )}
              {/* <TouchableOpacity style={{position:'absolute', bottom:-5, right:-5}}>
              <Image source={ ImageConstant.editcammra} style={{height:27, width:27, resizeMode:'contain', }}/>
              </TouchableOpacity> */}
            </View>
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Typography
                size={21}
                color="white"
                numberOfLines={1}
                type={Font.GeneralSans_Semibold}
              >
                {userName}
              </Typography>

              {userEmail ? (
              <Typography
                size={14}
                color="rgba(255,255,255,0.88)"
                numberOfLines={1}
                style={{ marginTop: 3 }}
                type={Font.GeneralSans_Regular}
              >
                  {userEmail}
              </Typography>
              ) : null}

              {userPhone ? (
              <Typography
                size={14}
                color="rgba(255,255,255,0.88)"
                style={{ marginTop: 2 }}
                type={Font.GeneralSans_Regular}
              >
                  {userPhone}
              </Typography>
              ) : null}
            </View>

            {/* <TouchableOpacity style={styles.editBtn}>
             <Image source={ImageConstant.edit} style={{height:18, width:18, resizeMode:'contain'}}/>
            </TouchableOpacity> */}
          </View>
        </View>


        <View style={styles.topRow}>
          <TopBox icon={ImageConstant.heart} label="Favorites" />
          <TopBox icon={ImageConstant.booking} label="My Booking" />
          <TopBox  icon={ImageConstant.pay} label="Help Center" />
        </View>

        {/* MENU LIST */}
        <View style={styles.menuContainer}>
          <MenuItem title="My Profile" icon={ImageConstant.user} subtitle="View or change profile details"  onpress={()=>navigation.navigate('SettingProfile')}/>
          <MenuItem title="Manage Address" icon={ImageConstant.location2} subtitle="Share, Edit & Add Address"  onpress={()=>navigation.navigate('ManageAdresss')}/>
          <MenuItem title="Help & Support" icon={ImageConstant.help} subtitle="FAQs and links"  onpress={() => navigation.navigate('HelpSupport')} />
          <MenuItem title="Settings" icon={ImageConstant.setting} subtitle="Manage your account setting" onpress={() => navigation.navigate('SettingsScreen')} />
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={handleLogout}>
          <Image source={ImageConstant.logout} style={styles.logoutIcon}/>
          <Typography
            size={16}
            color={Colors.danger}
            style={{ marginLeft: 10 }}
            type={Font.GeneralSans_Semibold}
          >
            Log Out
          </Typography>
        </TouchableOpacity>
      </ScrollView>
      </LinearGradient>
    </View>
  );
};


const TopBox = ({ label , icon}) => (
  <TouchableOpacity style={styles.topBox} activeOpacity={0.8}>
    <View style={styles.topBoxIcon}>
      <Image source={icon} style={{height:20, width:22, resizeMode:'contain'}}/>
    </View>
    <Typography
      size={13}
      color={Colors.textPrimary}
      type={Font.GeneralSans_Medium}
    >
      {label}
    </Typography>
  </TouchableOpacity>
);

/* MENU ITEM COMPONENT */
const MenuItem = ({ title, subtitle, icon,onpress }) => (
  <TouchableOpacity style={styles.menuItem} activeOpacity={0.8} onPress={onpress}>
    <View style={styles.menuIconWrap}>
      <Image source={icon} style={{height:22, width:22, resizeMode:'contain'}}/>
    </View>
    <View style={{ flex: 1 }}>
      <Typography
        size={16}
        color={Colors.textPrimary}
        type={Font.GeneralSans_Medium}
      >
        {title}
      </Typography>
      <Typography
        size={12.5}
        color={Colors.textSecondary}
        style={{ marginTop: 3 }}
        type={Font.GeneralSans_Regular}
      >
        {subtitle}
      </Typography>
    </View>
    <Image source={ImageConstant.nextarrow} style={styles.chevron}/>
  </TouchableOpacity>
);

export default MyProfileScreen;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.brand },

  header: {
    paddingBottom: 56,
    paddingHorizontal: 20,
    backgroundColor: Colors.brand,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
  },

  emojiBox: {
    width: 84,
    height: 84,
    padding: 3,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.35)',
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.white,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: -36,
  },

  topBox: {
    backgroundColor: Colors.white,
    width: '31%',
    paddingVertical: 14,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    ...Shadow.md,
  },

  topBoxIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  menuContainer: { marginTop: 24, paddingHorizontal: 20 },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginBottom: 12,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    ...Shadow.sm,
  },

  menuIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.brandTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  chevron: {
    height: 12,
    width: 7,
    resizeMode: 'contain',
    tintColor: Colors.textMuted,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 32,
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.dangerSoft,
  },

  logoutIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: Colors.danger,
  },
});
