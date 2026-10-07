import React, { useCallback, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Shadow } from '../../Constants/Colors';
import Button from '../../Component/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../Component/ScreenHeader';
import Typography from '../../Component/UI/Typography';
import { Font } from '../../Constants/Font';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import SimpleToast from 'react-native-simple-toast';
import {
    getUserAddresses,
    setDefaultUserAddress,
    deleteUserAddress,
} from '../../Backend/BookingAPI';
import { formatAddress } from './SelectLocation';

const { width } = Dimensions.get('window');

const ManageAddress = () => {
    const navigation = useNavigation();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);

    const load = useCallback(() => {
        getUserAddresses(
            res => {
                setAddresses(res?.data || []);
                setLoading(false);
            },
            () => setLoading(false),
        );
    }, []);

    useFocusEffect(load);

    const handleSetDefault = id => {
        setBusyId(id);
        setDefaultUserAddress(
            id,
            () => {
                setBusyId(null);
                load();
            },
            err => {
                setBusyId(null);
                SimpleToast.show(err?.data?.message || 'Could not update address', SimpleToast.SHORT);
            },
        );
    };

    const handleDelete = address => {
        Alert.alert('Delete address', `Remove your ${address.label} address?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    setBusyId(address.id);
                    deleteUserAddress(
                        address.id,
                        () => {
                            setBusyId(null);
                            SimpleToast.show('Address deleted', SimpleToast.SHORT);
                            load();
                        },
                        err => {
                            setBusyId(null);
                            SimpleToast.show(err?.data?.message || 'Could not delete address', SimpleToast.SHORT);
                        },
                    );
                },
            },
        ]);
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
                <ScreenHeader title="Manage Address" showGreenLine={true} />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        {loading ? (
                            <ActivityIndicator color={Colors.zyaraGreen} style={{ marginTop: 40 }} />
                        ) : addresses.length === 0 ? (
                            <View style={styles.empty}>
                                <Typography size={16} type={Font.GeneralSans_Semibold} color={Colors.textPrimary}>
                                    No saved addresses
                                </Typography>
                                <Typography
                                    size={14}
                                    type={Font.GeneralSans_Regular}
                                    color={Colors.textSecondary}
                                    style={{ marginTop: 6, textAlign: 'center' }}>
                                    Add an address so beauticians know where to come.
                                </Typography>
                            </View>
                        ) : (
                            addresses.map(a => (
                                <View key={a.id} style={[styles.card, a.is_default && styles.cardDefault]}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.labelChip}>
                                            <Typography size={12} type={Font.GeneralSans_Semibold} color={Colors.brandDark}>
                                                {a.label}
                                            </Typography>
                                        </View>
                                        {a.is_default && (
                                            <Typography size={12} type={Font.GeneralSans_Semibold} color={Colors.zyaraGreen}>
                                                DEFAULT
                                            </Typography>
                                        )}
                                    </View>
                                    {!!a.name && (
                                        <Typography size={16} type={Font.GeneralSans_Semibold} color={Colors.textPrimary}>
                                            {a.name}
                                        </Typography>
                                    )}
                                    <Typography
                                        size={14}
                                        type={Font.GeneralSans_Regular}
                                        color={Colors.textSecondary}
                                        style={styles.addressText}>
                                        {formatAddress(a)}
                                    </Typography>
                                    {!!a.phone && (
                                        <Typography size={13} type={Font.GeneralSans_Regular} color={Colors.textMuted}>
                                            +91 {a.phone}
                                        </Typography>
                                    )}
                                    <View style={styles.actions}>
                                        {busyId === a.id ? (
                                            <ActivityIndicator size="small" color={Colors.zyaraGreen} />
                                        ) : (
                                            <>
                                                {!a.is_default && (
                                                    <TouchableOpacity onPress={() => handleSetDefault(a.id)} style={styles.actionBtn}>
                                                        <Typography size={14} type={Font.GeneralSans_Semibold} color={Colors.zyaraGreen}>
                                                            Set as default
                                                        </Typography>
                                                    </TouchableOpacity>
                                                )}
                                                <TouchableOpacity onPress={() => handleDelete(a)} style={styles.actionBtn}>
                                                    <Typography size={14} type={Font.GeneralSans_Semibold} color={Colors.danger}>
                                                        Delete
                                                    </Typography>
                                                </TouchableOpacity>
                                            </>
                                        )}
                                    </View>
                                </View>
                            ))
                        )}

                        <Button
                            title="+ ADD NEW ADDRESS"
                            onPress={() => navigation.navigate('AddNewAddress')}
                            style={styles.button}
                            linerColor={[Colors.zyaraGreen, Colors.zyaraGreen]}
                            title_style={styles.buttonText}
                        />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default ManageAddress;

const styles = StyleSheet.create({
    container: { flex: 1 },

    backgroundGradient: {
        position: 'absolute',
        width: width,
        height: '100%',
        top: 0,
        left: 0,
    },

    scrollContent: {
        paddingBottom: 40,
    },

    content: {
        paddingHorizontal: 22,
        paddingTop: 16,
    },

    empty: {
        alignItems: 'center',
        paddingVertical: 40,
    },

    card: {
        backgroundColor: Colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: 16,
        marginBottom: 12,
        ...Shadow.sm,
    },

    cardDefault: {
        borderColor: Colors.zyaraGreen,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    labelChip: {
        backgroundColor: Colors.brandSoft,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },

    addressText: {
        marginTop: 2,
        marginBottom: 2,
        lineHeight: 20,
    },

    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: Colors.divider,
        marginTop: 12,
        paddingTop: 10,
        gap: 20,
    },

    actionBtn: {
        paddingVertical: 2,
    },

    button: {
        width: width - 44,
        height: 55,
        marginTop: 12,
        borderRadius: 12,
        alignSelf: 'center',
    },

    buttonText: {
        fontSize: 18,
    },
});
