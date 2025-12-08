import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../Component/ScreenHeader';
import Typography from '../../Component/UI/Typography';
import { Font } from '../../Constants/Font';
import Button from '../../Component/Button';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Congratulations = () => {
    const navigation = useNavigation();

    const handleKeepBrowsing = () => {
        // Navigate to home or previous screen
        navigation.navigate('Home');
    };

    return (
        <LinearGradient
            colors={['#EFFFF4', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.backgroundGradient}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Header */}
                    <ScreenHeader title="Congratulations!" showGreenLine={true} />

                    {/* Content */}
                    <View style={styles.content}>
                        {/* Orange Circle with Checkmark */}
                        <View style={styles.checkmarkCircle}>
                            <Typography
                                type={Font.GeneralSans_Bold}
                                size={80}
                                color="#FFFFFF"
                                style={styles.checkmarkIcon}>
                                ✓
                            </Typography>
                        </View>

                        {/* Congratulations Text */}
                        <Typography
                            type={Font.GeneralSans_Bold}
                            size={30}
                            color="#262626"
                            style={styles.congratulationsText}>
                            Congratulations!
                        </Typography>

                        {/* Success Message */}
                        <Typography
                            type={Font.GeneralSans_Medium}
                            size={17}
                            color="#090909"
                            style={styles.successMessage}>
                            Your beauty service has been booked successfully!
                        </Typography>

                        {/* Description Text */}
                        <Typography
                            type={Font.GeneralSans_Regular}
                            size={15}
                            color="#414141"
                            style={styles.descriptionText}>
                            Sit back and relax while we make sure a professional beautician reaches you right on time for your pampering session.
                        </Typography>
                    </View>

                 
                        <Button
                            title="KEEP BROWSING"
                            onPress={handleKeepBrowsing}
                            style={styles.button}
                            linerColor={['#00B272', '#00B272']}
                            title_style={styles.buttonText}
                            main_style={styles.buttonMain}
                        />
                    </View>
         
            </SafeAreaView>
        </LinearGradient>
    );
};

export default Congratulations;

const styles = StyleSheet.create({
    backgroundGradient: {
        flex: 1,
        width: '100%',
      
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingHorizontal:5
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
  
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: '24%',
    },
    checkmarkCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: '#FFBA6A',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    checkmarkIcon: {
    },
    congratulationsText: {
        marginBottom: 20,
        textAlign: 'center',
        width: 249,
    },
    successMessage: {
        marginBottom: 16,
        textAlign: 'center',
        width: 344,
        marginTop: 8,
    },
    descriptionText: {
        textAlign: 'center',
        width: '100%',
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 30,
        alignItems: 'center',
        paddingHorizontal: 22,
        position: 'absolute',
        bottom: 10,
    },
    buttonMain: {
        width: '100%',
    },
    button: {
        width: '90%',
     alignSelf:'center'
    },
});

