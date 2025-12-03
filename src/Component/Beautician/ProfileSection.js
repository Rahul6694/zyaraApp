import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useSelector } from 'react-redux';
import Typography from '../UI/Typography';
import { Font } from '../../Constants/Font';
import { ImageConstant } from '../../Constants/ImageConstant';

const ProfileSection = ({ isOnline, setIsOnline }) => {
  const userDetails = useSelector(state => state.userDetails) || {};
  
  // Extract user data
  const userName = userDetails?.name || userDetails?.full_name || 'Shreya Sharma';
  const userLocation = userDetails?.city && userDetails?.state 
    ? `${userDetails.city}, ${userDetails.state}` 
    : 'Surat, Gujrat';
  const profilePicture = userDetails?.profile_picture || userDetails?.profile_pic || userDetails?.avatar || null;

  return (
    <View style={styles.profileSection}>
      <View style={styles.profileLeft}>
        <View style={styles.profileImageContainer}>
          {profilePicture ? (
            <Image 
              source={{ uri: profilePicture }} 
              style={styles.profileImage}
            />
          ) : (
            <Image 
              source={ImageConstant.user2} 
              style={styles.profileImage}
            />
          )}
        </View>
        <View style={styles.profileInfo}>
          <Typography 
            size={16}
            type={Font.GeneralSans_Medium}
            color="#000000"
          >
            {userName}
          </Typography>
          <Typography 
            size={14}
            type={Font.GeneralSans_Regular}
            color="#666666"
            style={styles.locationText}
          >
            {userLocation}
          </Typography>
        </View>
      </View>
      <View style={styles.profileRight}>
        <View style={styles.onlineContainer}>
          <Typography 
            size={14}
            type={Font.GeneralSans_Regular}
            color="#000000"
            style={styles.onlineText}
          >
            Online
          </Typography>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: '#767577', true: '#00B272' }}
            thumbColor={isOnline ? '#FFFFFF' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <View style={styles.notificationIcon}>
            <View style={styles.notificationDot} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileSection;

const styles = StyleSheet.create({
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    marginRight: 12,
    marginLeft: 22.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileInfo: {
    flex: 1,
  },
  locationText: {
    marginTop: 2,
  },
  profileRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  onlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  onlineText: {
    lineHeight: 21,
  },
  notificationButton: {
    width: 22,
    height: 29,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: '#262626',
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    width: 8.75,
    height: 8.75,
    borderRadius: 4.375,
    backgroundColor: '#00B272',
  },
});

