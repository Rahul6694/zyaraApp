import React, { useCallback, useState } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SimpleToast from 'react-native-simple-toast';
import {
  getBeauticianDashboard,
  setBeauticianOnlineStatus,
  requestBeauticianPayout,
} from '../../Backend/BookingAPI';
import { getImageUrl, formatPrice } from '../../Utils/imageUrl';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '../../Component/UI/Typography';
import { ImageConstant } from '../../Constants/ImageConstant';
import CustomSwitch from '../../Component/CustomSwitch'
import { Font } from '../../Constants/Font';
// Reusable StatCard Component
const StatCard = ({ icon, value, styleheight, label, gradientColors, fullWidth, WithdrawButton, colorss, show, onPress, onWithdraw }) => (
  <TouchableOpacity activeOpacity={onPress ? 0.85 : 1} disabled={!onPress} onPress={onPress} style={fullWidth ? null : { flex: 0.48 }}>
  <LinearGradient
    colors={gradientColors}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[
      styles.gradientBorder,
      fullWidth ? styles.gradientBorderFull : { borderRadius: 20, padding: 1 }
    ]}
  >
    <View style={[styles.innerBox, styleheight]}>

      <View
        style={{
          height: 60,
          width: 90,
          backgroundColor: colorss,
          borderBottomRightRadius: 110,
          borderBottomLeftRadius: 100,
          position: 'absolute',
          right: 20,
          top: 0,
        }}
      />

      <View style={styles.cardContent}>
        <View style={styles.iconText}>
          {icon && <Image source={icon} style={styles.icon} />}
          <View style={{ marginLeft: icon ? 10 : 0 }}>
            <Typography type={Font.GeneralSans_Bold} size={28} color='#000D12'>{value}</Typography>
            <Typography type={Font.GeneralSans_Bold} size={18} color='#00070A'>{label}</Typography>
          </View>
          {WithdrawButton && <Image source={ImageConstant.No} style={{ alignSelf: 'flex-end', height: 40, resizeMode: 'contain' }} />}
        </View>

        {show && <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', height: '100%' }}>
          <View style={styles.arrowContainer}>
            <Image
              source={ImageConstant.nextarrow}
              style={styles.arrowIcon}
            />
          </View>
        </View>}
      </View>

      {WithdrawButton && (
        <TouchableOpacity style={styles.withdrawBtn} onPress={onWithdraw}>
          <Typography size={16} color="#00B272">WITHDRAW EARNINGS</Typography>
        </TouchableOpacity>
      )}
    </View>
  </LinearGradient>
  </TouchableOpacity>
);

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning!';
  if (hour < 17) return 'Good Afternoon!';
  return 'Good Evening!';
};


const BeauticianHome = () => {
  const navigation = useNavigation();
  const [enabled, setEnabled] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback((onDone) => {
    getBeauticianDashboard(
      res => {
        setDashboard(res?.data || null);
        setEnabled(!!res?.data?.profile?.is_online);
        onDone && onDone();
      },
      err => {
        console.log('Dashboard error:', err);
        onDone && onDone();
      },
    );
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const profile = dashboard?.profile || {};
  const stats = dashboard?.stats || {};
  const earnings = dashboard?.earnings || {};
  const photo = getImageUrl(profile.profile_picture);

  const toggleOnline = val => {
    setEnabled(val);
    setBeauticianOnlineStatus(
      val,
      res => SimpleToast.show(res?.message || (val ? 'You are online' : 'You are offline'), SimpleToast.SHORT),
      err => {
        setEnabled(!val);
        SimpleToast.show(err?.data?.message || 'Could not update status', SimpleToast.SHORT);
      },
    );
  };

  const handleWithdraw = () => {
    const balance = Number(earnings.available_balance || 0);
    if (balance <= 0) {
      SimpleToast.show('No balance available to withdraw yet', SimpleToast.SHORT);
      return;
    }
    Alert.alert('Withdraw earnings', `Request a withdrawal of ${formatPrice(balance)} to your bank account?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Withdraw',
        onPress: () =>
          requestBeauticianPayout(
            null,
            res => {
              SimpleToast.show(res?.message || 'Withdrawal requested', SimpleToast.SHORT);
              load();
            },
            err => SimpleToast.show(err?.data?.message || 'Could not request withdrawal', SimpleToast.LONG),
          ),
      },
    ]);
  };

  const openBookings = () => navigation.navigate('My Booking');

  return (
    <LinearGradient
      colors={['#EFFFF4', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1, paddingHorizontal: 20 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              colors={['#00B272']}
              onRefresh={() => {
                setRefreshing(true);
                load(() => setRefreshing(false));
              }}
            />
          }>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={photo ? { uri: photo } : ImageConstant.user2} style={{ height: 40, width: 40, resizeMode: 'cover', borderRadius: 10, marginRight: 10 }} />
              <View style={{ maxWidth: 170 }}>
                <Typography size={16} color='#000000' type={Font.GeneralSans_Medium} numberOfLines={1}>
                  {profile.name || ' '}
                </Typography>
                {!!(profile.city || profile.state) && (
                  <Typography numberOfLines={1}>
                    <Image source={ImageConstant.Location} style={{ height: 10, width: 10, resizeMode: 'contain' }} /> {[profile.city, profile.state].filter(Boolean).join(', ')}
                  </Typography>
                )}
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '30%', alignItems: 'center' }}>
              <Typography size={14} type={Font.GeneralSans_Regular} color='#000911'>
                {enabled ? 'Online' : 'Offline'}
              </Typography>
              <CustomSwitch
                value={enabled}
                onValueChange={toggleOnline}
              />
              <View>
                <Image source={ImageConstant.notification} style={{ height: 30, width: 22, resizeMode: 'contain' }} />
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 15 }}>
            <View>
              <Typography size={30}>
                Dashboard
              </Typography>
              <Typography>
                {greeting()}
              </Typography>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddService')}
              style={{ height: 45, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#00B272', borderRadius: 12, paddingHorizontal: 15 }}>
              <Typography color='#00B272'>+ Add Service</Typography>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('BeauticianGallery')}
              style={{ height: 45, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#00B272', borderRadius: 12, paddingHorizontal: 15, marginLeft: 8 }}>
              <Typography color='#00B272'>Gallery</Typography>
            </TouchableOpacity>
            </View>
          </View>
          {profile.verification_status && profile.verification_status !== 'approved' && (
            <View style={styles.notice}>
              <Typography size={14} type={Font.GeneralSans_Medium} color={profile.verification_status === 'rejected' ? '#E5484D' : '#B7730C'}>
                {profile.verification_status === 'rejected'
                  ? 'Your profile verification was rejected. Please contact support.'
                  : 'Your profile is under review. Customers will see you once it is approved.'}
              </Typography>
            </View>
          )}
          <StatCard
            icon={ImageConstant.usercalander}
            value={String(stats.today_bookings ?? 0)}
            show
            onPress={openBookings}
            label="Today’s Appointments"
            gradientColors={['#F6F9E3', '#00B272']}
            fullWidth
            colorss={'#e6ffe480'}
            styleheight={{ height: 121 }}
          />
          <View style={styles.row}>
            <StatCard
              show
              onPress={openBookings}
              value={String(stats.pending_requests ?? 0)}
              label={
                <>
                  Pending{"\n"}
                  Requests
                </>
              }
              gradientColors={['#F6F9E3', '#3CD5FF']}
              colorss={'#eefafaff'}
            />
            <StatCard
              value={formatPrice(stats.today_earnings || 0)}
              label={<>Revenue{"\n"}Today</>}
              gradientColors={['#F6F9E3', '#C4DE00']}
              colorss='#e8ffe7ff'
              show
            />
          </View>     
          <StatCard
            icon={ImageConstant.calander3}
            value={String(stats.upcoming_bookings ?? 0)}
            onPress={openBookings}
            label="Upcoming Bookings"
            gradientColors={['#F6F9E3', '#00B272']}
            fullWidth
            show
            colorss={'#e7ffe680'}
            styleheight={{ height: 121 }}
          />
          <StatCard
            icon={ImageConstant.homePay}
            value={formatPrice(earnings.total_earnings || 0)}
            label={`Total Earnings · ${formatPrice(earnings.available_balance || 0)} available`}
            gradientColors={['#F6F9E3', '#FFBA6A']}
            fullWidth
            WithdrawButton
            onWithdraw={handleWithdraw}
            styleheight={{ height: 186 }}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default BeauticianHome;

const styles = StyleSheet.create({
  notice: {
    backgroundColor: '#FEF5E6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gradientBorder: {
    borderRadius: 20,
    padding: 1,
  },
  gradientBorderFull: {
    flex: 1,
    padding: 1,
    borderRadius: 20,
    marginBottom: 10,
  },
  innerBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    width: '100%',
    padding: 24,
    justifyContent: 'center',
    height: 121
  },
  withdrawBtn: {
    height: 53,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00B272',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 55,
    height: 55,
    resizeMode: 'contain'
  },
  arrowContainer: {
    height: 30,
    width: 30,
    borderColor: '#00B272',
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
    tintColor: '#00B272',
  },
});
