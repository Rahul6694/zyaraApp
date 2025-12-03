import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { Colors } from '../../Constants/Colors';
import { Font } from '../../Constants/Font';
import Typography from '../../Component/UI/Typography';
import { ImageConstant } from '../../Constants/ImageConstant';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const { width } = Dimensions.get('window');

const BeauticianHome = ({ navigation }) => {
  const [isOnline, setIsOnline] = useState(true);
  const userDetails = useSelector(state => state.userDetails) || {};
  const insets = useSafeAreaInsets();
  // Extract user data
  const userName = userDetails?.name || userDetails?.full_name || 'Shreya Sharma';
  const userLocation = userDetails?.city && userDetails?.state 
    ? `${userDetails.city}, ${userDetails.state}` 
    : 'Surat, Gujrat';
  const profilePicture = userDetails?.profile_picture || userDetails?.profile_pic || userDetails?.avatar || null;
  
  // Statistics data (can be fetched from API later)
  const stats = {
    todayAppointments: 20,
    pendingRequests: 20,
    revenueToday: 749,
    upcomingAppointments: 20,
    totalEarnings: 5000,
  };


  return (
    <View style={[styles.container,{paddingTop:insets.top}]}>
 
      
      {/* Background Gradient */}
      <LinearGradient
        colors={[Colors.white, '#EFFFF4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      />

      {/* Fixed Header */}
      <View style={styles.header}>
        <Typography 
          size={18}
          type={Font.GeneralSans_Medium}
          color="#00B272"
          style={styles.headerTitle}
        >
          SAVE ACCOUNT
        </Typography>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
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

        {/* Dashboard Header */}
        <View style={styles.dashboardHeader}>
          <View>
            <Typography 
              size={30}
              type={Font.GeneralSans_Semibold}
              color="#031628"
              style={styles.dashboardTitle}
            >
              Dashboard
            </Typography>
            <Typography 
              size={16}
              type={Font.GeneralSans_Regular}
              color="#2F3337"
              style={styles.greetingText}
            >
              Good Morning!
            </Typography>
          </View>
          <TouchableOpacity 
            style={styles.addServiceButton}
            onPress={() => navigation?.navigate('AddService')}
          >
            <View style={styles.addServiceIcon}>
              <View style={styles.addIconLine1} />
              <View style={styles.addIconLine2} />
            </View>
            <Typography 
              size={16}
              type={Font.GeneralSans_Medium}
              color="#00B272"
              style={styles.addServiceText}
            >
              Add Service
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          {/* Today's Appointments */}
          <TouchableOpacity 
            style={[styles.statCard, styles.fullWidthCard]} 
            activeOpacity={0.8}
          >
            <View style={styles.statCardContent}>
              <View style={styles.statCardLeft}>
                <View style={styles.statIconContainer}>
                  <Image 
                    source={ImageConstant.homePay} 
                    style={styles.iconImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.statTextContainer}>
                  <Typography 
                    size={28}
                    type={Font.GeneralSans_Bold}
                    color="#000D12"
                    style={styles.statValue}
                  >
                    {stats.todayAppointments}
                  </Typography>
                  <Typography 
                    size={18}
                    type={Font.GeneralSans_Bold}
                    color="#00070A"
                    style={styles.statTitle}
                  >
                    Today's Appointments
                  </Typography>
                </View>
              </View>
              <View style={styles.statCardRight}>
                <View style={styles.statCardRightBg} />
                <View style={styles.statCardRightEllipse} />
                <TouchableOpacity style={styles.detailButton}>
                  <View style={styles.detailButtonInner}>
                    <View style={styles.detailArrow} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          {/* Pending Requests & Revenue Today */}
          <View style={styles.twoColumnRow}>
            <TouchableOpacity 
              style={[styles.statCard, styles.halfWidthCard]} 
              activeOpacity={0.8}
            >
              <View style={styles.statCardContent}>
                <View style={styles.statCardLeft}>
                  <View style={styles.statIconContainer}>
                    <Image 
                      source={ImageConstant.homePay} 
                      style={styles.iconImage}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.statTextContainer}>
                    <Typography 
                      size={28}
                      type={Font.GeneralSans_Bold}
                      color="#000D12"
                      style={styles.statValue}
                    >
                      {stats.pendingRequests}
                    </Typography>
                    <Typography 
                      size={18}
                      type={Font.GeneralSans_Bold}
                      color="#00070A"
                      style={styles.statTitle}
                    >
                      Pending Requests
                    </Typography>
                  </View>
                </View>
                <View style={styles.statCardRight}>
                  <View style={styles.statCardRightBg} />
                  <View style={[styles.statCardRightEllipse, { backgroundColor: '#CFFEFF' }]} />
                  <TouchableOpacity style={styles.detailButton}>
                    <View style={styles.detailButtonInner}>
                      <View style={styles.detailArrow} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.statCard, styles.halfWidthCard]} 
              activeOpacity={0.8}
            >
              <View style={styles.statCardContent}>
                <View style={styles.statCardLeft}>
                  <View style={styles.statIconContainer}>
                    <Image 
                      source={ImageConstant.homePay} 
                      style={styles.iconImage}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.statTextContainer}>
                    <Typography 
                      size={28}
                      type={Font.GeneralSans_Bold}
                      color="#000D12"
                      style={styles.statValue}
                    >
                      ₹749
                    </Typography>
                    <Typography 
                      size={18}
                      type={Font.GeneralSans_Bold}
                      color="#00070A"
                      style={styles.statTitle}
                    >
                      Revenue Today
                    </Typography>
                  </View>
                </View>
                <View style={styles.statCardRight}>
                  <View style={styles.statCardRightBg} />
                  <View style={[styles.statCardRightEllipse, { backgroundColor: '#CDFFCA' }]} />
                  <TouchableOpacity style={styles.detailButton}>
                    <View style={styles.detailButtonInner}>
                      <View style={styles.detailArrow} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.statCard, styles.fullWidthCard]} 
            activeOpacity={0.8}
          >
            <View style={styles.statCardContent}>
              <View style={styles.statCardLeft}>
                <View style={styles.statIconContainer}>
                  <Image 
                    source={ImageConstant.homePay} 
                    style={styles.iconImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.statTextContainer}>
                  <Typography 
                    size={28}
                    type={Font.GeneralSans_Bold}
                    color="#000D12"
                    style={styles.statValue}
                  >
                    {stats.upcomingAppointments}
                  </Typography>
                  <Typography 
                    size={18}
                    type={Font.GeneralSans_Bold}
                    color="#00070A"
                    style={styles.statTitle}
                  >
                    Upcomming Appointments
                  </Typography>
                </View>
              </View>
              <View style={styles.statCardRight}>
                <View style={styles.statCardRightBg} />
                <View style={styles.statCardRightEllipse} />
                <TouchableOpacity style={styles.detailButton}>
                  <View style={styles.detailButtonInner}>
                    <View style={styles.detailArrow} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          {/* Total Earnings */}
          <View style={styles.earningsCard}>
            <View style={styles.earningsCardContent}>
              <View style={styles.earningsLeft}>
                <View style={styles.iconContainer}>
                  <Image 
                    source={ImageConstant.homePay} 
                    style={styles.iconImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.earningsTextContainer}>
                  <Typography 
                    size={25}
                    type={Font.GeneralSans_Bold}
                    color="#000D12"
                    style={styles.earningsValue}
                  >
                    ₹{stats.totalEarnings}
                  </Typography>
                  <Typography 
                    size={18}
                    type={Font.GeneralSans_Bold}
                    color="#00070A"
                    style={styles.earningsTitle}
                  >
                    Total Earnings
                  </Typography>
                </View>
              </View>
              <View style={styles.earningsRight}>
                <Image 
                  source={ImageConstant.No} 
                  style={styles.growthImage}
                  resizeMode="contain"
                />
              </View>
            </View>
            <TouchableOpacity 
              style={styles.withdrawButton} 
              onPress={() => {
                console.log('Withdraw earnings');
              }}
            >
              <Typography 
                size={16}
                type={Font.GeneralSans_Medium}
                color="#00B272"
                style={styles.withdrawButtonText}
              >
                WITHDRAW EARNINGS
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default BeauticianHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backgroundGradient: {
    position: 'absolute',
    width: width,
    height: '100%',
    top: 0,
    left: 0,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: Colors.white,
    zIndex: 10,
  },
  headerTitle: {
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Space for bottom navigation
  },
  // Profile Section Styles
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
  // Dashboard Header Styles
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  dashboardTitle: {
    lineHeight: 33,
    textTransform: 'capitalize',
    marginBottom: 5,
  },
  greetingText: {
    lineHeight: 33,
    textTransform: 'capitalize',
  },
  addServiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#00B272',
    borderRadius: 10,
    gap: 8,
  },
  addServiceIcon: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIconLine1: {
    position: 'absolute',
    width: 14,
    height: 1.5,
    backgroundColor: '#00B272',
  },
  addIconLine2: {
    position: 'absolute',
    width: 1.5,
    height: 14,
    backgroundColor: '#00B272',
  },
  addServiceText: {
    lineHeight: 21,
    textTransform: 'capitalize',
  },
  // Stats Container Styles
  statsContainer: {
    paddingLeft: 21.5,
    paddingRight: 21.5,
    gap: 15,
  },
  // Stat Card Styles
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(233, 233, 233, 0.3)',
    shadowColor: '#E9E9E9',
    shadowOffset: { width: 15, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 45,
    elevation: 5,
  },
  statCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  statCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 47,
    height: 48,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 47,
    height: 48,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    lineHeight: 37,
    marginBottom: 5,
    fontFamily: 'SF Pro Display',
    fontWeight: '700',
  },
  statTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'SF Pro Display',
    fontWeight: '700',
  },
  statCardRight: {
    width: 94.61,
    height: 67.66,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  statCardRightBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderTopRightRadius: 20,
  },
  statCardRightEllipse: {
    position: 'absolute',
    width: 94.39,
    height: 94.39,
    borderRadius: 47.195,
    backgroundColor: 'rgba(0, 178, 114, 0.06)',
    top: -39.5,
    right: -27.5,
  },
  detailButton: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#00B272',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-90deg' }],
  },
  detailButtonInner: {
    width: 16,
    height: 6.31,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailArrow: {
    width: 16,
    height: 6.31,
    backgroundColor: '#00B272',
  },
  fullWidthCard: {
    width: 385,
    height: 122,
    alignSelf: 'center',
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 15.5,
    width: 385.5,
    alignSelf: 'center',
  },
  halfWidthCard: {
    width: 187,
    height: 122,
  },
  // Earnings Card Styles
  earningsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#E9E9E9',
    shadowOffset: { width: 15, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 45,
    elevation: 5,
    width: 385,
    minHeight: 186,
    alignSelf: 'center',
  },
  earningsCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  earningsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 47,
    height: 48,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningsTextContainer: {
    marginLeft: 15,
  },
  earningsValue: {
    fontSize: 25,
    lineHeight: 33,
    marginBottom: 5,
    fontFamily: 'SF Pro Display',
    fontWeight: '700',
  },
  earningsTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'SF Pro Display',
    fontWeight: '700',
  },
  earningsRight: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  growthImage: {
    height: 42,
    width: 89,
  },
  withdrawButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: '#00B272',
    borderRadius: 9,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#E9E9E9',
    shadowOffset: { width: 15, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 45,
    elevation: 5,
    width: 342.4,
    alignSelf: 'center',
  },
  withdrawButtonText: {
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
