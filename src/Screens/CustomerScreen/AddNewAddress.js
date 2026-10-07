import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
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
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import SimpleToast from 'react-native-simple-toast';
import { getStates, getCitiesByState } from '../../Backend/BeauticianAPI';
import { createUserAddress } from '../../Backend/BookingAPI';

const { width } = Dimensions.get('window');

const AddNewAddress = () => {
    const navigation = useNavigation();
    
    const user = useSelector(state => state.userDetails) || {};

    const [deliveryOption, setDeliveryOption] = useState('Home');
    const [name, setName] = useState(user?.name || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.number || user?.phone || '');
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [houseNo, setHouseNo] = useState('');
    const [roadName, setRoadName] = useState('');
    const [pincode, setPincode] = useState('');
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getStates(
            res => setStateList((res?.data || []).map(st => ({ label: st.name, value: st.id }))),
            err => console.log('States error:', err),
        );
    }, []);

    // Cities depend on the chosen state
    useEffect(() => {
        setSelectedCity(null);
        setCityList([]);
        if (!selectedState) {
            return;
        }
        getCitiesByState(
            selectedState,
            res => setCityList((res?.data || []).map(c => ({ label: c.name, value: c.name }))),
            err => console.log('Cities error:', err),
        );
    }, [selectedState]);

    const deliveryOptions = ['Home', 'Office', 'Other'];

    const handleSave = () => {
        const nextErrors = {};
        if (!name.trim()) nextErrors.name = 'Name is required';
        if (!/^\d{10}$/.test(phoneNumber.trim())) nextErrors.phone = 'Enter a valid 10-digit number';
        if (!selectedState) nextErrors.state = 'Select a state';
        if (!selectedCity) nextErrors.city = 'Select a city';
        if (!houseNo.trim()) nextErrors.houseNo = 'House / flat number is required';
        if (pincode && !/^\d{6}$/.test(pincode.trim())) nextErrors.pincode = 'Pincode must be 6 digits';
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) {
            return;
        }

        setLoading(true);
        createUserAddress(
            {
                label: deliveryOption,
                name: name.trim(),
                phone: phoneNumber.trim(),
                state: stateList.find(st => st.value === selectedState)?.label,
                city: selectedCity,
                house_no: houseNo.trim(),
                road_name: roadName.trim(),
                pincode: pincode.trim(),
                is_default: true,
            },
            () => {
                setLoading(false);
                SimpleToast.show('Address saved', SimpleToast.SHORT);
                navigation.goBack();
            },
            err => {
                setLoading(false);
                SimpleToast.show(err?.data?.message || 'Could not save address', SimpleToast.SHORT);
            },
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.lightGreen }}>
            <View style={styles.container}>
                {/* Background Gradient */}
                <LinearGradient
                    colors={[Colors.white, Colors.lightGreen]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.backgroundGradient}
                />

                {/* Header */}
                <ScreenHeader title="Add New Address" showGreenLine={true} />

                {/* Body */}
                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled">
                        <View style={styles.content}>
                            {/* Select Delivery Option */}
                            <View style={styles.deliveryOptionSection}>
                                <Typography
                                    type={Font.GeneralSans_Semibold}
                                    size={20}
                                    color="#1C1C1C"
                                    style={styles.sectionTitle}>
                                    Select Delivery Option
                                </Typography>
                                <View style={styles.radioButtonContainer}>
                                    {deliveryOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={styles.radioButton}
                                            onPress={() => setDeliveryOption(option)}
                                            activeOpacity={0.7}>
                                            <View style={[
                                                styles.radioCircle,
                                                deliveryOption === option && styles.radioCircleSelected
                                            ]}>
                                                {deliveryOption === option && (
                                                    <View style={styles.radioInnerCircle} />
                                                )}
                                            </View>
                                            <Typography
                                                type={Font.GeneralSans_Regular}
                                                size={18}
                                                color="#000000"
                                                style={styles.radioLabel}>
                                                {option}
                                            </Typography>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Name Input */}
                            <View style={styles.inputFieldContainer}>
                                <Input
                                    title="Name"
                                    placeholder="enter name"
                                    value={name}
                                    onChange={setName}
                                    error={errors.name}
                                    showImage={true}
                                    source={ImageConstant.user}
                                    style_inputContainer={styles.inputContainer}
                                    mainStyle={styles.inputMainStyle}
                                    showTitle={true}
                                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
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
                                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                />
                            </View>

                            {/* State Dropdown */}
                            <View style={styles.inputFieldContainer}>
                                <DropdownNew
                                    MainBoxStyle={{ width: '100%', alignSelf: 'center' }}
                                    data={stateList}
                                    title="State"
                                    leftIconsShow
                                    leftIcons={ImageConstant.location2}
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
                                    leftIconsShow
                                    leftIcons={ImageConstant.location2}
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

                            {/* House / street */}
                            <View style={styles.inputFieldContainer}>
                                <Input
                                    title="House / Flat No."
                                    placeholder="e.g. 12B, Green Park Apartments"
                                    value={houseNo}
                                    onChange={setHouseNo}
                                    error={errors.houseNo}
                                    style_inputContainer={styles.inputContainer}
                                    mainStyle={styles.inputMainStyle}
                                    showTitle={true}
                                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                />
                            </View>

                            <View style={styles.inputFieldContainer}>
                                <Input
                                    title="Street / Area"
                                    placeholder="e.g. MG Road, Athwa"
                                    value={roadName}
                                    onChange={setRoadName}
                                    style_inputContainer={styles.inputContainer}
                                    mainStyle={styles.inputMainStyle}
                                    showTitle={true}
                                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                />
                            </View>

                            <View style={styles.inputFieldContainer}>
                                <Input
                                    title="Pincode"
                                    placeholder="6-digit pincode"
                                    value={pincode}
                                    onChange={setPincode}
                                    maxLength={6}
                                    keyboardType="number-pad"
                                    error={errors.pincode}
                                    style_inputContainer={styles.inputContainer}
                                    mainStyle={styles.inputMainStyle}
                                    showTitle={true}
                                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                />
                            </View>

                            {/* Save Button */}
                            <Button
                                title="SAVE"
                                onPress={handleSave}
                                style={styles.button}
                                linerColor={[Colors.zyaraGreen, Colors.zyaraGreen]}
                                title_style={styles.buttonText}
                                loader={loading}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

export default AddNewAddress;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    backgroundGradient: {
        position: 'absolute',
        width: width,
        height: '100%',
        top: 0,
        left: 0,
    },

    keyboardView: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 40,
        flexGrow: 1,
    },

    content: {
        paddingHorizontal: 22,
        paddingTop: 20,
    },

    deliveryOptionSection: {
        marginBottom: 24,
    },

    sectionTitle: {
        fontSize: 20,
        marginBottom: 16,
    },

    radioButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 48,
    },

    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#C4C4C4',
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },

    radioCircleSelected: {
        borderColor: Colors.zyaraGreen,
        backgroundColor: Colors.zyaraGreen,
    },

    radioInnerCircle: {
        width: 8,
        height: 8,
        borderRadius: 5,
        backgroundColor: Colors.white,
    },

    radioLabel: {
        fontSize: 18,
    },

    inputFieldContainer: {
        marginBottom: 4,
    },

    inputContainer: {
        height: 60,
        borderRadius: 12,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#DDDDDD',
    },

    inputMainStyle: {
        margin: 0,
    },

    dropdownStyle: {
        height: 60,
        borderRadius: 12,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#DDDDDD',
    },

    button: {
        width: width - 44,
        height: 60,
        marginTop: 30,
        marginBottom: 20,
        borderRadius: 12,
        alignSelf: 'center',
    },

    buttonText: {
        fontSize: 18,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
});

