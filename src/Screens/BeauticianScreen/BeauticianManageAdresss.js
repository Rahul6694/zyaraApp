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
import Button from '../../Component/Button';
import { ImageConstant } from '../../Constants/ImageConstant';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../Component/ScreenHeader';
import DropdownNew from '../../Component/DropdownNew';

const { width } = Dimensions.get('window');

const BeauticianManageAdresss = () => {

    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    const [loading, setLoading] = useState(false);

    const stateList = [
        { label: "Haryana", value: "HR" },
        { label: "Punjab", value: "PB" },
        { label: "Delhi", value: "DL" },
        { label: "Rajasthan", value: "RJ" },
    ];

    const cityList = [
        { label: "Rohtak", value: "Rohtak" },
        { label: "Hisar", value: "Hisar" },
        { label: "Panipat", value: "Panipat" },
        { label: "Gurugram", value: "Gurugram" },
    ];

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
                            <DropdownNew
                                    MainBoxStyle={{ width: '100%', alignSelf:'center' }}
                                title="State"
                                data={stateList}
                                leftIconsShow
                                leftIcons={ImageConstant.location2}
                                value={selectedState}
                                placeholder="Select State"
                                onChange={(item) => setSelectedState(item.value)}
                            />

                            {/* City Dropdown */}
                            <DropdownNew
                                MainBoxStyle={{ width: '100%', alignSelf:'center' }}
                                title="City"
                                data={cityList}
                                leftIconsShow
                                leftIcons={ImageConstant.location2}
                                value={selectedCity}
                                placeholder="Select City"
                                onChange={(item) => setSelectedCity(item.value)}
                            />

                            {/* Address (Disabled Field) */}
                            <DropdownNew
                                     MainBoxStyle={{ width: '100%', alignSelf:'center' }}
                                title="Address"
                                disable
                                data={[]}
                                leftIconsShow
                                leftIcons={ImageConstant.location2}
                                value={null}
                                placeholder="Address (Auto-filled)"
                            />

                            {/* Save Button */}
                            <Button
                                title={loading ? 'SAVING...' : 'SAVE'}
                                onPress={() => console.log('Save Pressed')}
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
});
