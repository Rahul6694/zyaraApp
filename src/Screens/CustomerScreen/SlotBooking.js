import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../Constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../Component/ScreenHeader';
import Typography from '../../Component/UI/Typography';
import { Font } from '../../Constants/Font';
import Button from '../../Component/Button';
import Input from '../../Component/Input';
import DropdownNew from '../../Component/DropdownNew';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const { width } = Dimensions.get('window');

const SlotBooking = () => {
    const navigation = useNavigation();

    const [selectedDate, setSelectedDate] = useState(22);
    const [selectedMonth, setSelectedMonth] = useState('August');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('02:00 - 02:30 pm');
    const [numberOfPeople, setNumberOfPeople] = useState('1');

    const months = [
        { label: 'January', value: 'January' },
        { label: 'February', value: 'February' },
        { label: 'March', value: 'March' },
        { label: 'April', value: 'April' },
        { label: 'May', value: 'May' },
        { label: 'June', value: 'June' },
        { label: 'July', value: 'July' },
        { label: 'August', value: 'August' },
        { label: 'September', value: 'September' },
        { label: 'October', value: 'October' },
        { label: 'November', value: 'November' },
        { label: 'December', value: 'December' },
    ];

    const years = [];
    const currentYear = moment().year();
    for (let i = currentYear; i <= currentYear + 2; i++) {
        years.push({ label: String(i), value: String(i) });
    }

    const timeSlots = [
        '01:00 - 01:30 pm',
        '02:00 - 02:30 pm',
        '03:00 - 03:30 pm',
        '04:00 - 05:30 pm',
        '05:30 - 06:00 pm',
        '06:00 - 06:30 pm',
    ];

    // Generate calendar dates for August 2025
    const generateCalendarDates = () => {
        const month = moment().month(selectedMonth).month();
        const year = parseInt(selectedYear);
        const firstDay = moment({ year, month, day: 1 });
        const lastDay = moment({ year, month, day: 1 }).endOf('month');
        const startDate = firstDay.clone().startOf('week');
        const endDate = lastDay.clone().endOf('week');

        const dates = [];
        let currentDate = startDate.clone();

        while (currentDate <= endDate) {
            dates.push({
                date: currentDate.date(),
                fullDate: currentDate.clone(),
                isCurrentMonth: currentDate.month() === month,
                isSelected: currentDate.date() === selectedDate && currentDate.month() === month,
            });
            currentDate.add(1, 'day');
        }

        return dates;
    };

    const calendarDates = generateCalendarDates();
    const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    const handleDateSelect = (date) => {
        if (date.isCurrentMonth) {
            setSelectedDate(date.date);
        }
    };

    const handleConfirmSlot = () => {
        console.log('Slot confirmed:', {
            date: selectedDate,
            month: selectedMonth,
            year: selectedYear,
            timeSlot: selectedTimeSlot,
            numberOfPeople: numberOfPeople,
        });
        navigation.navigate('BookingRequest');
    };

    return (
        <LinearGradient
            colors={['#EFFFF4', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.backgroundGradient}>
            <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Background Gradient */}
               

                {/* Header */}
                <ScreenHeader title="Slot Booking" showGreenLine={true} />

                {/* Body */}
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        {/* Select Your Date Section */}
                        <View style={styles.section}>
                            <Typography
                                type={Font.GeneralSans_Semibold}
                                size={20}
                                color="#1A1A1A"
                                style={styles.sectionTitle}>
                                Select Your Date
                            </Typography>

                            {/* Calendar Card */}
                            <View style={styles.calendarCard}>
                                {/* Month and Year Selector */}
                                <View style={styles.monthYearSelector}>
                                    <DropdownNew
                                        MainBoxStyle={styles.monthYearDropdown}
                                        data={months}
                                        value={selectedMonth}
                                        onChange={(item) => setSelectedMonth(item.value)}
                                        style_dropdown={styles.monthYearDropdownStyle}
                                        placeholder=""
                                    />
                                    <View style={styles.arrowSeparator} />
                                    <DropdownNew
                                        MainBoxStyle={styles.monthYearDropdown}
                                        data={years}
                                        value={selectedYear}
                                        onChange={(item) => setSelectedYear(item.value)}
                                        style_dropdown={styles.monthYearDropdownStyle}
                                        placeholder=""
                                    />
                                </View>

                                {/* Week Days Header */}
                                <View style={styles.weekDaysHeader}>
                                    {weekDays.map((day) => (
                                        <View key={day} style={styles.weekDayHeader}>
                                            <Typography
                                                type={Font.GeneralSans_Medium}
                                                size={18}
                                                color="#9291A5">
                                                {day}
                                            </Typography>
                                        </View>
                                    ))}
                                </View>

                                {/* Divider */}
                                <View style={styles.calendarDivider} />

                                {/* Calendar Grid */}
                                <View style={styles.calendarGrid}>
                                    {calendarDates.map((dateItem, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => handleDateSelect(dateItem)}
                                            style={[
                                                styles.dateCell,
                                                !dateItem.isCurrentMonth && styles.dateCellDisabled,
                                                dateItem.isSelected && styles.dateCellSelected,
                                            ]}>
                                            {dateItem.isSelected && (
                                                <View style={styles.selectedDateCircle} />
                                            )}
                                            <Typography
                                                type={Font.GeneralSans_Regular}
                                                size={18}
                                                color={
                                                    dateItem.isSelected
                                                        ? '#FFFFFF'
                                                        : !dateItem.isCurrentMonth
                                                        ? '#9291A5'
                                                        : '#1D1C2B'
                                                }
                                                style={[
                                                    dateItem.isSelected && styles.selectedDateText,
                                                    { zIndex: 1 },
                                                ]}>
                                                {dateItem.date}
                                            </Typography>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        {/* Select Service Start time Section */}
                        <View style={styles.section}>
                            <Typography
                                type={Font.GeneralSans_Semibold}
                                size={20}
                                color="#1A1A1A"
                                style={styles.sectionTitle}>
                                Select Service Start time
                            </Typography>

                            <View style={styles.timeSlotsContainer}>
                                {timeSlots.map((slot) => (
                                    <TouchableOpacity
                                        key={slot}
                                        onPress={() => setSelectedTimeSlot(slot)}
                                        style={[
                                            styles.timeSlotButton,
                                            selectedTimeSlot === slot && styles.timeSlotButtonSelected,
                                        ]}>
                                        <Typography
                                            type={Font.GeneralSans_Medium}
                                            size={16}
                                            color={
                                                selectedTimeSlot === slot ? '#101010' : '#101010'
                                            }
                                            style={styles.timeSlotText}>
                                            {slot.toLowerCase()}
                                        </Typography>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Add Number of Peoples Section */}
                        <View style={styles.section}>
                            <Typography
                                type={Font.GeneralSans_Medium}
                                size={16}
                                color="#0A0A0A"
                                style={styles.peopleTitle}>
                                Add Number of Peoples
                            </Typography>

                            <View style={styles.peopleInputCard}>
                                <Input
                                    title=""
                                    placeholder="1"
                                    value={numberOfPeople}
                                    onChange={setNumberOfPeople}
                                    keyboardType="numeric"
                                    style_inputContainer={styles.peopleInput}
                                    mainStyle={styles.peopleInputMain}
                                    showTitle={false}
                                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                />
                            </View>
                        </View>

                       
                            <Button
                                title="CONFIRM SLOT"
                                onPress={handleConfirmSlot}
                                style={styles.button}
                                linerColor={['#00B272', '#00B272']}
                                title_style={styles.buttonText}
                                main_style={styles.buttonMain}
                            />
                        </View>
                    
                </ScrollView>
            </View>
        </SafeAreaView>
        </LinearGradient>
    );
};

export default SlotBooking;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    backgroundGradient: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        paddingBottom: 10,
        flexGrow: 1,
    },
    content: {
        paddingHorizontal: 22,
        paddingTop: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        marginBottom: 20,
        fontSize: 20,
    },
    monthYearSelector: {
        flexDirection: 'row',
        alignItems: 'center',
      justifyContent:'center',
        marginBottom: 20,
    },
    monthYearDropdown: {
        width: 120,
    
    },
    monthYearDropdownStyle: {
        height: 28,
        borderColor: 'transparent',
    
    },
  
    calendarCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 20,
        shadowColor: '#E9E9E9',
        shadowOffset: {
            width: 15,
            height: 20,
        },
        shadowOpacity: 0.25,
        shadowRadius: 22.5,
        elevation: 8,
    },
    weekDaysHeader: {
        flexDirection: 'row',
        marginBottom: 16,
        paddingHorizontal: 0,
    },
    weekDayHeader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendarDivider: {
        height: 1,
        backgroundColor: '#F2F1FF',
        marginBottom: 16,
        marginHorizontal: 0,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    dateCell: {
        width: (width - 76) / 7 - 2,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        position: 'relative',
    },
    dateCellDisabled: {
        opacity: 0.4,
    },
    dateCellSelected: {
        // Selected styling handled by circle
    },
    selectedDateCircle: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#00B272',
        zIndex: 0,
    },
    selectedDateText: {
        fontWeight: '700',
    },
    timeSlotsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    timeSlotButton: {
        width: (width - 64) / 3 - 8,
       
        borderRadius: 9,
        borderWidth: 1,
        padding:10,
        borderColor: '#DDDDDD',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#E9E9E9',
        shadowOffset: {
            width: 15,
            height: 20,
        },
        shadowOpacity: 0.25,
        shadowRadius: 22.5,
        elevation: 8,
    },
    timeSlotButtonSelected: {
        borderColor: '#00B272',
    },
    timeSlotText: {
        textTransform: 'lowercase',
    },
    peopleTitle: {
        marginBottom: 12,
        fontSize: 16,
    },
    peopleInputCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 12,
        shadowColor: '#E9E9E9',
        shadowOffset: {
            width: 15,
            height: 20,
        },
        shadowOpacity: 0.25,
        shadowRadius: 22.5,
        elevation: 8,
    },
    peopleInput: {
        height: 60,
        borderRadius: 12,
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    peopleInputMain: {
        margin: 0,
    },
  
   
  
});
