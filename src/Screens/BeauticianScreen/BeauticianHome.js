import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '../../Component/UI/Typography';
import { ImageConstant } from '../../Constants/ImageConstant';
import CustomSwitch from '../../Component/CustomSwitch'
import { Font } from '../../Constants/Font';
// Reusable StatCard Component
const StatCard = ({ icon, value, styleheight, label, gradientColors, fullWidth, WithdrawButton, colorss, show }) => (
  <LinearGradient
    colors={gradientColors}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[
      styles.gradientBorder,
      fullWidth ? styles.gradientBorderFull : null
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
        <View style={styles.withdrawBtn}>
          <Typography size={16} color="#00B272">WITHDRAW EARNINGS</Typography>
        </View>
      )}
    </View>
  </LinearGradient>
);


const BeauticianHome = () => {
  const [enabled, setEnabled] = useState(false);
  return (
    <LinearGradient
      colors={['#EFFFF4', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1, paddingHorizontal: 20 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={ImageConstant.user2} style={{ height: 40, width: 40, resizeMode: 'cover', borderRadius: 10, marginRight: 10 }} />
              <View>
                <Typography size={16} color='#000000' type={Font.GeneralSans_Medium}>
                  Shreya Sharma  </Typography>
                <Typography>
                  <Image source={ImageConstant.Location} style={{ height: 10, width: 10, resizeMode: 'contain' }} /> Surat, Gujrat
                </Typography>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '30%', alignItems: 'center' }}>
              <Typography size={14} type={Font.GeneralSans_Regular} color='#000911'>
                Online
              </Typography>
              <CustomSwitch
                value={enabled}
                onValueChange={(val) => setEnabled(val)}
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
                Good Morning!
              </Typography>
            </View>
            <TouchableOpacity style={{ height: 45, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#00B272', borderRadius: 12, paddingHorizontal: 15 }}>
              <Typography color='#00B272'>+ Add Service</Typography>
            </TouchableOpacity>
          </View>
          <StatCard
            icon={ImageConstant.usercalander}
            value="20"
            show
            label="Today’s Appointments"
            gradientColors={['#F6F9E3', '#00B272']}
            fullWidth
            colorss={'#e6ffe480'}
            styleheight={{ height: 121 }}
          />
          <View style={styles.row}>
            <StatCard
              show
              value="20"
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
              value="₹749"
              label={<>Revenue{"\n"}Today</>}
              gradientColors={['#F6F9E3', '#C4DE00']}
              colorss='#e8ffe7ff'
              show
            />
          </View>     
          <StatCard
            icon={ImageConstant.calander3}
            value="20"
            label="Today’s Appointments"
            gradientColors={['#F6F9E3', '#00B272']}
            fullWidth
            show
            colorss={'#e7ffe680'}
            styleheight={{ height: 121 }}
          />
          <StatCard
            icon={ImageConstant.homePay}
            value="₹5000"
            label="Total Earnings"
            gradientColors={['#F6F9E3', '#FFBA6A']}
            fullWidth
            WithdrawButton
            styleheight={{ height: 186 }}
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
    marginBottom: 10,
  },
  gradientBorder: {
    flex: 0.48,
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
    width: 11,
    resizeMode: 'contain',
    tintColor: '#00B272',
  },
});
