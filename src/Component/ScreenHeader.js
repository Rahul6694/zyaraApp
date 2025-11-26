import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ImageConstant} from '../Constants/ImageConstant';
import {Font} from '../Constants/Font';
import Typography from './UI/Typography';

const {width} = Dimensions.get('window');

const ScreenHeader = ({
  title,
  showLogo = false,
  onBackPress,
  showGreenLine = true,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Image
            source={ImageConstant.BackArrow}
            style={styles.backArrow}
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
                size={22}
                type={Font.GeneralSans_Medium}
                color="#090909"
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
    paddingHorizontal: 22.5,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backArrow: {
    width: 24,
    height: 24,
    tintColor: '#000000',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    textAlign: 'center',
  },
  placeholder: {
    width: 24,
  },
  logo: {
    width: 72,
    height: 30,
  },
  greenLine: {
    width: width,
    height: 1,
    backgroundColor: '#D1EDE3',
    marginTop: 0,
    marginBottom: 0,
  },
});

