import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  PixelRatio,
  Image,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Shadow } from '../Constants/Colors';
import { Font } from '../Constants/Font';
import Typography from './UI/Typography';

const Button = ({
  onPress,
  title,
  loader = false,
  disabled = false,
  style,
  title_style,
  main_style,
  linerColor = [Colors.brand, Colors.brandDark],
  icon,
  IconStyle = {},
}) => {
  const fontScale = PixelRatio?.getFontScale();
  const isDisabled = loader || disabled;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[styles.shadow, main_style, isDisabled && styles.disabled]}>
      <LinearGradient
        colors={linerColor}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.opacity_style, style]}>
        {loader ? (
          <ActivityIndicator size="small" color={Colors?.white} />
        ) : (
          <View style={styles.row}>
            {icon && (
              <Image source={icon} style={[styles.icon, IconStyle]} />
            )}
            <Typography
              style={[
                styles.text_style,
                title_style,
                { fontSize: 16 / fontScale },
              ]}>
              {title}
            </Typography>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  shadow: {
    ...Shadow.sm,
    shadowColor: Colors.brandDark,
    shadowOpacity: 0.18,
  },
  disabled: {
    opacity: 0.6,
  },
  opacity_style: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    marginVertical: 10,
    height: 56,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 8,
  },
  text_style: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Font.GeneralSans_Semibold,
    letterSpacing: 0.3,
  },
});
