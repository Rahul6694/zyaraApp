import React, { useCallback, useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    ActivityIndicator,
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
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import SimpleToast from 'react-native-simple-toast';
import { getUserAddresses, setDefaultUserAddress } from '../../Backend/BookingAPI';

const { width, height } = Dimensions.get('window');

export const formatAddress = a =>
    [a?.house_no, a?.road_name, a?.address, a?.landmark, a?.city, a?.state, a?.pincode].filter(Boolean).join(', ');

const SelectLocation = () => {
    const navigation = useNavigation();
    const route = useRoute();
    // When opened from Home, saving just returns there; in the booking flow it continues to the cart
    const returnTo = route?.params?.returnTo;
    const [searchQuery, setSearchQuery] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Reload after returning from Add New Address
    useFocusEffect(
        useCallback(() => {
            getUserAddresses(
                res => {
                    const list = res?.data || [];
                    setAddresses(list);
                    setSelectedId(prev => prev || (list.find(a => a.is_default) || list[0])?.id || null);
                    setLoading(false);
                },
                () => setLoading(false),
            );
        }, []),
    );

    const filtered = addresses.filter(a =>
        `${a.label} ${a.name || ''} ${formatAddress(a)}`.toLowerCase().includes(searchQuery.trim().toLowerCase()),
    );

    const handleAddAddress = () => {
        navigation.navigate('AddNewAddress');
    };

    const handleSave = () => {
        if (!selectedId) {
            SimpleToast.show('Please add an address to continue', SimpleToast.SHORT);
            return;
        }
        setSaving(true);
        setDefaultUserAddress(
            selectedId,
            () => {
                setSaving(false);
                if (returnTo === 'back') {
                    navigation.goBack();
                } else {
                    navigation.navigate('AddToCart');
                }
            },
            err => {
                setSaving(false);
                SimpleToast.show(err?.data?.message || 'Could not select address', SimpleToast.SHORT);
            },
        );
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
                        placeholder="search saved addresses"
                        style_inputContainer={styles.searchInput}
                        placeholderTextColor="#656565"
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />

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

                    {/* Saved addresses */}
                    <Typography
                        type={Font.GeneralSans_Semibold}
                        size={16}
                        color={Colors.textPrimary}
                        style={styles.savedTitle}>
                        Saved Addresses
                    </Typography>
                    {loading ? (
                        <ActivityIndicator color={Colors.zyaraGreen} style={{ marginTop: 30 }} />
                    ) : (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 110 }}>
                            {filtered.length === 0 && (
                                <Typography
                                    type={Font.GeneralSans_Regular}
                                    size={15}
                                    color={Colors.textSecondary}
                                    style={styles.emptyText}>
                                    {addresses.length ? 'No address matches your search.' : 'No saved addresses yet. Add one to continue.'}
                                </Typography>
                            )}
                            {filtered.map(a => {
                                const selected = a.id === selectedId;
                                return (
                                    <TouchableOpacity
                                        key={a.id}
                                        activeOpacity={0.8}
                                        onPress={() => setSelectedId(a.id)}
                                        style={[styles.locationCard, selected && styles.locationCardSelected]}>
                                        <View style={[styles.radio, selected && styles.radioSelected]}>
                                            {selected && <View style={styles.radioDot} />}
                                        </View>
                                        <View style={styles.locationContent}>
                                            <Typography
                                                type={Font.GeneralSans_Semibold}
                                                size={16}
                                                color={Colors.textPrimary}
                                                style={styles.locationLabel}>
                                                {a.label}{a.name ? ` · ${a.name}` : ''}
                                            </Typography>
                                            <Typography
                                                type={Font.GeneralSans_Regular}
                                                size={14}
                                                color={Colors.textSecondary}
                                                numberOfLines={2}>
                                                {formatAddress(a)}
                                            </Typography>
                                            {!!a.phone && (
                                                <Typography
                                                    type={Font.GeneralSans_Regular}
                                                    size={13}
                                                    color={Colors.textMuted}
                                                    style={{ marginTop: 2 }}>
                                                    +91 {a.phone}
                                                </Typography>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    )}
                </View>

                {/* Save Button */}
                <View style={styles.bottomContainer}>
                    <Button
                        title="SAVE"
                        onPress={handleSave}
                        loader={saving}
                        disabled={!selectedId}
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
        marginBottom: 4,
    },

    locationCardSelected: {
        borderColor: Colors.zyaraGreen,
        backgroundColor: Colors.brandTint,
    },

    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: Colors.greyBorder,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },

    radioSelected: {
        borderColor: Colors.zyaraGreen,
    },

    radioDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.zyaraGreen,
    },

    savedTitle: {
        marginTop: 6,
        marginBottom: 10,
    },

    emptyText: {
        textAlign: 'center',
        marginTop: 24,
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

