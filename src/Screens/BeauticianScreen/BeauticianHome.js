import React from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '../../Component/UI/Typography';
import { ImageConstant } from '../../Constants/ImageConstant';

// Reusable StatCard Component
const StatCard = ({ icon, value, label, gradientColors, fullWidth }) => (
  <LinearGradient
    colors={gradientColors}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[
      styles.gradientBorder,
      fullWidth ? styles.gradientBorderFull : null
    ]}
  >
    <View style={styles.innerBox}>
      <View style={styles.cardContent}>
        <View style={styles.iconText}>
          {icon && <Image source={icon} style={styles.icon} />}
          <View style={{ marginLeft: icon ? 10 : 0 }}>
            <Typography>{value}</Typography>
            <Typography>{label}</Typography>
          </View>
        </View>
        <View style={styles.arrowContainer}>
          <Image
            source={ImageConstant.nextarrow}
            style={styles.arrowIcon}
          />
        </View>
      </View>
    </View>
  </LinearGradient>
);

const BeauticianHome = () => {
  return (
    <LinearGradient
      colors={['#EFFFF4', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1, padding: 20 }}
    >
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Full-width Cards */}
          <StatCard
            icon={ImageConstant.Calander}
            value="20"
            label="Today’s Appointments"
            gradientColors={['#F6F9E3', '#00B272']}
            fullWidth
          />

          <View style={styles.row}>
            {/* Two-column Row Cards */}
            <StatCard
              value="20"
              label="Pending\nRequests"
              gradientColors={['#F6F9E3', '#3CD5FF']}
            />
            <StatCard
              value="₹749"
              label="Revenue\nToday"
              gradientColors={['#F6F9E3', '#FFBA6A']}
            />
          </View>

          {/* More Full-width Cards */}
          <StatCard
            icon={ImageConstant.Calander}
            value="20"
            label="Today’s Appointments"
            gradientColors={['#F6F9E3', '#00B272']}
            fullWidth
          />

          <StatCard
            icon={ImageConstant.homePay}
            value="₹5000"
            label="Total Earnings"
            gradientColors={['#F6F9E3', '#C4DE00']}
            fullWidth
          />

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default BeauticianHome;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gradientBorder: {
    flex: 0.48,
    borderRadius: 20,
    padding: 1, 
    marginBottom: 20,
  },
  gradientBorderFull: {
    flex: 1,
    padding: 1,
    borderRadius: 20,
    marginBottom: 20,
  },
  innerBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    width: '100%',
    padding: 20,
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
    width: 60,
    height: 60,
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
    width: 11,
    resizeMode: 'contain',
    tintColor: '#00B272',
  },
});
