import React, { useCallback, useState } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Modal,
    TextInput,
    Alert,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SimpleToast from 'react-native-simple-toast';
import moment from 'moment';
import { Colors, Shadow } from '../../Constants/Colors';
import { Font } from '../../Constants/Font';
import Typography from '../../Component/UI/Typography';
import Button from '../../Component/Button';
import { getMyBookings, cancelBooking, addBookingReview } from '../../Backend/BookingAPI';
import { getImageUrl, formatPrice } from '../../Utils/imageUrl';

const TABS = [
    { key: 'upcoming', label: 'Upcoming', status: 'pending,accepted,in_progress' },
    { key: 'past', label: 'Past', status: 'completed,cancelled,rejected' },
];

const STATUS_STYLE = {
    pending: { label: 'Awaiting confirmation', color: '#B7730C', bg: '#FEF5E6' },
    accepted: { label: 'Confirmed', color: Colors.brandDark, bg: Colors.brandSoft },
    in_progress: { label: 'In progress', color: '#029991', bg: '#E5F5F4' },
    completed: { label: 'Completed', color: Colors.brandDark, bg: Colors.brandSoft },
    cancelled: { label: 'Cancelled', color: Colors.danger, bg: Colors.dangerSoft },
    rejected: { label: 'Declined', color: Colors.danger, bg: Colors.dangerSoft },
};

const slotLabel = slot =>
    String(slot || '')
        .split('-')
        .map(t => moment(t, 'HH:mm').format('hh:mm a'))
        .join(' - ');

const MyBookings = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [tab, setTab] = useState(TABS[0]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [busyId, setBusyId] = useState(null);
    const [reviewFor, setReviewFor] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const load = useCallback((current = tab, onDone) => {
        getMyBookings(
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

    const handleCancel = booking => {
        Alert.alert('Cancel booking', `Cancel booking ${booking.booking_number}?`, [
            { text: 'Keep it', style: 'cancel' },
            {
                text: 'Cancel booking',
                style: 'destructive',
                onPress: () => {
                    setBusyId(booking.id);
                    cancelBooking(
                        booking.id,
                        'Cancelled by customer',
                        () => {
                            setBusyId(null);
                            SimpleToast.show('Booking cancelled', SimpleToast.SHORT);
                            load();
                        },
                        err => {
                            setBusyId(null);
                            SimpleToast.show(err?.data?.message || 'Could not cancel booking', SimpleToast.SHORT);
                        },
                    );
                },
            },
        ]);
    };

    const openReview = booking => {
        setRating(5);
        setComment('');
        setReviewFor(booking);
    };

    const submitReview = () => {
        setSubmittingReview(true);
        addBookingReview(
            reviewFor.id,
            { rating, comment: comment.trim() },
            () => {
                setSubmittingReview(false);
                setReviewFor(null);
                SimpleToast.show('Thanks for your review!', SimpleToast.SHORT);
                load();
            },
            err => {
                setSubmittingReview(false);
                SimpleToast.show(err?.data?.message || 'Could not submit review', SimpleToast.SHORT);
            },
        );
    };

    const renderBooking = ({ item }) => {
        const status = STATUS_STYLE[item.status] || STATUS_STYLE.pending;
        const photo = getImageUrl(item.beautician_profile_picture);
        const canCancel = ['pending', 'accepted'].includes(item.status);
        const canReview = item.status === 'completed' && !item.review;
        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                        <Typography size={16} type={Font.GeneralSans_Semibold} color={Colors.textPrimary}>
                            {moment(item.booking_date).format('ddd, D MMM YYYY')}
                        </Typography>
                        <Typography size={13} type={Font.GeneralSans_Regular} color={Colors.textSecondary}>
                            {slotLabel(item.time_slot)} · #{item.booking_number}
                        </Typography>
                    </View>
                    <View style={[styles.statusChip, { backgroundColor: status.bg }]}>
                        <Typography size={12} type={Font.GeneralSans_Semibold} color={status.color}>
                            {status.label}
                        </Typography>
                    </View>
                </View>

                <View style={styles.divider} />

                {(item.items || []).map(line => (
                    <View key={line.id} style={styles.itemRow}>
                        <Typography
                            size={14}
                            type={Font.GeneralSans_Regular}
                            color={Colors.textPrimary}
                            numberOfLines={1}
                            style={{ flex: 1 }}>
                            {line.name}{line.quantity > 1 ? ` × ${line.quantity}` : ''}
                        </Typography>
                        <Typography size={14} type={Font.GeneralSans_Medium} color={Colors.textPrimary}>
                            {formatPrice(Number(line.price) * line.quantity)}
                        </Typography>
                    </View>
                ))}

                <View style={styles.beauticianRow}>
                    {photo ? (
                        <Image source={{ uri: photo }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <Typography size={14} type={Font.GeneralSans_Semibold} color={Colors.brand}>
                                {(item.beautician_name || 'Z').charAt(0)}
                            </Typography>
                        </View>
                    )}
                    <Typography
                        size={14}
                        type={Font.GeneralSans_Medium}
                        color={Colors.textSecondary}
                        style={{ flex: 1 }}>
                        {item.beautician_name || 'Beautician will be assigned soon'}
                    </Typography>
                    <Typography size={16} type={Font.GeneralSans_Semibold} color={Colors.textPrimary}>
                        {formatPrice(item.total_amount)}
                    </Typography>
                </View>

                {!!item.cancel_reason && ['cancelled', 'rejected'].includes(item.status) && (
                    <Typography size={13} type={Font.GeneralSans_Regular} color={Colors.textMuted} style={{ marginTop: 6 }}>
                        Reason: {item.cancel_reason}
                    </Typography>
                )}

                {item.review && (
                    <Typography size={13} type={Font.GeneralSans_Regular} color={Colors.textSecondary} style={{ marginTop: 8 }}>
                        Your rating: {'★'.repeat(item.review.rating)}{'☆'.repeat(5 - item.review.rating)}
                    </Typography>
                )}

                {(canCancel || canReview) && (
                    <View style={styles.actions}>
                        {busyId === item.id ? (
                            <ActivityIndicator size="small" color={Colors.brand} />
                        ) : canCancel ? (
                            <TouchableOpacity onPress={() => handleCancel(item)}>
                                <Typography size={14} type={Font.GeneralSans_Semibold} color={Colors.danger}>
                                    Cancel booking
                                </Typography>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => openReview(item)}>
                                <Typography size={14} type={Font.GeneralSans_Semibold} color={Colors.brand}>
                                    Rate your experience
                                </Typography>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <LinearGradient
                colors={[Colors.lightGreen, Colors.background]}
                style={styles.topGradient}
            />
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
                                {tab.key === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
                            </Typography>
                            <Typography
                                size={14}
                                type={Font.GeneralSans_Regular}
                                color={Colors.textSecondary}
                                style={styles.emptyText}>
                                Book a beauty service and it will show up here.
                            </Typography>
                            {tab.key === 'upcoming' && (
                                <Button
                                    title="Book a service"
                                    onPress={() => navigation.navigate('Categories')}
                                    style={styles.emptyButton}
                                />
                            )}
                        </View>
                    }
                />
            )}

            {/* Review modal */}
            <Modal visible={!!reviewFor} transparent animationType="fade" onRequestClose={() => setReviewFor(null)}>
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        <Typography size={18} type={Font.GeneralSans_Semibold} color={Colors.textPrimary}>
                            Rate your experience
                        </Typography>
                        <Typography size={14} type={Font.GeneralSans_Regular} color={Colors.textSecondary} style={{ marginTop: 4 }}>
                            {reviewFor?.beautician_name}
                        </Typography>
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map(n => (
                                <TouchableOpacity key={n} onPress={() => setRating(n)} hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}>
                                    <Typography size={34} color={n <= rating ? Colors.star : Colors.border}>
                                        ★
                                    </Typography>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TextInput
                            value={comment}
                            onChangeText={setComment}
                            placeholder="Tell us about your experience (optional)"
                            placeholderTextColor={Colors.textMuted}
                            multiline
                            style={styles.commentInput}
                        />
                        <Button title="Submit review" onPress={submitReview} loader={submittingReview} style={styles.modalButton} />
                        <TouchableOpacity onPress={() => setReviewFor(null)} style={styles.modalCancel}>
                            <Typography size={14} type={Font.GeneralSans_Medium} color={Colors.textSecondary}>
                                Not now
                            </Typography>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default MyBookings;

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
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 10,
    },
    beauticianRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 10,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    avatarPlaceholder: {
        backgroundColor: Colors.brandSoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actions: {
        borderTopWidth: 1,
        borderTopColor: Colors.divider,
        marginTop: 12,
        paddingTop: 12,
        alignItems: 'flex-end',
    },
    empty: {
        alignItems: 'center',
        paddingTop: 70,
        paddingHorizontal: 20,
    },
    emptyText: {
        marginTop: 6,
        marginBottom: 18,
        textAlign: 'center',
    },
    emptyButton: {
        paddingHorizontal: 30,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(20,24,31,0.45)',
        justifyContent: 'center',
        padding: 24,
    },
    modalCard: {
        backgroundColor: Colors.white,
        borderRadius: 18,
        padding: 20,
    },
    starsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginVertical: 14,
    },
    commentInput: {
        minHeight: 90,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        padding: 12,
        textAlignVertical: 'top',
        fontFamily: Font.GeneralSans_Regular,
        color: Colors.textPrimary,
        marginBottom: 14,
    },
    modalButton: {
        width: '100%',
    },
    modalCancel: {
        alignItems: 'center',
        paddingTop: 12,
    },
});
