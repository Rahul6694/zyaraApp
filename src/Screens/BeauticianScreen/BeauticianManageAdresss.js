import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../Constants/Colors';
import Button from '../../Component/Button';
import { ImageConstant } from '../../Constants/ImageConstant';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../Component/ScreenHeader';
import DropdownNew from '../../Component/DropdownNew';
import Input from '../../Component/Input';
import Typography from '../../Component/UI/Typography';
import { Font } from '../../Constants/Font';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import {
    getStates,
    getCitiesByState,
    createBeauticianAddress,
    updateBeauticianAddress,
} from '../../Backend/BeauticianAPI';
import { userDetails as updateUserDetails } from '../../Redux/action';
import SimpleToast from 'react-native-simple-toast';

const { width } = Dimensions.get('window');

const BeauticianManageAdresss = () => {
    const dispatch = useDispatch();
    const userDetails = useSelector(state => state.userDetails) || {};
    const userId = userDetails?.id;
    // Get addressId from Redux if available
    const reduxAddressId = userDetails?.address_id || null;
    
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingStates, setFetchingStates] = useState(true);
    const [fetchingCities, setFetchingCities] = useState(false);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [addressId, setAddressId] = useState(reduxAddressId);
    const [savedStateId, setSavedStateId] = useState(null);
    const [savedCityId, setSavedCityId] = useState(null);
    
    // Get address data from Redux
    const reduxAddress = userDetails?.address || userDetails?.address_line || '';
    const reduxState = userDetails?.state || userDetails?.state_id || userDetails?.state_name || null;
    const reduxCity = userDetails?.city || userDetails?.city_id || userDetails?.city_name || null;
    const [errors, setErrors] = useState({
        state: '',
        city: '',
        address: '',
    });

    // Sync addressId from Redux
    useEffect(() => {
        if (reduxAddressId && reduxAddressId !== addressId) {
            setAddressId(reduxAddressId);
        }
    }, [reduxAddressId]);

    // Fetch states on mount
    useEffect(() => {
        fetchStates();
    }, []);

    // Load address from Redux when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadAddressFromRedux();
        }, [userDetails, stateList])
    );

    // Fetch cities when state changes
    useEffect(() => {
        if (selectedState) {
            fetchCities(selectedState);
        } else {
            setCityList([]);
            setSelectedCity(null);
        }
    }, [selectedState]);

    // Set city when cities are loaded and we have a saved city value
    useEffect(() => {
        if (cityList.length > 0 && savedCityId) {
            // Find the matching city in the cityList - try multiple strategies with case insensitive matching
            const cityValStr = String(savedCityId).toLowerCase().trim();
            const matchedCity = cityList.find(
                c => {
                    const cValueStr = String(c.value).toLowerCase().trim();
                    const cLabelStr = String(c.label).toLowerCase().trim();
                    return (
                        c.value === savedCityId || 
                        c.value === String(savedCityId) || 
                        c.label === savedCityId ||
                        c.label === String(savedCityId) ||
                        cValueStr === cityValStr ||
                        cLabelStr === cityValStr ||
                        (typeof savedCityId === 'object' && c.value === savedCityId.id) ||
                        (typeof savedCityId === 'object' && c.label === savedCityId.name)
                    );
                }
            );
            if (matchedCity) {
                setSelectedCity(matchedCity.value);
            }
        }
    }, [cityList, savedCityId]);

    // Retry state matching when stateList becomes available
    useEffect(() => {
        if (stateList.length > 0 && savedStateId && !selectedState) {
            const stateValStr = String(savedStateId).toLowerCase().trim();
            const matchedState = stateList.find(
                s => {
                    const sValueStr = String(s.value).toLowerCase().trim();
                    const sLabelStr = String(s.label).toLowerCase().trim();
                    return (
                        s.value === savedStateId || 
                        s.value === String(savedStateId) || 
                        s.label === savedStateId ||
                        s.label === String(savedStateId) ||
                        sValueStr === stateValStr ||
                        sLabelStr === stateValStr
                    );
                }
            );
            if (matchedState) {
                setSelectedState(matchedState.value);
                fetchCities(matchedState.value);
            }
        }
    }, [stateList, savedStateId]);

    const fetchStates = () => {
        setFetchingStates(true);
        getStates(
            (response) => {
                // Handle different response structures
                let states = [];
                if (Array.isArray(response)) {
                    states = response;
                } else if (response?.data) {
                    states = Array.isArray(response.data) ? response.data : [];
                } else if (response?.states) {
                    states = Array.isArray(response.states) ? response.states : [];
                }
                
                const formattedStates = states.map((state) => ({
                    label: state.name || state.state_name || state.title || String(state),
                    value: state.id || state.value || state,
                }));
                setStateList(formattedStates);
                setFetchingStates(false);
                
                // After states are loaded, load address from Redux
                loadAddressFromRedux();
            },
            (error) => {
                SimpleToast.show('Failed to load states', SimpleToast.SHORT);
                setFetchingStates(false);
            }
        );
    };

    const fetchCities = (stateId) => {
        setFetchingCities(true);
        setCityList([]);
        setSelectedCity(null);
        getCitiesByState(
            stateId,
            (response) => {
                // Handle different response structures
                let cities = [];
                if (Array.isArray(response)) {
                    cities = response;
                } else if (response?.data) {
                    cities = Array.isArray(response.data) ? response.data : [];
                } else if (response?.cities) {
                    cities = Array.isArray(response.cities) ? response.cities : [];
                }
                
                const formattedCities = cities.map((city) => ({
                    label: city.name || city.city_name || city.title || String(city),
                    value: city.id || city.value || city,
                }));
                setCityList(formattedCities);
                setFetchingCities(false);
            },
            (error) => {
                SimpleToast.show('Failed to load cities', SimpleToast.SHORT);
                setFetchingCities(false);
            }
        );
    };

    const loadAddressFromRedux = () => {
        // Set address text from Redux
        if (reduxAddress) {
            setAddress(reduxAddress);
        }
        
        // Set address ID from Redux
        if (reduxAddressId) {
            setAddressId(reduxAddressId);
        }
        
        // Set state and city from Redux
        if (reduxState) {
            setSavedStateId(reduxState);
            
            // Find and set the state from stateList
            if (stateList.length > 0) {
                const stateValStr = String(reduxState).toLowerCase().trim();
                const matchedState = stateList.find(
                    s => {
                        const sValueStr = String(s.value).toLowerCase().trim();
                        const sLabelStr = String(s.label).toLowerCase().trim();
                        
                        return (
                            s.value === reduxState || 
                            s.value === String(reduxState) || 
                            s.label === reduxState ||
                            s.label === String(reduxState) ||
                            sValueStr === stateValStr ||
                            sLabelStr === stateValStr
                        );
                    }
                );
                
                if (matchedState) {
                    setSelectedState(matchedState.value);
                    // Fetch cities for this state
                    fetchCities(matchedState.value);
                }
            }
        }
        
        if (reduxCity) {
            setSavedCityId(reduxCity);
        }
    };

    const validateForm = () => {
        const newErrors = {
            state: '',
            city: '',
            address: '',
        };
        let isValid = true;

        if (!selectedState) {
            newErrors.state = 'Please select a state';
            isValid = false;
        }

        if (!selectedCity) {
            newErrors.city = 'Please select a city';
            isValid = false;
        }

        if (!address.trim()) {
            newErrors.address = 'Please enter address';
            isValid = false;
        } else if (address.trim().length < 10) {
            newErrors.address = 'Address must be at least 10 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = () => {
        if (!validateForm()) {
            return;
        }

        if (!userId) {
            SimpleToast.show('User ID not found', SimpleToast.SHORT);
            return;
        }
        
        setLoading(true);
        // Get state and city names from selected values
        const stateName = typeof selectedState === 'object' 
            ? selectedState.label 
            : stateList.find(s => s.value === selectedState)?.label || selectedState;
        const cityName = typeof selectedCity === 'object' 
            ? selectedCity.label 
            : cityList.find(c => c.value === selectedCity)?.label || selectedCity;
        
        const addressData = {
            state: stateName,
            city: cityName,
            address: address.trim(),
            is_default: true,
        };

        // If addressId exists, update; otherwise create
        if (addressId) {
            // Update existing address using addressId
            updateBeauticianAddress(
                addressId,
                addressData,
                (response) => {
                    // Update Redux with new address data
                    const updatedUserData = {
                        ...userDetails,
                        address: addressData.address,
                        state: addressData.state,
                        city: addressData.city,
                        address_id: addressId,
                    };
                    dispatch(updateUserDetails(updatedUserData));
                    
                    setLoading(false);
                    SimpleToast.show('Address updated successfully', SimpleToast.SHORT);
                },
                (error) => {
                    setLoading(false);
                    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update address';
                    SimpleToast.show(errorMessage, SimpleToast.SHORT);
                }
            );
        } else {
            // Create new address
            createBeauticianAddress(
                addressData,
                (response) => {
                    // Get the new address ID from response
                    const newAddressId = response?.data?.id || response?.id || null;
                    if (newAddressId) {
                        // Store new address ID in Redux
                        const updatedUserDetails = {
                            ...userDetails,
                            address_id: newAddressId,
                        };
                        dispatch(updateUserDetails(updatedUserDetails));
                        setAddressId(newAddressId);
                    }
                    
                    setLoading(false);
                    SimpleToast.show('Address saved successfully', SimpleToast.SHORT);
                    
                    // Update Redux with new address data
                    const newUserData = {
                        ...userDetails,
                        address: addressData.address,
                        state: addressData.state,
                        city: addressData.city,
                        address_id: newAddressId,
                    };
                    dispatch(updateUserDetails(newUserData));
                },
                (error) => {
                    setLoading(false);
                    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save address';
                    SimpleToast.show(errorMessage, SimpleToast.SHORT);
                }
            );
        }
    };

    if (fetchingStates) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.lightGreen }}>
                <View style={styles.container}>
                    <LinearGradient
                        colors={[Colors.white, Colors.lightGreen]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.backgroundGradient}
                    />
                    <ScreenHeader title="Manage Address" showGreenLine={true} />
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={Colors.zyaraGreen} />
                    </View>
                </View>
            </SafeAreaView>
        );
    }

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
                <ScreenHeader title="Manage Address" showGreenLine={true} />

                {/* Body */}
                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.content}>

                            {/* State Dropdown */}
                            <View style={styles.inputContainer}>
                                <DropdownNew
                                    MainBoxStyle={{ width: '100%', alignSelf: 'center' }}
                                    title="State"
                                    data={stateList}
                                    leftIconsShow
                                    leftIcons={ImageConstant.location2}
                                    value={selectedState}
                                    placeholder="Select State"
                                    onChange={(item) => {
                                        setSelectedState(item.value);
                                        setErrors(prev => ({ ...prev, state: '' }));
                                    }}
                                />
                                {errors.state ? (
                                    <Typography style={styles.errorText}>{errors.state}</Typography>
                                ) : null}
                            </View>

                            {/* City Dropdown */}
                            <View style={styles.inputContainer}>
                                <DropdownNew
                                    MainBoxStyle={{ width: '100%', alignSelf: 'center' }}
                                    title="City"
                                    data={cityList}
                                    leftIconsShow
                                    leftIcons={ImageConstant.location2}
                                    value={selectedCity}
                                    placeholder={fetchingCities ? "Loading cities..." : "Select City"}
                                    onChange={(item) => {
                                        setSelectedCity(item.value);
                                        setErrors(prev => ({ ...prev, city: '' }));
                                    }}
                                    disable={!selectedState || fetchingCities}
                                />
                                {errors.city ? (
                                    <Typography style={styles.errorText}>{errors.city}</Typography>
                                ) : null}
                            </View>

                            {/* Address Input */}
                            <View style={styles.inputContainer}>
                                <Input
                                    source={ImageConstant.location2}
                                    showImage={true}
                                    title="Address"
                                    placeholder="Enter your complete address"
                                    value={address}
                                    onChange={(text) => {
                                        setAddress(text);
                                        setErrors(prev => ({ ...prev, address: '' }));
                                    }}
                                    keyboardType="default"
                                    multiline={true}
                                    numberOfLines={4}
                                    showTitle={true}
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                />
                                {errors.address ? (
                                    <Typography style={styles.errorText}>{errors.address}</Typography>
                                ) : null}
                            </View>

                            {/* Save Button */}
                            <Button
                                title={loading ? 'SAVING...' : 'SAVE'}
                                onPress={handleSave}
                                style={styles.button}
                                linerColor={[Colors.zyaraGreen, Colors.zyaraGreen]}
                                title_style={styles.buttonText}
                                disabled={loading || fetchingStates}
                            />

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

            </View>
        </SafeAreaView>
    );
};

export default BeauticianManageAdresss;

const styles = StyleSheet.create({
    container: { flex: 1 },

    backgroundGradient: {
        position: 'absolute',
        width: width,
        height: '100%',
        top: 0,
        left: 0,
    },

    keyboardView: { flex: 1 },

    scrollContent: {
        paddingBottom: 40,
    },

    content: {
        paddingHorizontal: 22,
        paddingTop: 10,
    },

    button: {
        width: width - 44,
        height: 55,
        marginTop: 20,
        borderRadius: 12,
        alignSelf: 'center',
    },

    buttonText: {
        fontSize: 18,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: 4,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
});
