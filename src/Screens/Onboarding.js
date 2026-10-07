import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Shadow} from '../Constants/Colors';
import {Font} from '../Constants/Font';
import Typography from '../Component/UI/Typography';
import {ImageConstant} from '../Constants/ImageConstant';

const {width, height} = Dimensions.get('window');
const isCompact = height < 700;

const ROLES = [
  {
    type: 'customer',
    title: "I'm a Customer",
    subtitle: 'Book beauty services at home',
    icon: ImageConstant.image1,
  },
  {
    type: 'beautician',
    title: "I'm a Beautician",
    subtitle: 'Offer services & grow your business',
    icon: ImageConstant.image2,
  },
];

const RoleCard = ({role, active, onPress}) => {
  const content = (
    <>
      <View style={[styles.roleIconWrap, active && styles.roleIconWrapActive]}>
        <Image
          source={role.icon}
          style={[
            styles.roleIcon,
            {tintColor: active ? Colors.white : Colors.brand},
          ]}
          resizeMode="contain"
        />
      </View>
      <View style={styles.roleText}>
        <Typography
          size={16}
          type={Font.GeneralSans_Semibold}
          color={active ? Colors.white : Colors.textPrimary}>
          {role.title}
        </Typography>
        <Typography
          size={12.5}
          type={Font.GeneralSans_Regular}
          color={active ? 'rgba(255,255,255,0.85)' : Colors.textSecondary}
          style={styles.roleSubtitle}>
          {role.subtitle}
        </Typography>
      </View>
      <View style={[styles.roleArrow, active && styles.roleArrowActive]}>
        <Image
          source={ImageConstant.nextarrow}
          style={[
            styles.roleArrowIcon,
            {tintColor: active ? Colors.brandDark : Colors.brand},
          ]}
          resizeMode="contain"
        />
      </View>
    </>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={role.title}
      style={[styles.roleCardOuter, active && styles.roleCardOuterActive]}>
      {active ? (
        <LinearGradient
          colors={[Colors.brand, Colors.brandDark]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.roleCard}>
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.roleCard, styles.roleCardInactive]}>
          {content}
        </View>
      )}
    </TouchableOpacity>
  );
};

const Onboarding = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [selectedUserType, setSelectedUserType] = useState('customer');

  const handleUserTypeSelect = type => {
    setSelectedUserType(type);
    // Navigate immediately when user type is selected
    if (type === 'customer') {
      navigation.navigate('CustomerStack', {
        screen: 'SignIn',
        params: {userType: 'customer'},
      });
    } else {
      navigation.navigate('BeauticianStack', {
        screen: 'Login',
        params: {userType: 'beautician'},
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <LinearGradient
        colors={['#DDF7E9', '#EEFBF4', Colors.white]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.blob, styles.blobTopRight]} />
      <View style={[styles.blob, styles.blobLeft]} />

      {/* Hero */}
      <View style={[styles.hero, {paddingTop: insets.top + 12}]}>
        <View style={styles.halo}>
          <View style={styles.haloInner}>
            <Image
              source={ImageConstant.girl}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      {/* Bottom sheet */}
      <View style={[styles.sheet, {paddingBottom: insets.bottom + 20}]}>
        <View style={styles.sheetHandle} />

        <Image
          source={ImageConstant.welcome}
          style={styles.welcomeImage}
          resizeMode="contain"
        />
        <Typography
          size={isCompact ? 38 : 46}
          type={Font.GeneralSans_Semibold}
          color={Colors.textPrimary}
          textAlign="center"
          letterSpacing={-0.5}
          style={styles.appName}>
          Looks
          <Typography
            size={isCompact ? 38 : 46}
            type={Font.GeneralSans_Semibold}
            color={Colors.brand}
            letterSpacing={-0.5}>
            Better
          </Typography>
        </Typography>
        <Typography
          size={isCompact ? 13 : 14}
          type={Font.GeneralSans_Regular}
          color={Colors.textSecondary}
          textAlign="center"
          lineHeight={20}
          style={styles.tagline}>
          Beauty & wellness services, right at your doorstep
        </Typography>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Typography
            size={12}
            type={Font.GeneralSans_Semibold}
            color={Colors.textMuted}
            letterSpacing={1}
            style={styles.dividerLabel}>
            CONTINUE AS
          </Typography>
          <View style={styles.dividerLine} />
        </View>

        {ROLES.map(role => (
          <RoleCard
            key={role.type}
            role={role}
            active={selectedUserType === role.type}
            onPress={() => handleUserTypeSelect(role.type)}
          />
        ))}
      </View>
    </View>
  );
};

export default Onboarding;

const HALO = Math.min(width * 0.78, height * 0.4);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(0,178,114,0.08)',
  },
  blobTopRight: {
    width: width * 0.8,
    height: width * 0.8,
    top: -width * 0.3,
    right: -width * 0.3,
  },
  blobLeft: {
    width: width * 0.5,
    height: width * 0.5,
    top: height * 0.28,
    left: -width * 0.3,
    backgroundColor: 'rgba(0,178,114,0.06)',
  },

  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    width: HALO,
    height: HALO,
    borderRadius: HALO / 2,
    backgroundColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  haloInner: {
    width: HALO * 0.86,
    height: HALO * 0.86,
    borderRadius: HALO,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  illustration: {
    width: HALO * 0.8,
    height: HALO * 0.8,
  },

  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 12,
    shadowColor: '#0F2A1F',
    shadowOffset: {width: 0, height: -8},
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 16,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: isCompact ? 10 : 16,
  },
  welcomeImage: {
    width: width * 0.3,
    height: isCompact ? 28 : 34,
    alignSelf: 'center',
  },
  appName: {
    marginTop: 4,
  },
  tagline: {
    marginTop: 6,
    paddingHorizontal: 20,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: isCompact ? 16 : 24,
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  dividerLabel: {
    marginHorizontal: 12,
  },

  roleCardOuter: {
    marginBottom: 12,
    borderRadius: 20,
  },
  roleCardOuterActive: {
    ...Shadow.md,
    shadowColor: Colors.brandDark,
    shadowOpacity: 0.25,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: isCompact ? 12 : 14,
    paddingHorizontal: 14,
  },
  roleCardInactive: {
    backgroundColor: Colors.white,
    borderWidth: 1.2,
    borderColor: Colors.border,
  },
  roleIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: Colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIconWrapActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  roleIcon: {
    width: 28,
    height: 28,
  },
  roleText: {
    flex: 1,
    marginLeft: 14,
  },
  roleSubtitle: {
    marginTop: 3,
  },
  roleArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.brandTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleArrowActive: {
    backgroundColor: Colors.white,
  },
  roleArrowIcon: {
    width: 8,
    height: 12,
  },
});
