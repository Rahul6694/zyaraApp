import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../Constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../Component/ScreenHeader';
import Input from '../../Component/Input';
import { ImageConstant } from '../../Constants/ImageConstant';
import Typography from '../../Component/UI/Typography';
import { Font } from '../../Constants/Font';
import Button from '../../Component/Button';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SelectLocation = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentLocation] = useState('Barpeta town, Assam, India');

    const handleUseCurrentLocation = () => {
        // Get current location logic
        console.log('Use current location');
    };

    const handleAddAddress = () => {
        // Navigate to Add New Address screen
        navigation.navigate('AddNewAddress');
    };

    const handleSave = () => {
        // Save location logic
        console.log('Location saved');
        navigation.navigate("AddToCart");
    };

    return (
        <>
            <LinearGradient
                colors={[Colors.white, Colors.lightGreen]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.backgroundGradient}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <ScreenHeader title="Select Location" showGreenLine={false} />

                <View style={styles.container}>
                    {/* Search Bar */}
                    <Input
                        mainStyle={{ marginTop: 5 }}
                        source={ImageConstant.search}
                        showImage={true}
                        placeholder="search for area"
                        style_inputContainer={styles.searchInput}
                        placeholderTextColor="#656565"
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />

                    {/* Use Current Location Card */}
                    <TouchableOpacity
                        style={styles.locationCard}
                        onPress={handleUseCurrentLocation}
                        activeOpacity={0.7}>
                        <View style={styles.locationIconContainer}>
                            <View style={styles.locationPin}>
                                <View style={styles.pinDot} />
                                <View style={styles.pinBase} />
                            </View>
                        </View>
                        <View style={styles.locationContent}>
                            <Typography
                                type={Font.GeneralSans_Medium}
                                size={18}
                                color={Colors.zyaraGreen}
                                style={styles.locationLabel}>
                                Use Current location
                            </Typography>
                            <Typography
                                type={Font.GeneralSans_Regular}
                                size={18}
                                color="#000000"
                                style={styles.locationAddress}>
                                {currentLocation}
                            </Typography>
                        </View>
                        <Image
                            source={ImageConstant.nextarrow}
                            style={styles.arrowIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Add Address Button */}
                    <TouchableOpacity
                        style={styles.addAddressCard}
                        onPress={handleAddAddress}
                        activeOpacity={0.7}>
                        <View style={styles.locationIconContainer}>
                            <View style={styles.locationPin}>
                                <View style={styles.pinDot} />
                                <View style={styles.pinBase} />
                            </View>
                        </View>
                        <Typography
                            type={Font.GeneralSans_Medium}
                            size={18}
                            color={Colors.zyaraGreen}
                            style={styles.addAddressText}>
                            Add Address
                        </Typography>
                        <Image
                            source={ImageConstant.nextarrow}
                            style={styles.arrowIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Map View */}
                    <View style={styles.mapContainer}>
                        <View style={styles.mapPlaceholder}>
                            <Typography
                                type={Font.GeneralSans_Regular}
                                size={16}
                                color="#999999"
                                textAlign="center">
                                Map View
                            </Typography>
                            <Typography
                                type={Font.GeneralSans_Regular}
                                size={14}
                                color="#CCCCCC"
                                textAlign="center"
                                style={styles.mapSubtext}>
                                Map integration can be added here
                            </Typography>
                        </View>
                    </View>
                </View>

                {/* Save Button */}
                <View style={styles.bottomContainer}>
                    <Button
                        title="SAVE"
                        onPress={handleSave}
                        style={styles.saveButton}
                        linerColor={[Colors.zyaraGreen, Colors.zyaraGreen]}
                        title_style={styles.buttonText}
                    />
                </View>
            </SafeAreaView>
        </>
    );
};

export default SelectLocation;

const styles = StyleSheet.create({
    backgroundGradient: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },

    container: {
        flex: 1,
        paddingHorizontal: 22,
    },

    searchInput: {
        height: 60,
        borderRadius: 12,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: 'rgba(0, 178, 114, 0.2)',
        shadowColor: '#E9E9E9',
        shadowOffset: {
            width: 15,
            height: 20,
        },
        shadowOpacity: 0.25,
        shadowRadius: 45,
        elevation: 5,
        marginTop: 5,
        marginBottom: 15,
    },

    locationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        shadowColor: '#E9E9E9',
        shadowOffset: {
            width: 15,
            height: 20,
        },
        shadowOpacity: 0.25,
        shadowRadius: 45,
        elevation: 5,
        minHeight: 80,
    },

    addAddressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        shadowColor: '#E9E9E9',
        shadowOffset: {
            width: 15,
            height: 20,
        },
        shadowOpacity: 0.25,
        shadowRadius: 45,
        elevation: 5,
        minHeight: 60,
    },

    locationIconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    locationPin: {
        width: 24,
        height: 32,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    pinDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.zyaraGreen,
        borderWidth: 2,
        borderColor: Colors.white,
    },

    pinBase: {
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 16,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: Colors.zyaraGreen,
        marginTop: -2,
    },

    locationContent: {
        flex: 1,
    },

    locationLabel: {
        fontSize: 18,
        marginBottom: 4,
    },

    locationAddress: {
        fontSize: 18,
    },

    addAddressText: {
        flex: 1,
        fontSize: 18,
    },

    arrowIcon: {
        width: 20,
        height: 20,
        tintColor: '#3E432F',
    },

    mapContainer: {
        flex: 1,
        marginTop: 10,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#DDDDDD',
    },

    mapPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },

    mapSubtext: {
        marginTop: 8,
    },

    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 22,
        paddingBottom: 20,
        paddingTop: 10,
        backgroundColor: 'transparent',
    },

    saveButton: {
        width: '100%',
        height: 60,
        borderRadius: 12,
    },

    buttonText: {
        fontSize: 18,
        textTransform: 'uppercase',
    },
});

