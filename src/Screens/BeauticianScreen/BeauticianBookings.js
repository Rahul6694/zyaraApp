import React, { useCallback, useState } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
    Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SimpleToast from 'react-native-simple-toast';
import moment from 'moment';
import { Colors, Shadow } from '../../Constants/Colors';
import { Font } from '../../Constants/Font';
import Typography from '../../Component/UI/Typography';
import { getBeauticianBookings, updateBeauticianBookingStatus } from '../../Backend/BookingAPI';
import { formatPrice } from '../../Utils/imageUrl';

const TABS = [
    { key: 'requests', label: 'Requests', status: 'pending' },
    { key: 'upcoming', label: 'Upcoming', status: 'accepted,in_progress' },
    { key: 'past', label: 'Past', status: 'completed,cancelled,rejected' },
];

const STATUS_STYLE = {
    pending: { label: 'New request', color: '#B7730C', bg: '#FEF5E6' },
    accepted: { label: 'Accepted', color: Colors.brandDark, bg: Colors.brandSoft },
    in_progress: { label: 'In progress', color: '#029991', bg: '#E5F5F4' },
    completed: { label: 'Completed', color: Colors.brandDark, bg: Colors.brandSoft },
    cancelled: { label: 'Cancelled', color: Colors.danger, bg: Colors.dangerSoft },
    rejected: { label: 'Declined', color: Colors.danger, bg: Colors.dangerSoft },
};

// Next actions a beautician can take from each status
const ACTIONS = {
    pending: [
        { status: 'rejected', label: 'Decline', tone: 'danger', confirm: 'Decline this booking request?' },
        { status: 'accepted', label: 'Accept', tone: 'primary' },
    ],
    accepted: [
        { status: 'cancelled', label: 'Cancel', tone: 'danger', confirm: 'Cancel this accepted booking? The customer will be notified.' },
        { status: 'in_progress', label: 'Start service', tone: 'primary' },
    ],
    in_progress: [{ status: 'completed', label: 'Mark completed', tone: 'primary', confirm: 'Mark this service as completed?' }],
};

const slotLabel = slot =>
    String(slot || '')
        .split('-')
        .map(t => moment(t, 'HH:mm').format('hh:mm a'))
        .join(' - ');

const formatAddress = a =>
    [a?.house_no, a?.road_name, a?.address, a?.landmark, a?.city, a?.state, a?.pincode].filter(Boolean).join(', ');

const BeauticianBookings = () => {
    const insets = useSafeAreaInsets();
    const [tab, setTab] = useState(TABS[0]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [busyId, setBusyId] = useState(null);

    const load = useCallback((current = tab, onDone) => {
        getBeauticianBookings(
            current.status,
            1,
            res => {
                setBookings(res?.data || []);
                setLoading(false);
                onDone && onDone();
            },
            () => {
                setLoading(false);
                onDone && onDone();
            },
        );
    }, [tab]);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    const switchTab = next => {
        setTab(next);
        setLoading(true);
        load(next);
    };

    const runAction = (booking, action) => {
        const execute = () => {
            setBusyId(booking.id);
            updateBeauticianBookingStatus(
                booking.id,
                action.status,
                undefined,
                res => {
                    setBusyId(null);
                    SimpleToast.show(res?.message || 'Booking updated', SimpleToast.SHORT);
                    load();
                },
                err => {
                    setBusyId(null);
                    SimpleToast.show(err?.data?.message || 'Could not update booking', SimpleToast.SHORT);
                },
            );
        };
        if (action.confirm) {
            Alert.alert(action.label, action.confirm, [
                { text: 'No', style: 'cancel' },
                { text: 'Yes', style: action.tone === 'danger' ? 'destructive' : 'default', onPress: execute },
            ]);
        } else {
            execute();
        }
    };

    const renderBooking = ({ item }) => {
        const status = STATUS_STYLE[item.status] || STATUS_STYLE.pending;
        const actions = ACTIONS[item.status] || [];
        const address = formatAddress(item.address_snapshot);
        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                        <Typography size={16} type={Font.GeneralSans_Semibold} color={Colors.textPrimary}>
                            {moment(item.booking_date).format('ddd, D MMM')} · {slotLabel(item.time_slot)}
                        </Typography>
                        <Typography size={13} type={Font.GeneralSans_Regular} color={Colors.textSecondary}>
                            #{item.booking_number} · {item.number_of_people} {item.number_of_people > 1 ? 'people' : 'person'}
                        </Typography>
                    </View>
                    <View style={[styles.statusChip, { backgroundColor: status.bg }]}>
                        <Typography size={12} type={Font.GeneralSans_Semibold} color={status.color}>
                            {status.label}
                        </Typography>
                    </View>
                </View>

                <View style={styles.divider} />

                <Typography size={15} type={Font.GeneralSans_Semibold} color={Colors.textPrimary}>
                    {item.contact_name || item.user_name}
                </Typography>
                {!!address && (
                    <Typography size={13} type={Font.GeneralSans_Regular} color={Colors.textSecondary} style={styles.address}>
                        {address}
                    </Typography>
                )}
                {!!item.contact_phone && ['accepted', 'in_progress'].includes(item.status) && (
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.contact_phone}`)}>
                        <Typography size={13} type={Font.GeneralSans_Semibold} color={Colors.brand}>
                            Call +91 {item.contact_phone}
                        </Typography>
                    </TouchableOpacity>
                )}

                <View style={styles.items}>
                    {(item.items || []).map(line => (
                        <View key={line.id} style={styles.itemRow}>
                            <Typography size={14} type={Font.GeneralSans_Regular} color={Colors.textPrimary} style={{ flex: 1 }} numberOfLines={1}>
                                {line.name}{line.quantity > 1 ? ` × ${line.quantity}` : ''}
                            </Typography>
                            <Typography size={14} type={Font.GeneralSans_Medium} color={Colors.textPrimary}>
                                {formatPrice(Number(line.price) * line.quantity)}
                            </Typography>
                        </View>
                    ))}
                </View>

                {!!item.special_instructions && (
                    <View style={styles.note}>
                        <Typography size={13} type={Font.GeneralSans_Regular} color={Colors.textSecondary}>
                            Note: {item.special_instructions}
                        </Typography>
                    </View>
                )}

                <View style={styles.footer}>
                    <Typography size={13} type={Font.GeneralSans_Regular} color={Colors.textSecondary}>
                        {item.status === 'completed' ? 'You earned' : 'Customer pays'}
                    </Typography>
                    <Typography size={17} type={Font.GeneralSans_Semibold} color={Colors.textPrimary}>
                        {formatPrice(item.status === 'completed' ? item.beautician_earning : item.total_amount)}
                    </Typography>
                </View>

                {actions.length > 0 && (
                    <View style={styles.actions}>
                        {busyId === item.id ? (
                            <ActivityIndicator color={Colors.brand} />
                        ) : (
                            actions.map(action => (
                                <TouchableOpacity
                                    key={action.status}
                                    onPress={() => runAction(item, action)}
                                    style={[styles.actionBtn, action.tone === 'primary' ? styles.actionPrimary : styles.actionDanger]}>
                                    <Typography
                                        size={14}
                                        type={Font.GeneralSans_Semibold}
                                        color={action.tone === 'primary' ? Colors.white : Colors.danger}>
                                        {action.label}
                                    </Typography>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <LinearGradient colors={[Colors.lightGreen, Colors.background]} style={styles.topGradient} />
            <Typography size={24} type={Font.GeneralSans_Bold} color={Colors.textPrimary} style={styles.title}>
                My Bookings
            </Typography>

            <View style={styles.tabs}>
                {TABS.map(t => (
                    <TouchableOpacity
                        key={t.key}
                        onPress={() => switchTab(t)}
                        style={[styles.tab, tab.key === t.key && styles.tabActive]}>
                        <Typography
                            size={14}
                            type={Font.GeneralSans_Semibold}
                            color={tab.key === t.key ? Colors.white : Colors.textSecondary}>
                            {t.label}
                        </Typography>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <ActivityIndicator color={Colors.brand} size="large" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={bookings}
                    keyExtractor={item => String(item.id)}
                    renderItem={renderBooking}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            colors={[Colors.brand]}
                            onRefresh={() => {
                                setRefreshing(true);
                                load(tab, () => setRefreshing(false));
                            }}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Typography size={17} type={Font.GeneralSans_Semibold} color={Colors.textPrimary}>
                                {tab.key === 'requests' ? 'No new requests' : tab.key === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
                            </Typography>
                            <Typography size={14} type={Font.GeneralSans_Regular} color={Colors.textSecondary} style={styles.emptyText}>
                                Stay online to receive booking requests from customers.
                            </Typography>
                        </View>
                    }
                />
            )}
        </View>
    );
};

export default BeauticianBookings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    topGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 220,
    },
    title: {
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 14,
    },
    tabs: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 12,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 9,
    },
    tabActive: {
        backgroundColor: Colors.brand,
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        flexGrow: 1,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        ...Shadow.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    statusChip: {
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginLeft: 8,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.divider,
        marginVertical: 12,
    },
    address: {
        marginTop: 2,
        marginBottom: 4,
        lineHeight: 19,
    },
    items: {
        marginTop: 10,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 10,
    },
    note: {
        backgroundColor: Colors.brandTint,
        borderRadius: 10,
        padding: 10,
        marginTop: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: Colors.divider,
        marginTop: 12,
        paddingTop: 12,
    },
    actionBtn: {
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 9,
    },
    actionPrimary: {
        backgroundColor: Colors.brand,
    },
    actionDanger: {
        backgroundColor: Colors.dangerSoft,
    },
    empty: {
        alignItems: 'center',
        paddingTop: 70,
        paddingHorizontal: 20,
    },
    emptyText: {
        marginTop: 6,
        textAlign: 'center',
    },
});
