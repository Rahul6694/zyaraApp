import React from 'react';
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Colors} from '../Constants/Colors';
import {Font} from '../Constants/Font';
import Typography from './UI/Typography';

// Shared bottom tab bar for the customer and beautician navigators.
// `icons` maps a route name to its image source.
const TabBar = ({state, navigation, icons, fallbackIcon}) => {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={route.name}>
            <View style={[styles.iconPill, isFocused && styles.iconPillActive]}>
              <Image
                source={icons[route.name] || fallbackIcon}
                style={[
                  styles.icon,
                  {tintColor: isFocused ? Colors.brand : Colors.textMuted},
                ]}
                resizeMode="contain"
              />
            </View>
            <Typography
              size={11.5}
              numberOfLines={1}
              type={isFocused ? Font.GeneralSans_Semibold : Font.GeneralSans_Medium}
              color={isFocused ? Colors.brand : Colors.textSecondary}
              style={styles.label}>
              {route.name}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    paddingTop: 8,
    paddingBottom: 6,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    shadowColor: '#0F2A1F',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPill: {
    width: 52,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPillActive: {
    backgroundColor: Colors.brandSoft,
  },
  icon: {
    width: 22,
    height: 22,
  },
  label: {
    marginTop: 4,
  },
});
