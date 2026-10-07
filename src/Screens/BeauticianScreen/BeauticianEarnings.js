import React, { useCallback, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
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
import { getBeauticianEarnings, requestBeauticianPayout } from '../../Backend/BookingAPI';
import { formatPrice } from '../../Utils/imageUrl';

const PAYOUT_STYLE = {
    pending: { label: 'Processing', color: '#B7730C' },
    paid: { label: 'Paid', color: Colors.brandDark },
    rejected: { label: 'Rejected', color: Colors.danger },
};

const BeauticianEarnings = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [requesting, setRequesting] = useState(false);
    const [section, setSection] = useState('jobs');

    const load = useCallback(onDone => {
        getBeauticianEarnings(
            res => {
                setData(res?.data || null);
                setLoading(false);
                onDone && onDone();
            },
            () => {
                setLoading(false);
                onDone && onDone();
            },
        );
    }, []);

    useFocusEffect(useCallback(() => { load(); }, [load]));

    const balance = Number(data?.available_balance || 0);
    const minimum = Number(data?.min_payout_amount || 0);

    const handleWithdraw = () => {
        if (!data?.has_bank_details) {
            Alert.alert('Add bank details', 'Please add your bank account before withdrawing.', [
                { text: 'Later', style: 'cancel' },
                { text: 'Add now', onPress: () => navigation.navigate('BankVerification') },
            ]);
            return;
        }
        Alert.alert('Withdraw earnings', `Request ${formatPrice(balance)} to your bank account?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Withdraw',
                onPress: () => {
                    setRequesting(true);
                    requestBeauticianPayout(
                        null,
                        res => {
                            setRequesting(false);
                            SimpleToast.show(res?.message || 'Withdrawal requested', SimpleToast.SHORT);
                            load();
                        },
                        err => {
                            setRequesting(false);
                            SimpleToast.show(err?.data?.message || 'Could not request withdrawal', SimpleToast.LONG);
                        },
                    );
                },
            },
        ]);
    };

    const stat = (label, value) => (
        <View style={styles.stat}>
            <Typography size={12} type={Font.GeneralSans_Medium} color={Colors.textSecondary}>
                {label}
            </Typography>
            <Typography size={17} type={Font.GeneralSans_Semibold} color={Colors.textPrimary} style={{ marginTop: 2 }}>
                {value}
            </Typography>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <LinearGradient colors={[Colors.lightGreen, Colors.background]} style={styles.topGradient} />
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        colors={[Colors.brand]}
                        onRefresh={() => {
                            setRefreshing(true);
                            load(() => setRefreshing(false));
                        }}
                    />
                }>
                <Typography size={24} type={Font.GeneralSans_Bold} color={Colors.textPrimary} style={styles.title}>
                    Earnings
                </Typography>

                {loading ? (
                    <ActivityIndicator color={Colors.brand} size="large" style={{ marginTop: 50 }} />
                ) : (
                    <>
                        <LinearGradient colors={['#00B272', '#00925D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}>
                            <Typography size={14} type={Font.GeneralSans_Medium} color="rgba(255,255,255,0.85)">
                                Available balance
                            </Typography>
                            <Typography size={34} type={Font.GeneralSans_Bold} color={Colors.white} style={{ marginVertical: 4 }}>
                                {formatPrice(balance)}
                            </Typography>
                            <Typography size={12} type={Font.GeneralSans_Regular} color="rgba(255,255,255,0.85)">
                                {minimum > 0 ? `Minimum withdrawal ${formatPrice(minimum)}` : 'Withdraw any time'}
                            </Typography>
                            <Button
                                title="Withdraw earnings"
                                onPress={handleWithdraw}
                                loader={requesting}
                                disabled={balance <= 0 || balance < minimum}
                                linerColor={[Colors.white, Colors.white]}
                                title_style={{ color: Colors.brandDark }}
                                style={styles.withdrawButton}
                            />
                        </LinearGradient>

                        <View style={styles.statsRow}>
                            {stat('Total earned', formatPrice(data?.total_earnings || 0))}
                            {stat('Withdrawn', formatPrice(data?.withdrawn || 0))}
                            {stat('Processing', formatPrice(data?.pending_withdrawal || 0))}
                        </View>

                        <View style={styles.tabs}>
                            {[
                                { key: 'jobs', label: 'Completed jobs' },
                                { key: 'payouts', label: 'Withdrawals' },
                            ].map(t => (
                                <TouchableOpacity
                                    key={t.key}
                                    onPress={() => setSection(t.key)}
                                    style={[styles.tab, section === t.key && styles.tabActive]}>
                                    <Typography
                                        size={14}
                                        type={Font.GeneralSans_Semibold}
                                        color={section === t.key ? Colors.white : Colors.textSecondary}>
                                        {t.label}
                                    </Typography>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {section === 'jobs' &&
                            ((data?.completed_jobs || []).length ? (
                                data.completed_jobs.map(job => (
                                    <View key={job.id} style={styles.row}>
                                        <View style={{ flex: 1 }}>
                                            <Typography size={15} type={Font.GeneralSans_Semibold} color={Colors.textPrimary}>
                                                {job.customer_name || 'Customer'}
                                            </Typography>
                                            <Typography size={12} type={Font.GeneralSans_Regular} color={Colors.textSecondary}>
                                                {moment(job.booking_date).format('D MMM YYYY')} · #{job.booking_number}
                                            </Typography>
                                        </View>
                                        <Typography size={15} type={Font.GeneralSans_Semibold} color={Colors.brandDark}>
                                            +{formatPrice(job.beautician_earning)}
                                        </Typography>
                                    </View>
                                ))
                            ) : (
                                <Typography size={14} type={Font.GeneralSans_Regular} color={Colors.textSecondary} style={styles.empty}>
                                    Completed bookings and what you earned from them will appear here.
                                </Typography>
                            ))}

                        {section === 'payouts' &&
                            ((data?.payouts || []).length ? (
                                data.payouts.map(p => {
                                    const st = PAYOUT_STYLE[p.status] || PAYOUT_STYLE.pending;
                                    return (
                                        <View key={p.id} style={styles.row}>
                                            <View style={{ flex: 1 }}>
                                                <Typography size={15} type={Font.GeneralSans_Semibold} color={Colors.textPrimary}>
                                                    {formatPrice(p.amount)}
                                                </Typography>
                                                <Typography size={12} type={Font.GeneralSans_Regular} color={Colors.textSecondary}>
                                                    Requested {moment(p.created_at).format('D MMM YYYY')}
                                                    {p.admin_note ? ` · ${p.admin_note}` : ''}
                                                </Typography>
                                            </View>
                                            <Typography size={13} type={Font.GeneralSans_Semibold} color={st.color}>
                                                {st.label}
                                            </Typography>
                                        </View>
                                    );
                                })
                            ) : (
                                <Typography size={14} type={Font.GeneralSans_Regular} color={Colors.textSecondary} style={styles.empty}>
                                    You have not requested any withdrawals yet.
                                </Typography>
                            ))}
                    </>
                )}
            </ScrollView>
        </View>
    );
};

export default BeauticianEarnings;

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
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    title: {
        paddingTop: 14,
        paddingBottom: 14,
    },
    balanceCard: {
        borderRadius: 20,
        padding: 20,
        ...Shadow.md,
    },
    withdrawButton: {
        marginTop: 16,
        height: 48,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 14,
    },
    stat: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: 12,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
        borderColor: Colors.border,
        marginTop: 18,
        marginBottom: 8,
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: 14,
        marginTop: 8,
        gap: 10,
    },
    empty: {
        textAlign: 'center',
        marginTop: 24,
        paddingHorizontal: 20,
    },
});
