import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
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

const BookingRequest = () => {
    const navigation = useNavigation();

    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [roadName, setRoadName] = useState('');
    const [selectedPincode, setSelectedPincode] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [loading, setLoading] = useState(false);

    const pincodeList = [
        { label: '781301', value: '781301' },
        { label: '781302', value: '781302' },
        { label: '781303', value: '781303' },
        { label: '781304', value: '781304' },
    ];

    const stateList = [
        { label: 'Haryana', value: 'HR' },
        { label: 'Punjab', value: 'PB' },
        { label: 'Delhi', value: 'DL' },
        { label: 'Rajasthan', value: 'RJ' },
        { label: 'Assam', value: 'AS' },
        { label: 'Gujarat', value: 'GJ' },
        { label: 'Maharashtra', value: 'MH' },
    ];

    const cityList = [
        { label: 'Rohtak', value: 'Rohtak' },
        { label: 'Hisar', value: 'Hisar' },
        { label: 'Panipat', value: 'Panipat' },
        { label: 'Gurugram', value: 'Gurugram' },
        { label: 'Barpeta', value: 'Barpeta' },
        { label: 'Guwahati', value: 'Guwahati' },
    ];

    const handleSubmit = () => {
        setLoading(true);
        console.log('Booking request submitted:', {
            fullName,
            phoneNumber,
            emailAddress,
            houseNo,
            roadName,
            pincode: selectedPincode,
            state: selectedState,
            city: selectedCity,
            specialInstructions,
        });

        setTimeout(() => {
            setLoading(false);
            navigation.navigate('Congratulations');
        }, 1000);
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
                            {/* Full Name Input */}
                            <View style={styles.inputFieldContainer}>
                                <Input
                                    title="Full Name"
                                    placeholder="enter name"
                                    value={fullName}
                                    onChange={setFullName}
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
                                    keyboardType="email-address"
                                    showImage={true}
                                    source={ImageConstant.email}
                                    style_inputContainer={styles.inputContainer}
                                    mainStyle={styles.inputMainStyle}
                                    showTitle={true}
                                    placeholderTextColor="#8C8C8C"
                                />
                            </View>

                            {/* Enter Your Address Section */}
                            <View style={styles.addressSection}>
                                <Typography
                                    type={Font.GeneralSans_Semibold}
                                    size={20}
                                    color="#1A1A1A"
                                    style={styles.sectionTitle}>
                                    Enter Your Address
                                </Typography>

                                {/* House No. Building Name */}
                                <View style={styles.inputFieldContainer}>
                                    <Input
                                        title="House No. Building Name*"
                                        placeholder="enter"
                                        value={houseNo}
                                        onChange={setHouseNo}
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
                                        style_inputContainer={styles.inputContainer}
                                        mainStyle={styles.inputMainStyle}
                                        showTitle={true}
                                        placeholderTextColor="#8C8C8C"
                                    />
                                </View>

                                {/* Pincode Dropdown */}
                                <View style={styles.inputFieldContainer}>
                                    <DropdownNew
                                        MainBoxStyle={{ width: '100%', alignSelf: 'center' }}
                                        data={pincodeList}
                                        title="Pincode*"
                                        leftIconsShow
                                        leftIcons={ImageConstant.location2}
                                        value={selectedPincode}
                                        placeholder="select location"
                                        onChange={(item) => setSelectedPincode(item.value)}
                                        style_dropdown={styles.dropdownStyle}
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
                                        placeholder="select"
                                        onChange={(item) => setSelectedCity(item.value)}
                                        style_dropdown={styles.dropdownStyle}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputFieldContainer}>
                                <Input
                                    title="Special Instructions"
                                    placeholder="enter No. of Guests"
                                    value={specialInstructions}
                                    onChange={setSpecialInstructions}
                                    multiline={true}
                                    numberOfLines={4}
                                    style_inputContainer={styles.specialInstructionsContainer}
                                    mainStyle={styles.inputMainStyle}
                                    showTitle={true}
                                    placeholderTextColor="#8C8C8C"
                                />
                            </View>
                           

                          
                                <Button
                                    title={loading ? 'SUBMITTING...' : 'SUBMIT BOOKING REQUEST'}
                                    onPress={handleSubmit}
                                    style={styles.button}
                                    linerColor={['#00B272', '#00B272']}
                                    title_style={styles.buttonText}
                                    loader={loading}
                                    main_style={styles.buttonMain}
                                />
                    
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
        </LinearGradient>
    );
};

export default BookingRequest;

const styles = StyleSheet.create({
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
        paddingBottom: 10,
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
        minHeight: 103,
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
    buttonMain: {
        width: width - 44,
    },
    button: {
       alignSelf:'center',
       width:'100%',
       marginTop:50,
      
    },
    
});
