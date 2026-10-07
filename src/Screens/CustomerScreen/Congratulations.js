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
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import { formatPrice } from '../../Utils/imageUrl';

// "14:00-14:30" -> "02:00 pm - 02:30 pm"
const slotLabel = slot =>
    String(slot || '')
        .split('-')
        .map(t => moment(t, 'HH:mm').format('hh:mm a'))
        .join(' - ');

const { width } = Dimensions.get('window');

const Congratulations = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const booking = route?.params?.booking;

    const handleKeepBrowsing = () => {
        navigation.navigate('Home', { screen: 'Home' });
    };

    const handleViewBookings = () => {
        navigation.navigate('Home', { screen: 'My Booking' });
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
                            Your booking request has been sent!
                        </Typography>

                        {!!booking && (
                            <View style={styles.bookingCard}>
                                <View style={styles.bookingRow}>
                                    <Typography type={Font.GeneralSans_Regular} size={14} color="#6B6B6B">Booking ID</Typography>
                                    <Typography type={Font.GeneralSans_Semibold} size={14} color="#1A1A1A">{booking.booking_number}</Typography>
                                </View>
                                <View style={styles.bookingRow}>
                                    <Typography type={Font.GeneralSans_Regular} size={14} color="#6B6B6B">When</Typography>
                                    <Typography type={Font.GeneralSans_Semibold} size={14} color="#1A1A1A">
                                        {moment(booking.booking_date).format('D MMM')} · {slotLabel(booking.time_slot)}
                                    </Typography>
                                </View>
                                <View style={styles.bookingRow}>
                                    <Typography type={Font.GeneralSans_Regular} size={14} color="#6B6B6B">Total (pay after service)</Typography>
                                    <Typography type={Font.GeneralSans_Semibold} size={14} color="#1A1A1A">{formatPrice(booking.total_amount)}</Typography>
                                </View>
                            </View>
                        )}

                        {/* Description Text */}
                        <Typography
                            type={Font.GeneralSans_Regular}
                            size={15}
                            color="#414141"
                            style={styles.descriptionText}>
                            {booking?.beautician_name
                                ? `${booking.beautician_name} will confirm your request shortly. You can track it in My Bookings.`
                                : 'We are assigning a professional beautician. You can track your request in My Bookings.'}
                        </Typography>
                    </View>

                 
                        <Button
                            title="VIEW MY BOOKINGS"
                            onPress={handleViewBookings}
                            style={styles.button}
                            linerColor={['#00B272', '#00B272']}
                            title_style={styles.buttonText}
                            main_style={styles.buttonMain}
                        />
                        <Button
                            title="KEEP BROWSING"
                            onPress={handleKeepBrowsing}
                            style={[styles.button, styles.secondaryButton]}
                            linerColor={['#E6F8F0', '#E6F8F0']}
                            title_style={styles.secondaryButtonText}
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
        paddingTop: '12%',
        paddingHorizontal: 22,
    },
    checkmarkCircle: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: '#00B272',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
    },
    bookingCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#DDFFE8',
        padding: 14,
        marginBottom: 16,
    },
    bookingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    secondaryButtonText: {
        color: '#00925D',
    },
    secondaryButton: {
        marginTop: 10,
        marginBottom: 20,
    },
    checkmarkIcon: {
    },
    congratulationsText: {
        marginBottom: 20,
        textAlign: 'center',
    },
    successMessage: {
        marginBottom: 16,
        textAlign: 'center',
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

