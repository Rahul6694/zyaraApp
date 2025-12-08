import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

const AddNewAddress = () => {
    const navigation = useNavigation();
    
    const [deliveryOption, setDeliveryOption] = useState('Home');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedStreet, setSelectedStreet] = useState(null);
    const [loading, setLoading] = useState(false);

    const stateList = [
        { label: "Haryana", value: "HR" },
        { label: "Punjab", value: "PB" },
        { label: "Delhi", value: "DL" },
        { label: "Rajasthan", value: "RJ" },
        { label: "Assam", value: "AS" },
        { label: "Gujarat", value: "GJ" },
        { label: "Maharashtra", value: "MH" },
    ];

    const cityList = [
        { label: "Rohtak", value: "Rohtak" },
        { label: "Hisar", value: "Hisar" },
        { label: "Panipat", value: "Panipat" },
        { label: "Gurugram", value: "Gurugram" },
        { label: "Barpeta", value: "Barpeta" },
        { label: "Guwahati", value: "Guwahati" },
    ];

    const streetList = [
        { label: "Main Street", value: "Main Street" },
        { label: "Park Avenue", value: "Park Avenue" },
        { label: "Central Road", value: "Central Road" },
        { label: "Market Street", value: "Market Street" },
    ];

    const deliveryOptions = ['Home', 'Office', 'Other'];

    const handleSave = () => {
        setLoading(true);
        // Save address logic
        console.log('Address saved:', {
            deliveryOption,
            name,
            phoneNumber,
            state: selectedState,
            city: selectedCity,
            street: selectedStreet,
        });
        
        setTimeout(() => {
            setLoading(false);
            navigation.navigate('SelectLocation');
        }, 1000);
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
                                    placeholder="select"
                                    onChange={(item) => setSelectedCity(item.value)}
                                    style_dropdown={styles.dropdownStyle}
                                />
                            </View>

                            {/* Street Dropdown */}
                            <View style={styles.inputFieldContainer}>
                                <DropdownNew
                                    MainBoxStyle={{ width: '100%', alignSelf: 'center' }}
                                    data={streetList}
                                    title="Street (include house number)"
                                    leftIconsShow
                                    leftIcons={ImageConstant.location2}
                                    value={selectedStreet}
                                    placeholder="select"
                                    onChange={(item) => setSelectedStreet(item.value)}
                                    style_dropdown={styles.dropdownStyle}
                                />
                            </View>

                            {/* Save Button */}
                            <Button
                                title={loading ? 'SAVING...' : 'SAVE'}
                                onPress={handleSave}
                                style={styles.button}
                                linerColor={[Colors.zyaraGreen, Colors.zyaraGreen]}
                                title_style={styles.buttonText}
                                disabled={loading}
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
        marginBottom: 16,
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

