import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../Constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../Component/ScreenHeader';
import Input from '../../Component/Input';
import DropdownNew from '../../Component/DropdownNew';
import { ImageConstant } from '../../Constants/ImageConstant';
import Typography from '../../Component/UI/Typography';
import { Font } from '../../Constants/Font';
import Button from '../../Component/Button';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import SimpleToast from 'react-native-simple-toast';
import moment from 'moment';
import { getStates, getCitiesByState } from '../../Backend/BeauticianAPI';
import { getUserAddresses, createBooking } from '../../Backend/BookingAPI';
import { formatAddress } from './SelectLocation';


const BookingRequest = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route?.params || {};
    const user = useSelector(state => state.userDetails) || {};
    const forSomeoneElse = !!params.forSomeoneElse;

    const [fullName, setFullName] = useState(forSomeoneElse ? '' : user?.name || '');
    const [phoneNumber, setPhoneNumber] = useState(forSomeoneElse ? '' : user?.number || user?.phone || '');
    const [emailAddress, setEmailAddress] = useState(forSomeoneElse ? '' : user?.email || '');
    const [houseNo, setHouseNo] = useState('');
    const [roadName, setRoadName] = useState('');
    const [pincode, setPincode] = useState('');
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [savedAddress, setSavedAddress] = useState(null);
    const [useNewAddress, setUseNewAddress] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Default saved address (refreshes after "Change")
    useFocusEffect(
        useCallback(() => {
            getUserAddresses(
                res => {
                    const list = res?.data || [];
                    setSavedAddress(list.find(a => a.is_default) || list[0] || null);
                },
                () => {},
            );
        }, []),
    );

    useEffect(() => {
        getStates(
            res => setStateList((res?.data || []).map(st => ({ label: st.name, value: st.id }))),
            () => {},
        );
    }, []);

    useEffect(() => {
        setSelectedCity(null);
        setCityList([]);
        if (!selectedState) {
            return;
        }
        getCitiesByState(
            selectedState,
            res => setCityList((res?.data || []).map(c => ({ label: c.name, value: c.name }))),
            () => {},
        );
    }, [selectedState]);

    const showAddressForm = !savedAddress || useNewAddress;

    const handleSubmit = () => {
        const nextErrors = {};
        if (!fullName.trim()) nextErrors.fullName = 'Name is required';
        if (!/^\d{10}$/.test(phoneNumber.trim())) nextErrors.phone = 'Enter a valid 10-digit number';
        if (emailAddress.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim())) nextErrors.email = 'Enter a valid email';
        if (showAddressForm) {
            if (!houseNo.trim()) nextErrors.houseNo = 'House / building is required';
            if (!roadName.trim()) nextErrors.roadName = 'Road / area is required';
            if (!/^\d{6}$/.test(pincode.trim())) nextErrors.pincode = 'Enter a 6-digit pincode';
            if (!selectedState) nextErrors.state = 'Select a state';
            if (!selectedCity) nextErrors.city = 'Select a city';
        }
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) {
            SimpleToast.show('Please fill the highlighted fields', SimpleToast.SHORT);
            return;
        }

        const body = {
            booking_date: params.bookingDate,
            time_slot: params.timeSlot,
            number_of_people: params.numberOfPeople || 1,
            beautician_id: params.beauticianId || undefined,
            contact_name: fullName.trim(),
            contact_phone: phoneNumber.trim(),
            contact_email: emailAddress.trim() || undefined,
            special_instructions: specialInstructions.trim() || undefined,
            payment_method: 'cash',
        };
        if (showAddressForm) {
            Object.assign(body, {
                house_no: houseNo.trim(),
                road_name: roadName.trim(),
                pincode: pincode.trim(),
                state: stateList.find(st => st.value === selectedState)?.label,
                city: selectedCity,
            });
        } else {
            body.address_id = savedAddress.id;
        }

        setLoading(true);
        createBooking(
            body,
            res => {
                setLoading(false);
                navigation.navigate('Congratulations', { booking: res?.data });
            },
            err => {
                setLoading(false);
                const message = err?.data?.message || 'Could not send booking request';
                SimpleToast.show(message, SimpleToast.LONG);
                // Slot got taken meanwhile: go back to pick another one
                if (err?.status === 409) {
                    navigation.navigate('SlotBooking', { numberOfPeople: params.numberOfPeople });
                }
            },
        );
    };

    const summaryLine = (label, value) => (
        <View style={styles.summaryLine}>
            <Typography type={Font.GeneralSans_Regular} size={14} color="#6B6B6B">{label}</Typography>
            <Typography type={Font.GeneralSans_Semibold} size={14} color="#1A1A1A" style={styles.summaryValue}>
                {value}
            </Typography>
        </View>
    );

    return (
        <LinearGradient
            colors={['#EFFFF4', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.backgroundGradient}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Header */}
                    <ScreenHeader title="Booking Request" showGreenLine={true} />

                {/* Body */}
                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled">
                        <View style={styles.content}>
                            {/* Booking summary */}
                            <View style={styles.summaryCard}>
                                {summaryLine('Date', params.bookingDate ? moment(params.bookingDate).format('ddd, D MMM YYYY') : '-')}
                                {summaryLine('Time', params.timeSlotLabel || '-')}
                                {summaryLine('Beautician', params.beauticianName || 'Zyara will assign')}
                                {summaryLine('People', String(params.numberOfPeople || 1))}
                            </View>

                            {/* Full Name Input */}
                            <View style={styles.inputFieldContainer}>
                                <Input
                                    title="Full Name"
                                    placeholder="enter name"
                                    value={fullName}
                                    onChange={setFullName}
                                    error={errors.fullName}
                                    showImage={true}
                                    source={ImageConstant.user}
                                    style_inputContainer={styles.inputContainer}
                                    mainStyle={styles.inputMainStyle}
                                    showTitle={true}
                                    placeholderTextColor="#8C8C8C"
                                />
                            </View>

                            {/* Phone Number Input */}
                            <View style={styles.inputFieldContainer}>
                                <Input
                                    title="Phone Number"
                                    placeholder="enter mobile number"
                                    value={phoneNumber}
                                    onChange={setPhoneNumber}
                                    maxLength={10}
                                    error={errors.phone}
                                    keyboardType="phone-pad"
                                    countryPicker={true}
                                    style_inputContainer={styles.inputContainer}
                                    mainStyle={styles.inputMainStyle}
                                    showTitle={true}
                                    placeholderTextColor="#8C8C8C"
                                />
                            </View>

                            {/* Email Address Input */}
                            <View style={styles.inputFieldContainer}>
                                <Input
                                    title="Email Address"
                                    placeholder="example@gmail.com"
                                    value={emailAddress}
                                    onChange={setEmailAddress}
                                    error={errors.email}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    showImage={true}
                                    source={ImageConstant.email}
                                    style_inputContainer={styles.inputContainer}
                                    mainStyle={styles.inputMainStyle}
                                    showTitle={true}
                                    placeholderTextColor="#8C8C8C"
                                />
                            </View>

                            {/* Address Section */}
                            <View style={styles.addressSection}>
                                <Typography
                                    type={Font.GeneralSans_Semibold}
                                    size={20}
                                    color="#1A1A1A"
                                    style={styles.sectionTitle}>
                                    {showAddressForm ? 'Enter Your Address' : 'Service Address'}
                                </Typography>

                                {!showAddressForm && (
                                    <View style={styles.savedAddressCard}>
                                        <View style={{ flex: 1 }}>
                                            <Typography type={Font.GeneralSans_Semibold} size={15} color="#1A1A1A">
                                                {savedAddress.label}{savedAddress.name ? ` · ${savedAddress.name}` : ''}
                                            </Typography>
                                            <Typography
                                                type={Font.GeneralSans_Regular}
                                                size={14}
                                                color="#6B6B6B"
                                                style={{ marginTop: 3, lineHeight: 20 }}>
                                                {formatAddress(savedAddress)}
                                            </Typography>
                                        </View>
                                        <TouchableOpacity onPress={() => navigation.navigate('SelectLocation', { returnTo: 'back' })}>
                                            <Typography type={Font.GeneralSans_Semibold} size={14} color={Colors.zyaraGreen}>
                                                Change
                                            </Typography>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {!!savedAddress && (
                                    <TouchableOpacity onPress={() => setUseNewAddress(v => !v)} style={styles.toggleAddress}>
                                        <Typography
                                            type={Font.GeneralSans_Medium}
                                            size={14}
                                            color={Colors.zyaraGreen}
                                            style={{ textDecorationLine: 'underline' }}>
                                            {useNewAddress ? 'Use my saved address' : 'Use a different address'}
                                        </Typography>
                                    </TouchableOpacity>
                                )}

                                {showAddressForm && (
                                <>
                                {/* House No. Building Name */}
                                <View style={styles.inputFieldContainer}>
                                    <Input
                                        title="House No. Building Name*"
                                        placeholder="enter"
                                        value={houseNo}
                                        onChange={setHouseNo}
                                        error={errors.houseNo}
                                        style_inputContainer={styles.inputContainer}
                                        mainStyle={styles.inputMainStyle}
                                        showTitle={true}
                                        placeholderTextColor="#8C8C8C"
                                    />
                                </View>

                                {/* Road Name/Area/Colony */}
                                <View style={styles.inputFieldContainer}>
                                    <Input
                                        title="Road Name/Area/Colony*"
                                        placeholder="enter"
                                        value={roadName}
                                        onChange={setRoadName}
                                        error={errors.roadName}
                                        style_inputContainer={styles.inputContainer}
                                        mainStyle={styles.inputMainStyle}
                                        showTitle={true}
                                        placeholderTextColor="#8C8C8C"
                                    />
                                </View>

                                {/* Pincode */}
                                <View style={styles.inputFieldContainer}>
                                    <Input
                                        title="Pincode*"
                                        placeholder="6-digit pincode"
                                        value={pincode}
                                        onChange={setPincode}
                                        maxLength={6}
                                        keyboardType="number-pad"
                                        error={errors.pincode}
                                        style_inputContainer={styles.inputContainer}
                                        mainStyle={styles.inputMainStyle}
                                        showTitle={true}
                                        placeholderTextColor="#8C8C8C"
                                    />
                                </View>

                                {/* State Dropdown */}
                                <View style={styles.inputFieldContainer}>
                                    <DropdownNew
                                        MainBoxStyle={{ width: '100%', alignSelf: 'center' }}
                                        data={stateList}
                                        title="State"
                                        value={selectedState}
                                        placeholder="select"
                                        search
                                        searchPlaceholder="Search state"
                                        error={errors.state}
                                        onChange={(item) => setSelectedState(item.value)}
                                        style_dropdown={styles.dropdownStyle}
                                    />
                                </View>

                                {/* City Dropdown */}
                                <View style={styles.inputFieldContainer}>
                                    <DropdownNew
                                        MainBoxStyle={{ width: '100%', alignSelf: 'center' }}
                                        data={cityList}
                                        title="City"
                                        value={selectedCity}
                                        placeholder={selectedState ? 'select' : 'select a state first'}
                                        search
                                        searchPlaceholder="Search city"
                                        disable={!selectedState}
                                        error={errors.city}
                                        onChange={(item) => setSelectedCity(item.value)}
                                        style_dropdown={styles.dropdownStyle}
                                    />
                                </View>
                                </>
                                )}
                            </View>

                            <View style={styles.inputFieldContainer}>
                                <Input
                                    title="Special Instructions"
                                    placeholder="e.g. landmark, parking, preferences"
                                    value={specialInstructions}
                                    onChange={setSpecialInstructions}
                                    multiline={true}
                                    numberOfLines={4}
                                    style_inputContainer={styles.specialInstructionsContainer}
                                    style_input={styles.specialInstructionsInput}
                                    maxLength={500}
                                    mainStyle={styles.inputMainStyle}
                                    showTitle={true}
                                    placeholderTextColor="#8C8C8C"
                                />
                            </View>

                        </View>
                    </ScrollView>

                    {/* Submit Button */}
                    <View style={styles.bottomContainer}>
                        <Button
                            title="SUBMIT BOOKING REQUEST"
                            onPress={handleSubmit}
                            linerColor={['#00B272', '#00B272']}
                            loader={loading}
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
        </LinearGradient>
    );
};

export default BookingRequest;

const styles = StyleSheet.create({
    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DDFFE8',
        borderRadius: 14,
        padding: 14,
        marginBottom: 8,
    },
    summaryLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    summaryValue: {
        flex: 1,
        textAlign: 'right',
        marginLeft: 12,
    },
    savedAddressCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#00B272',
        borderRadius: 14,
        padding: 14,
        gap: 12,
    },
    toggleAddress: {
        paddingVertical: 10,
    },
    backgroundGradient: {
        flex: 1,
        width: '100%',
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
        flexGrow: 1,
    },
    content: {
        paddingHorizontal: 22,
        paddingTop: 20,
    },
    inputFieldContainer: {
        
    },
    inputContainer: {
        height: 60,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        shadowColor: '#E9E9E9',
        shadowOffset: {
            width: 15,
            height: 20,
        },
        shadowOpacity: 0.25,
        shadowRadius: 22.5,
        elevation: 8,
    },
    inputMainStyle: {
        margin: 0,
    },
    dropdownStyle: {
        height: 60,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        shadowColor: '#E9E9E9',
        shadowOffset: {
            width: 15,
            height: 20,
        },
        shadowOpacity: 0.25,
        shadowRadius: 22.5,
        elevation: 8,
 
    },
    addressSection: {
        marginTop: 8,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 16,
    },
    specialInstructionsContainer: {
        height: 110,
        alignItems: 'flex-start',
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        shadowColor: '#E9E9E9',
        shadowOffset: {
            width: 15,
            height: 20,
        },
        shadowOpacity: 0.25,
        shadowRadius: 22.5,
        elevation: 8,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 50,
        marginBottom: 20,
        alignItems: 'center',
    },
    specialInstructionsInput: {
        height: '100%',
        paddingTop: 6,
    },
    bottomContainer: {
        paddingHorizontal: 22,
        paddingBottom: 8,
        paddingTop: 2,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
});
