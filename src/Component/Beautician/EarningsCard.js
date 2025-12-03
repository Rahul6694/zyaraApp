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
import { ImageConstant } from '../../Constants/ImageConstant';

const EarningsCard = ({ totalEarnings, onWithdraw }) => {
  return (
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
              ₹{totalEarnings}
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
          {/* Growth chart image */}
          <Image 
            source={ImageConstant.No} 
            style={styles.growthImage}
            resizeMode="contain"
          />
        </View>
      </View>
      <TouchableOpacity style={styles.withdrawButton} onPress={onWithdraw}>
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
  );
};

export default EarningsCard;

const styles = StyleSheet.create({
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
  iconImage: {
    width: 47,
    height: 48,
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

