import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Typography from '../UI/Typography';
import { Font } from '../../Constants/Font';
import { Colors } from '../../Constants/Colors';

const StatCard = ({ icon, title, value, onPress, style, ellipseColor }) => {
  // Handle icon - can be Image source or component
  const renderIcon = () => {
    if (typeof icon === 'number' || (icon && icon.uri)) {
      // It's an image source
      return (
        <Image 
          source={icon} 
          style={styles.iconImage}
          resizeMode="contain"
        />
      );
    }
    // It's a component
    return icon;
  };

  return (
    <TouchableOpacity 
      style={[styles.statCard, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.statCardContent}>
        <View style={styles.statCardLeft}>
          <View style={styles.statIconContainer}>
            {renderIcon()}
          </View>
          <View style={styles.statTextContainer}>
            <Typography 
              size={28}
              type={Font.GeneralSans_Bold}
              color="#000D12"
              style={styles.statValue}
            >
              {value}
            </Typography>
            <Typography 
              size={18}
              type={Font.GeneralSans_Bold}
              color="#00070A"
              style={styles.statTitle}
            >
              {title}
            </Typography>
          </View>
        </View>
        <View style={styles.statCardRight}>
          <View style={styles.statCardRightBg} />
          <View style={[styles.statCardRightEllipse, ellipseColor && { backgroundColor: ellipseColor }]} />
          <TouchableOpacity style={styles.detailButton}>
            <View style={styles.detailButtonInner}>
              <View style={styles.detailArrow} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StatCard;

const styles = StyleSheet.create({
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
    
justifyContent:'flex-end'
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
});

