import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ImageConstant} from '../Constants/ImageConstant';
import {Font} from '../Constants/Font';
import {Colors, Shadow} from '../Constants/Colors';
import Typography from './UI/Typography';

const ScreenHeader = ({
  title,
  showLogo = false,
  onBackPress,
  imgstyle,
  showGreenLine = true,
  style,
  titlecolor = Colors.textPrimary,
}) => {
  const navigation = useNavigation();
  // Headers drawn on a coloured background pass a white title
  const onDark = titlecolor === 'white' || titlecolor === Colors.white;

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
      <View style={[styles.header, style]}>
        <TouchableOpacity
          onPress={handleBackPress}
          activeOpacity={0.7}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          style={[styles.backButton, onDark && styles.backButtonOnDark]}>
          <Image
            source={ImageConstant.BackArrow}
            style={[styles.backArrow, imgstyle]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          {showLogo ? (
            <Image
              source={ImageConstant.zyara}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            title && (
              <Typography
                size={19}
                type={Font.GeneralSans_Semibold}
                color={titlecolor}
                numberOfLines={1}
                style={styles.headerTitle}>
                {title}
              </Typography>
            )
          )}
        </View>
        <View style={styles.placeholder} />
      </View>
      {showGreenLine && <View style={styles.greenLine} />}
    </>
  );
};

export default ScreenHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  backButtonOnDark: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderColor: 'rgba(255,255,255,0.35)',
    shadowOpacity: 0,
    elevation: 0,
  },
  backArrow: {
    width: 18,
    height: 18,
    tintColor: Colors.textPrimary,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  headerTitle: {
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  logo: {
    width: 80,
    height: 32,
  },
  greenLine: {
    height: 1,
    backgroundColor: Colors.divider,
  },
});
