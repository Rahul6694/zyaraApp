import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SimpleToast from 'react-native-simple-toast';
import moment from 'moment';
import { Colors, Shadow } from '../../Constants/Colors';
import { Font } from '../../Constants/Font';
import ScreenHeader from '../../Component/ScreenHeader';
import Typography from '../../Component/UI/Typography';
import Input from '../../Component/Input';
import Button from '../../Component/Button';
import { createSupportTicket, getMySupportTickets, getAppConfig } from '../../Backend/BookingAPI';

const STATUS_COLORS = {
    open: '#B7730C',
    in_progress: '#029991',
    resolved: Colors.brandDark,
    closed: Colors.textMuted,
};

const HelpSupport = () => {
    const navigation = useNavigation();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [sending, setSending] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [contact, setContact] = useState({});

    const loadTickets = useCallback(() => {
        getMySupportTickets(res => setTickets(res?.data || []), () => {});
    }, []);

    useFocusEffect(loadTickets);

    useEffect(() => {
        getAppConfig(res => setContact(res?.data || {}), () => {});
    }, []);

    const handleSend = () => {
        const nextErrors = {};
        if (!subject.trim()) nextErrors.subject = 'Please add a subject';
        if (message.trim().length < 10) nextErrors.message = 'Please describe the issue (at least 10 characters)';
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) {
            return;
        }
        setSending(true);
        createSupportTicket(
            { subject: subject.trim(), message: message.trim() },
            res => {
                setSending(false);
                setSubject('');
                setMessage('');
                SimpleToast.show(res?.message || 'Request submitted', SimpleToast.LONG);
                loadTickets();
            },
            err => {
                setSending(false);
                SimpleToast.show(err?.data?.message || 'Could not submit your request', SimpleToast.SHORT);
            },
        );
    };

    return (
        <LinearGradient colors={['#EFFFF4', '#FFFFFF']} style={styles.flex}>
            <SafeAreaView style={styles.flex}>
                <ScreenHeader title="Help & Support" showGreenLine={true} />
                <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                        {/* Quick links */}
                        <TouchableOpacity
                            style={styles.linkCard}
                            onPress={() => navigation.navigate('CMSScreen', { slug: 'help-support-general' })}>
                            <Typography size={16} type={Font.GeneralSans_Semibold} color={Colors.textPrimary}>
                                FAQs
                            </Typography>
                            <Typography size={13} type={Font.GeneralSans_Regular} color={Colors.textSecondary}>
                                Answers to common questions
                            </Typography>
                        </TouchableOpacity>

                        {(!!contact.support_email || !!contact.support_phone) && (
                            <View style={styles.contactRow}>
                                {!!contact.support_email && (
                                    <TouchableOpacity
                                        style={[styles.linkCard, styles.contactCard]}
                                        onPress={() => Linking.openURL(`mailto:${contact.support_email}`)}>
                                        <Typography size={14} type={Font.GeneralSans_Semibold} color={Colors.brandDark}>
                                            Email us
                                        </Typography>
                                        <Typography size={12} type={Font.GeneralSans_Regular} color={Colors.textSecondary} numberOfLines={1}>
                                            {contact.support_email}
                                        </Typography>
                                    </TouchableOpacity>
                                )}
                                {!!contact.support_phone && (
                                    <TouchableOpacity
                                        style={[styles.linkCard, styles.contactCard]}
                                        onPress={() => Linking.openURL(`tel:${contact.support_phone}`)}>
                                        <Typography size={14} type={Font.GeneralSans_Semibold} color={Colors.brandDark}>
                                            Call us
                                        </Typography>
                                        <Typography size={12} type={Font.GeneralSans_Regular} color={Colors.textSecondary}>
                                            {contact.support_phone}
                                        </Typography>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        {/* New request */}
                        <Typography size={18} type={Font.GeneralSans_Semibold} color={Colors.textPrimary} style={styles.sectionTitle}>
                            Send us a message
                        </Typography>
                        <Input
                            title="Subject"
                            placeholder="e.g. Issue with my booking"
                            value={subject}
                            onChange={setSubject}
                            error={errors.subject}
                            showTitle={true}
                        />
                        <Input
                            title="Message"
                            placeholder="Tell us what happened"
                            value={message}
                            onChange={setMessage}
                            error={errors.message}
                            multiline={true}
                            numberOfLines={5}
                            style_inputContainer={styles.messageBox}
                            showTitle={true}
                        />
                        <Button title="Submit" onPress={handleSend} loader={sending} style={styles.button} />

                        {/* Previous requests */}
                        {tickets.length > 0 && (
                            <>
                                <Typography size={18} type={Font.GeneralSans_Semibold} color={Colors.textPrimary} style={styles.sectionTitle}>
                                    Your requests
                                </Typography>
                                {tickets.map(t => (
                                    <View key={t.id} style={styles.ticket}>
                                        <View style={styles.ticketHeader}>
                                            <Typography
                                                size={15}
                                                type={Font.GeneralSans_Semibold}
                                                color={Colors.textPrimary}
                                                style={styles.flex}
                                                numberOfLines={1}>
                                                {t.subject}
                                            </Typography>
                                            <Typography size={12} type={Font.GeneralSans_Semibold} color={STATUS_COLORS[t.status]}>
                                                {t.status.replace('_', ' ').toUpperCase()}
                                            </Typography>
                                        </View>
                                        <Typography size={13} type={Font.GeneralSans_Regular} color={Colors.textSecondary}>
                                            {moment(t.created_at).format('D MMM YYYY, h:mm a')}
                                        </Typography>
                                        <Typography size={14} type={Font.GeneralSans_Regular} color={Colors.textPrimary} style={styles.ticketMessage}>
                                            {t.message}
                                        </Typography>
                                        {!!t.admin_reply && (
                                            <View style={styles.reply}>
                                                <Typography size={12} type={Font.GeneralSans_Semibold} color={Colors.brandDark}>
                                                    Zyara Support
                                                </Typography>
                                                <Typography size={14} type={Font.GeneralSans_Regular} color={Colors.textPrimary}>
                                                    {t.admin_reply}
                                                </Typography>
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default HelpSupport;

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 22,
        paddingTop: 16,
        paddingBottom: 40,
    },
    linkCard: {
        backgroundColor: Colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: 14,
        marginBottom: 10,
        ...Shadow.sm,
    },
    contactRow: {
        flexDirection: 'row',
        gap: 10,
    },
    contactCard: {
        flex: 1,
    },
    sectionTitle: {
        marginTop: 16,
        marginBottom: 4,
    },
    messageBox: {
        height: 120,
        alignItems: 'flex-start',
    },
    button: {
        marginTop: 8,
    },
    ticket: {
        backgroundColor: Colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: 14,
        marginTop: 10,
    },
    ticketHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 2,
    },
    ticketMessage: {
        marginTop: 8,
    },
    reply: {
        marginTop: 10,
        backgroundColor: Colors.brandTint,
        borderRadius: 10,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: Colors.brand,
    },
});
