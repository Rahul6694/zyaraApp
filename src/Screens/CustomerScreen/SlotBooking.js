import React, { useEffect, useMemo, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../Component/ScreenHeader';
import Typography from '../../Component/UI/Typography';
import { Font } from '../../Constants/Font';
import Button from '../../Component/Button';
import DropdownNew from '../../Component/DropdownNew';
import { ImageConstant } from '../../Constants/ImageConstant';
import { useNavigation, useRoute } from '@react-navigation/native';
import SimpleToast from 'react-native-simple-toast';
import moment from 'moment';
import { getBookingSlots, getAppConfig } from '../../Backend/BookingAPI';

const { width } = Dimensions.get('window');
const MIN_PEOPLE = 1;
const MAX_PEOPLE = 10;

const SlotBooking = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const today = moment().startOf('day');
    const [advanceDays, setAdvanceDays] = useState(30);
    const [selectedDate, setSelectedDate] = useState(today.format('YYYY-MM-DD'));
    const [visibleMonth, setVisibleMonth] = useState(today.format('YYYY-MM'));
    const [slots, setSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(true);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [peopleCount, setPeopleCount] = useState(
        Math.min(Math.max(parseInt(route?.params?.numberOfPeople, 10) || 1, MIN_PEOPLE), MAX_PEOPLE),
    );

    const changePeople = (step) => {
        setPeopleCount(c => Math.min(Math.max(c + step, MIN_PEOPLE), MAX_PEOPLE));
    };

    useEffect(() => {
        getAppConfig(
            res => setAdvanceDays(parseInt(res?.data?.booking_advance_days, 10) || 30),
            () => {},
        );
    }, []);

    const lastDate = today.clone().add(advanceDays, 'days');

    // Only months that contain bookable days
    const months = useMemo(() => {
        const list = [];
        const cursor = today.clone().startOf('month');
        while (cursor.isSameOrBefore(lastDate, 'month')) {
            list.push({ label: cursor.format('MMMM YYYY'), value: cursor.format('YYYY-MM') });
            cursor.add(1, 'month');
        }
        return list;
    }, [advanceDays]); // eslint-disable-line react-hooks/exhaustive-deps

    // Load slots whenever the date changes
    useEffect(() => {
        setSlotsLoading(true);
        setSelectedTimeSlot(null);
        getBookingSlots(
            selectedDate,
            null,
            res => {
                setSlots(res?.data?.slots || []);
                setSlotsLoading(false);
            },
            err => {
                console.log('Slots error:', err);
                setSlots([]);
                setSlotsLoading(false);
            },
        );
    }, [selectedDate]);

    // Monday-first grid for the visible month
    const generateCalendarDates = () => {
        const firstDay = moment(visibleMonth, 'YYYY-MM').startOf('month');
        const lastDay = firstDay.clone().endOf('month');
        const startDate = firstDay.clone().startOf('isoWeek');
        const endDate = lastDay.clone().endOf('isoWeek');

        const dates = [];
        const currentDate = startDate.clone();
        while (currentDate.isSameOrBefore(endDate, 'day')) {
            const inMonth = currentDate.month() === firstDay.month();
            const bookable = inMonth && currentDate.isSameOrAfter(today, 'day') && currentDate.isSameOrBefore(lastDate, 'day');
            dates.push({
                date: currentDate.date(),
                value: currentDate.format('YYYY-MM-DD'),
                isCurrentMonth: inMonth,
                isBookable: bookable,
                isSelected: currentDate.format('YYYY-MM-DD') === selectedDate,
            });
            currentDate.add(1, 'day');
        }
        return dates;
    };

    const calendarDates = generateCalendarDates();
    const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    const availableCount = slots.filter(sl => sl.available).length;

    const monthIndex = months.findIndex(m => m.value === visibleMonth);
    const canGoPrev = monthIndex > 0;
    const canGoNext = monthIndex > -1 && monthIndex < months.length - 1;

    const changeMonth = (step) => {
        const next = months[monthIndex + step];
        if (next) {
            setVisibleMonth(next.value);
        }
    };

    const isPastDate = (value) => moment(value, 'YYYY-MM-DD').isBefore(moment().startOf('day'), 'day');

    const handleDateSelect = (date) => {
        if (date.isBookable && !isPastDate(date.value)) {
            setSelectedDate(date.value);
        }
    };

    const handleConfirmSlot = () => {
        if (isPastDate(selectedDate)) {
            SimpleToast.show('Please select today or a future date', SimpleToast.SHORT);
            setSelectedDate(moment().format('YYYY-MM-DD'));
            setVisibleMonth(moment().format('YYYY-MM'));
            return;
        }
        if (!selectedTimeSlot) {
            SimpleToast.show('Please select a time slot', SimpleToast.SHORT);
            return;
        }
        navigation.navigate('ChooseBeauticians', {
            bookingDate: selectedDate,
            timeSlot: selectedTimeSlot.value,
            timeSlotLabel: selectedTimeSlot.label,
            numberOfPeople: peopleCount,
            forSomeoneElse: !!route?.params?.forSomeoneElse,
        });
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
                                {/* Month Selector */}
                                <View style={styles.monthYearSelector}>
                                    <TouchableOpacity
                                        disabled={!canGoPrev}
                                        onPress={() => changeMonth(-1)}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        style={[styles.monthArrow, !canGoPrev && styles.monthArrowDisabled]}>
                                        <Image
                                            source={ImageConstant.nextarrow}
                                            style={[styles.monthArrowIcon, { transform: [{ rotate: '180deg' }] }]}
                                        />
                                    </TouchableOpacity>
                                    <DropdownNew
                                        MainBoxStyle={styles.monthYearDropdown}
                                        data={months}
                                        value={visibleMonth}
                                        onChange={(item) => setVisibleMonth(item.value)}
                                        style_dropdown={styles.monthYearDropdownStyle}
                                        placeholder=""
                                        size={24}
                                        selectedTextStyleNew={styles.monthYearText}
                                    />
                                    <TouchableOpacity
                                        disabled={!canGoNext}
                                        onPress={() => changeMonth(1)}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        style={[styles.monthArrow, !canGoNext && styles.monthArrowDisabled]}>
                                        <Image
                                            source={ImageConstant.nextarrow}
                                            style={[styles.monthArrowIcon, { transform: [{ rotate: '0deg' }] }]}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Week Days Header */}
                                <View style={styles.weekDaysHeader}>
                                    {weekDays.map((day) => (
                                        <View key={day} style={styles.weekDayHeader}>
                                            <Typography
                                                type={Font.GeneralSans_Medium}
                                                size={16}
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
                                    {calendarDates.map((dateItem) => (
                                        <TouchableOpacity
                                            key={dateItem.value}
                                            disabled={!dateItem.isBookable}
                                            onPress={() => handleDateSelect(dateItem)}
                                            style={[
                                                styles.dateCell,
                                                !dateItem.isBookable && styles.dateCellDisabled,
                                            ]}>
                                            {dateItem.isSelected && (
                                                <View style={styles.selectedDateCircle} />
                                            )}
                                            <Typography
                                                type={Font.GeneralSans_Regular}
                                                size={17}
                                                color={
                                                    dateItem.isSelected
                                                        ? '#FFFFFF'
                                                        : !dateItem.isBookable
                                                        ? '#9291A5'
                                                        : '#1D1C2B'
                                                }
                                                style={[
                                                    dateItem.isSelected && styles.selectedDateText,
                                                    { zIndex: 1 },
                                                ]}>
                                                {dateItem.isCurrentMonth ? dateItem.date : ''}
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
                            <Typography
                                type={Font.GeneralSans_Regular}
                                size={14}
                                color="#6B6B6B"
                                style={styles.slotHint}>
                                {moment(selectedDate).format('dddd, D MMMM')}
                                {!slotsLoading ? ` · ${availableCount} slots available` : ''}
                            </Typography>

                            {slotsLoading ? (
                                <ActivityIndicator color="#00B272" style={{ marginVertical: 20 }} />
                            ) : availableCount === 0 ? (
                                <Typography
                                    type={Font.GeneralSans_Regular}
                                    size={15}
                                    color="#6B6B6B">
                                    No slots left on this day. Please pick another date.
                                </Typography>
                            ) : (
                            <View style={styles.timeSlotsContainer}>
                                {slots.map((slot) => {
                                    const selected = selectedTimeSlot?.value === slot.value;
                                    return (
                                    <TouchableOpacity
                                        key={slot.value}
                                        disabled={!slot.available}
                                        onPress={() => setSelectedTimeSlot(slot)}
                                        style={[
                                            styles.timeSlotButton,
                                            selected && styles.timeSlotButtonSelected,
                                            !slot.available && styles.timeSlotButtonDisabled,
                                        ]}>
                                        <Typography
                                            type={Font.GeneralSans_Medium}
                                            size={15}
                                            color={!slot.available ? '#B5B5B5' : selected ? '#00925D' : '#101010'}
                                            style={styles.timeSlotText}>
                                            {slot.label}
                                        </Typography>
                                    </TouchableOpacity>
                                    );
                                })}
                            </View>
                            )}
                        </View>

                        {/* Number of People Section */}
                        <View style={styles.section}>
                            <Typography
                                type={Font.GeneralSans_Semibold}
                                size={20}
                                color="#1A1A1A"
                                style={styles.sectionTitle}>
                                Number of People
                            </Typography>

                            <View style={styles.peopleCard}>
                                <Typography
                                    type={Font.GeneralSans_Regular}
                                    size={15}
                                    color="#6B6B6B">
                                    {peopleCount === 1 ? '1 person' : `${peopleCount} people`}
                                </Typography>
                                <View style={styles.stepper}>
                                    <TouchableOpacity
                                        disabled={peopleCount <= MIN_PEOPLE}
                                        onPress={() => changePeople(-1)}
                                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                        style={[styles.stepperButton, peopleCount <= MIN_PEOPLE && styles.stepperButtonDisabled]}>
                                        <Typography type={Font.GeneralSans_Semibold} size={20} color="#00B272" style={styles.stepperSign}>
                                            −
                                        </Typography>
                                    </TouchableOpacity>
                                    <Typography
                                        type={Font.GeneralSans_Semibold}
                                        size={18}
                                        color="#1D1C2B"
                                        style={styles.stepperValue}>
                                        {peopleCount}
                                    </Typography>
                                    <TouchableOpacity
                                        disabled={peopleCount >= MAX_PEOPLE}
                                        onPress={() => changePeople(1)}
                                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                        style={[styles.stepperButton, styles.stepperButtonActive, peopleCount >= MAX_PEOPLE && styles.stepperButtonDisabled]}>
                                        <Typography type={Font.GeneralSans_Semibold} size={20} color="#FFFFFF" style={styles.stepperSign}>
                                            +
                                        </Typography>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <Button
                            title="CONFIRM SLOT"
                            onPress={handleConfirmSlot}
                            disabled={!selectedTimeSlot}
                            linerColor={selectedTimeSlot ? ['#00B272', '#00B272'] : ['#C9CED6', '#C9CED6']}
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
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    monthArrow: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    monthArrowDisabled: {
        opacity: 0.3,
    },
    monthArrowIcon: {
        width: 12,
        height: 12,
        resizeMode: 'contain',
        tintColor: '#1D1C2B',
    },
    monthYearText: {
        fontFamily: Font.GeneralSans_Medium,
        fontSize: 17,
        color: '#1D1C2B',
        textAlign: 'center',
    },
    monthYearDropdown: {
        flex: 1,
        marginHorizontal: 12,
        marginVertical: 0,
    },
    monthYearDropdownStyle: {
        height: 36,
        borderColor: 'transparent',
        paddingLeft: 24,
        backgroundColor: 'transparent',
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
        borderWidth: 1.5,
        backgroundColor: '#F4FCF8',
    },
    timeSlotButtonDisabled: {
        backgroundColor: '#F4F4F4',
        borderColor: '#EEEEEE',
        elevation: 0,
        shadowOpacity: 0,
    },
    slotHint: {
        marginTop: -12,
        marginBottom: 14,
    },
    timeSlotText: {
        textTransform: 'lowercase',
        textAlign: 'center',
    },
    peopleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    stepper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepperButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#00B272',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepperButtonActive: {
        backgroundColor: '#00B272',
    },
    stepperButtonDisabled: {
        opacity: 0.35,
    },
    stepperSign: {
        lineHeight: 22,
        textAlign: 'center',
    },
    stepperValue: {
        minWidth: 44,
        textAlign: 'center',
    },
    buttonMain: {
        marginTop: 4,
        marginBottom: 10,
    },
});
