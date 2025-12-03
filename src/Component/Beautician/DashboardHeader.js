import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Typography from '../UI/Typography';
import { Font } from '../../Constants/Font';

const DashboardHeader = ({ onAddService }) => {
  return (
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
        onPress={onAddService}
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
  );
};

export default DashboardHeader;

const styles = StyleSheet.create({
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
});

