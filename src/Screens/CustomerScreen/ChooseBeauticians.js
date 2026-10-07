import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    Modal,
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
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import { getAvailableBeauticians, getBeauticianPublicProfile } from '../../Backend/BookingAPI';
import { getImageUrl, formatPrice } from '../../Utils/imageUrl';
import GalleryViewer from '../../Component/Modals/GalleryViewer';

const { width } = Dimensions.get('window');

const ratingLabel = b =>
    Number(b.rating) > 0
        ? `⭐ ${Number(b.rating).toFixed(1)}${Number(b.total_reviews) > 0 ? ` (${b.total_reviews})` : ''}`
        : 'New';

const locationLabel = b => [b.city, b.state].filter(Boolean).join(', ');

const ChooseBeauticians = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route?.params || {};
    // Opened from Slot Booking with a date + slot: this step picks who will do the booking
    const isBooking = !!(params.bookingDate && params.timeSlot);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBeautician, setSelectedBeautician] = useState(params.beauticianId || null);
    const [beauticians, setBeauticians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailsFor, setDetailsFor] = useState(null);
    const [details, setDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(null);

    const openDetails = useCallback((beautician) => {
        setDetailsFor(beautician);
        setDetails(null);
        setDetailsLoading(true);
        getBeauticianPublicProfile(
            beautician.id,
            res => {
                setDetails(res?.data || null);
                setDetailsLoading(false);
            },
            err => {
                console.log('Beautician profile error:', err);
                setDetailsLoading(false);
            },
        );
    }, []);

    const closeDetails = () => {
        setViewerIndex(null);
        setDetailsFor(null);
    };

    useEffect(() => {
        getAvailableBeauticians(
            isBooking ? { date: params.bookingDate, time_slot: params.timeSlot } : {},
            res => {
                setBeauticians(res?.data || []);
                setLoading(false);
            },
            err => {
                console.log('Beauticians error:', err);
                setLoading(false);
            },
        );
    }, [isBooking, params.bookingDate, params.timeSlot]);

    const matches = useCallback(
        b => `${b.name || ''} ${b.business_name || ''} ${b.city || ''}`.toLowerCase().includes(searchQuery.trim().toLowerCase()),
        [searchQuery],
    );
    const filteredRecommended = useMemo(() => beauticians.filter(b => b.is_recommended && matches(b)), [beauticians, matches]);
    const filteredOther = useMemo(() => beauticians.filter(b => !b.is_recommended && matches(b)), [beauticians, matches]);

    const handleSelectBeautician = useCallback((beautician) => {
        setSelectedBeautician(beautician.id);
    }, []);

    const goToBookingRequest = beauticianId => {
        const beautician = beauticians.find(b => b.id === beauticianId);
        navigation.navigate('BookingRequest', {
            ...params,
            beauticianId: beauticianId || null,
            beauticianName: beautician?.name || null,
        });
    };

    const handleContinue = () => {
        if (isBooking) {
            goToBookingRequest(selectedBeautician);
        } else {
            // Browsing: start a booking by picking services first
            navigation.navigate('Categories');
        }
    };

    const renderBeauticianItem = useCallback(({ item }) => {
        const photo = getImageUrl(item.profile_picture);
        return (
        <TouchableOpacity
            style={[
                styles.beauticianCard,
                selectedBeautician === item.id && styles.beauticianCardSelected
            ]}
            onPress={() => handleSelectBeautician(item)}
            activeOpacity={0.7}>

            {/* Profile Image */}
            <View style={styles.beauticianImageContainer}>
                <Image
                    source={photo ? { uri: photo } : ImageConstant.user1}
                    style={styles.beauticianImage}
                    resizeMode="cover"
                />
            </View>

            {/* Content Section */}
            <View style={styles.beauticianContent}>
                {/* Name */}
                <Typography
                    type={Font.GeneralSans_Semibold}
                    size={16}
                    color="#242424"
                    numberOfLines={1}
                    style={styles.beauticianName}>
                    {item.name}
                </Typography>

                {!!item.business_name && item.business_name !== item.name && (
                    <Typography
                        type={Font.GeneralSans_Regular}
                        size={13}
                        color="#6B6B6B"
                        numberOfLines={1}
                        style={styles.businessName}>
                        {item.business_name}
                    </Typography>
                )}

                {/* Experience and Rating Row */}
                <View style={styles.experienceRatingRow}>
                    {item.experience != null && (
                        <>
                            <Typography
                                type={Font.GeneralSans_Regular}
                                size={14}
                                color="#191919">
                                {item.experience} {Number(item.experience) === 1 ? 'yr' : 'yrs'} exp
                            </Typography>
                            <View style={styles.dot} />
                        </>
                    )}
                    <Typography
                        type={Font.GeneralSans_Regular}
                        size={14}
                        color="#191919">
                        {ratingLabel(item)}
                    </Typography>
                </View>

                {/* Location Row */}
                {!!locationLabel(item) && (
                    <Typography
                        type={Font.GeneralSans_Regular}
                        size={13}
                        color="#6B6B6B"
                        numberOfLines={1}
                        style={styles.location}>
                        📍 {locationLabel(item)}
                    </Typography>
                )}

                <TouchableOpacity
                    onPress={() => openDetails(item)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.detailsLink}>
                    <Typography type={Font.GeneralSans_Medium} size={13} color={Colors.zyaraGreen}>
                        View details ›
                    </Typography>
                </TouchableOpacity>
            </View>

            {/* Price - Right Aligned */}
            {item.starting_price != null && (
                <View style={styles.priceContainer}>
                    <Typography
                        type={Font.GeneralSans_Semibold}
                        size={18}
                        color="#000000"
                        style={styles.price}>
                        {formatPrice(item.starting_price)}
                    </Typography>
                </View>
            )}
        </TouchableOpacity>
        );
    }, [selectedBeautician, handleSelectBeautician, openDetails]);

    return (
        <>
            <LinearGradient
                colors={[Colors.white, Colors.lightGreen]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.backgroundGradient}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <ScreenHeader title="Choose Beauticians" showGreenLine={true} />

                <View style={styles.container}>
                    {/* Search Input */}
                    <Input
                        mainStyle={{ marginTop: 5 }}
                        source={ImageConstant.search}
                        showImage={true}
                        placeholder="Search by name or city"
                        style_inputContainer={styles.searchInput}
                        placeholderTextColor="#656565"
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />

                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}>

                        {isBooking && (
                            <Typography
                                type={Font.GeneralSans_Regular}
                                size={14}
                                color={Colors.textSecondary}
                                style={styles.bookingHint}>
                                Showing beauticians free on {moment(params.bookingDate).format('ddd, D MMM')} · {params.timeSlotLabel}
                            </Typography>
                        )}

                        {loading && <ActivityIndicator color={Colors.zyaraGreen} style={{ marginTop: 30 }} />}

                        {!loading && filteredRecommended.length === 0 && filteredOther.length === 0 && (
                            <Typography
                                type={Font.GeneralSans_Regular}
                                size={15}
                                color={Colors.textSecondary}
                                style={styles.emptyText}>
                                {beauticians.length
                                    ? 'No beautician matches your search.'
                                    : isBooking
                                    ? 'No beautician is free at this time. Continue and we will assign one, or pick another slot.'
                                    : 'No beauticians available yet.'}
                            </Typography>
                        )}

                        {/* Recommended Section */}
                        {filteredRecommended.length > 0 && (
                            <View style={styles.section}>
                                <Typography
                                    type={Font.GeneralSans_Semibold}
                                    size={20}
                                    color="#000707"
                                    style={styles.sectionTitle}>
                                    Recommended
                                </Typography>
                                <FlatList
                                    data={filteredRecommended}
                                    keyExtractor={item => item.id.toString()}
                                    renderItem={({ item }) => renderBeauticianItem({ item })}
                                    scrollEnabled={false}
                                />
                            </View>
                        )}

                        {/* Beautician Section */}
                        {filteredOther.length > 0 && (
                            <View style={styles.section}>
                                <Typography
                                    type={Font.GeneralSans_Semibold}
                                    size={20}
                                    color="#000707"
                                    style={styles.sectionTitle}>
                                    Beautician
                                </Typography>
                                <FlatList
                                    data={filteredOther}
                                    keyExtractor={item => item.id.toString()}
                                    renderItem={({ item }) => renderBeauticianItem({ item })}
                                    scrollEnabled={false}
                                />
                            </View>
                        )}

                        {isBooking && (
                            <TouchableOpacity onPress={() => goToBookingRequest(null)} style={styles.skipLink}>
                                <Typography
                                    type={Font.GeneralSans_Medium}
                                    size={15}
                                    color={Colors.zyaraGreen}
                                    style={{ textDecorationLine: 'underline' }}>
                                    Skip — let Zyara assign a beautician
                                </Typography>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </View>

                {/* Continue Button */}
                <View style={styles.bottomContainer}>
                    <Button
                        title={isBooking ? 'CONTINUE' : 'BOOK A SERVICE'}
                        onPress={handleContinue}
                        style={styles.continueButton}
                        linerColor={['#00B272', '#00B272']}
                        title_style={styles.buttonText}
                        disabled={isBooking && !selectedBeautician}
                    />
                </View>
                {/* Beautician Details Sheet */}
                <Modal
                    visible={!!detailsFor}
                    transparent
                    animationType="slide"
                    onRequestClose={closeDetails}>
                    <View style={styles.sheetBackdrop}>
                        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={closeDetails} />
                        <View style={styles.sheet}>
                            <View style={styles.sheetHandle} />
                            {(() => {
                                const b = { ...(detailsFor || {}), ...(details || {}) };
                                const photo = getImageUrl(b.profile_picture);
                                const services = details?.services || [];
                                const reviews = details?.reviews || [];
                                const gallery = details?.gallery || [];
                                return (
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        <View style={styles.sheetHeader}>
                                            <Image
                                                source={photo ? { uri: photo } : ImageConstant.user1}
                                                style={styles.sheetPhoto}
                                            />
                                            <View style={{ flex: 1 }}>
                                                <Typography type={Font.GeneralSans_Semibold} size={18} color="#1A1A1A">
                                                    {b.name}
                                                </Typography>
                                                {!!b.business_name && b.business_name !== b.name && (
                                                    <Typography type={Font.GeneralSans_Regular} size={14} color="#6B6B6B">
                                                        {b.business_name}
                                                    </Typography>
                                                )}
                                                {!!locationLabel(b) && (
                                                    <Typography type={Font.GeneralSans_Regular} size={13} color="#6B6B6B" style={{ marginTop: 4 }}>
                                                        📍 {locationLabel(b)}
                                                    </Typography>
                                                )}
                                            </View>
                                        </View>

                                        <View style={styles.statsRow}>
                                            <View style={styles.statBox}>
                                                <Typography type={Font.GeneralSans_Semibold} size={16} color="#1A1A1A">
                                                    {b.experience != null ? `${b.experience} ${Number(b.experience) === 1 ? 'yr' : 'yrs'}` : '—'}
                                                </Typography>
                                                <Typography type={Font.GeneralSans_Regular} size={12} color="#6B6B6B">Experience</Typography>
                                            </View>
                                            <View style={styles.statBox}>
                                                <Typography type={Font.GeneralSans_Semibold} size={16} color="#1A1A1A">
                                                    {Number(b.rating) > 0 ? `⭐ ${Number(b.rating).toFixed(1)}` : 'New'}
                                                </Typography>
                                                <Typography type={Font.GeneralSans_Regular} size={12} color="#6B6B6B">
                                                    {Number(b.total_reviews) > 0 ? `${b.total_reviews} reviews` : 'No reviews yet'}
                                                </Typography>
                                            </View>
                                            <View style={styles.statBox}>
                                                <Typography type={Font.GeneralSans_Semibold} size={16} color="#1A1A1A">
                                                    {b.starting_price != null ? formatPrice(b.starting_price) : '—'}
                                                </Typography>
                                                <Typography type={Font.GeneralSans_Regular} size={12} color="#6B6B6B">Starting at</Typography>
                                            </View>
                                        </View>

                                        {gallery.length > 0 && (
                                            <>
                                                <View style={styles.galleryTitleRow}>
                                                    <Typography type={Font.GeneralSans_Semibold} size={16} color="#1A1A1A">
                                                        Gallery
                                                    </Typography>
                                                    <Typography type={Font.GeneralSans_Regular} size={13} color="#6B6B6B">
                                                        {gallery.length} {gallery.length === 1 ? 'photo' : 'photos'}
                                                    </Typography>
                                                </View>
                                                <ScrollView
                                                    horizontal
                                                    showsHorizontalScrollIndicator={false}
                                                    contentContainerStyle={styles.galleryStrip}>
                                                    {gallery.map((g, i) => (
                                                        <TouchableOpacity key={g.id ?? i} activeOpacity={0.85} onPress={() => setViewerIndex(i)}>
                                                            <Image source={{ uri: getImageUrl(g.image) }} style={styles.galleryThumb} />
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            </>
                                        )}

                                        {!!b.bio && (
                                            <>
                                                <Typography type={Font.GeneralSans_Semibold} size={16} color="#1A1A1A" style={styles.sheetSectionTitle}>
                                                    About
                                                </Typography>
                                                <Typography type={Font.GeneralSans_Regular} size={14} color="#3A3A3A" style={{ lineHeight: 21 }}>
                                                    {b.bio}
                                                </Typography>
                                            </>
                                        )}

                                        {detailsLoading ? (
                                            <ActivityIndicator color={Colors.zyaraGreen} style={{ marginVertical: 20 }} />
                                        ) : (
                                            <>
                                                {services.length > 0 && (
                                                    <>
                                                        <Typography type={Font.GeneralSans_Semibold} size={16} color="#1A1A1A" style={styles.sheetSectionTitle}>
                                                            Services
                                                        </Typography>
                                                        {services.map((sv, i) => (
                                                            <View key={sv.id ?? i} style={styles.serviceRow}>
                                                                <Typography type={Font.GeneralSans_Regular} size={14} color="#1A1A1A" numberOfLines={1} style={{ flex: 1 }}>
                                                                    {sv.name || sv.title}
                                                                </Typography>
                                                                {sv.price != null && (
                                                                    <Typography type={Font.GeneralSans_Medium} size={14} color="#1A1A1A">
                                                                        {formatPrice(sv.price)}
                                                                    </Typography>
                                                                )}
                                                            </View>
                                                        ))}
                                                    </>
                                                )}
                                                {reviews.length > 0 && (
                                                    <>
                                                        <Typography type={Font.GeneralSans_Semibold} size={16} color="#1A1A1A" style={styles.sheetSectionTitle}>
                                                            Reviews
                                                        </Typography>
                                                        {reviews.slice(0, 3).map((rv, i) => (
                                                            <View key={rv.id ?? i} style={styles.reviewRow}>
                                                                <Typography type={Font.GeneralSans_Medium} size={14} color="#1A1A1A">
                                                                    {rv.user_name || rv.customer_name || 'Customer'}{rv.rating ? `  ⭐ ${rv.rating}` : ''}
                                                                </Typography>
                                                                {!!(rv.comment || rv.review) && (
                                                                    <Typography type={Font.GeneralSans_Regular} size={13} color="#6B6B6B" style={{ marginTop: 2 }}>
                                                                        {rv.comment || rv.review}
                                                                    </Typography>
                                                                )}
                                                            </View>
                                                        ))}
                                                    </>
                                                )}
                                            </>
                                        )}

                                        {isBooking && (
                                            <Button
                                                title={selectedBeautician === b.id ? 'SELECTED' : 'SELECT BEAUTICIAN'}
                                                onPress={() => {
                                                    setSelectedBeautician(b.id);
                                                    closeDetails();
                                                }}
                                                linerColor={['#00B272', '#00B272']}
                                                main_style={{ marginTop: 16 }}
                                            />
                                        )}
                                    </ScrollView>
                                );
                            })()}
                        </View>
                    </View>
                    <GalleryViewer
                        images={details?.gallery || []}
                        index={viewerIndex}
                        onClose={() => setViewerIndex(null)}
                    />
                </Modal>
            </SafeAreaView>
        </>
    );
};

export default ChooseBeauticians;

const styles = StyleSheet.create({
    bookingHint: {
        marginBottom: 14,
    },

    emptyText: {
        textAlign: 'center',
        marginTop: 30,
        lineHeight: 22,
    },

    skipLink: {
        alignItems: 'center',
        paddingVertical: 10,
    },

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

    scrollContent: {
        paddingBottom: 20,
    },

    section: {
        marginTop: 15,
    },

    sectionTitle: {
        marginBottom: 15,
        fontSize: 20,
    },

    beauticianCard: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 12,
        marginTop: 15,
        padding: 12,
        paddingVertical: 12,
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
        width: '100%',
        minHeight: 107.25,
        alignItems: 'center',
    },

    beauticianCardSelected: {
        borderColor: Colors.zyaraGreen,
        borderWidth: 2,
        padding: 11,
    },

    beauticianImageContainer: {
        width: 83.31,
        height: 83.31,
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 12,
    },

    beauticianImage: {
        width: '100%',
        height: '100%',
    },

    beauticianContent: {
        flex: 1,
        justifyContent: 'center',
    },

    beauticianName: {
        fontSize: 16,
    },

    businessName: {
        marginTop: 1,
    },

    location: {
        marginTop: 4,
    },

    detailsLink: {
        alignSelf: 'flex-start',
        marginTop: 6,
    },

    sheetBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },

    sheet: {
        maxHeight: '80%',
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 22,
        paddingTop: 10,
        paddingBottom: 28,
    },

    sheetHandle: {
        alignSelf: 'center',
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#DDDDDD',
        marginBottom: 16,
    },

    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    sheetPhoto: {
        width: 72,
        height: 72,
        borderRadius: 12,
        marginRight: 14,
    },

    statsRow: {
        flexDirection: 'row',
        marginTop: 18,
    },

    statBox: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        marginHorizontal: 4,
        borderRadius: 10,
        backgroundColor: '#F4FCF8',
    },

    galleryTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 18,
        marginBottom: 10,
    },

    galleryStrip: {
        gap: 8,
    },

    galleryThumb: {
        width: 96,
        height: 96,
        borderRadius: 10,
        backgroundColor: '#F0F0F0',
    },

    sheetSectionTitle: {
        marginTop: 18,
        marginBottom: 8,
    },

    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },

    reviewRow: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },

    experienceRatingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },

    experience: {
        fontSize: 16,
    },

    dotsContainer: {
        marginHorizontal: 8,
    },

    dot: {
        marginHorizontal: 8,
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#D9D9D9',
    },

    rating: {
        fontSize: 14,
    },

    timeSlotRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },

    timeSlot: {
        fontSize: 14,
    },

    priceContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginLeft: 12,
    },

    price: {
        fontSize: 18,
        textAlign: 'right',
    },

    bottomContainer: {
        paddingHorizontal: 22,
        paddingBottom: 8,
        paddingTop: 2,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },

    continueButton: {
        width: '100%',
        height: 60,
        borderRadius: 12,
    },

    buttonText: {
        fontSize: 18,
        textTransform: 'uppercase',
    },
});

