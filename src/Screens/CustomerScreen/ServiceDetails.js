import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../Constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../Component/ScreenHeader';
import { ImageConstant } from '../../Constants/ImageConstant';
import Typography from '../../Component/UI/Typography';
import { Font } from '../../Constants/Font';
import Button from '../../Component/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import SimpleToast from 'react-native-simple-toast';
import { GET } from '../../Backend/Backend';
import { SUBCATEGORIES } from '../../Backend/api_routes';
import { addToCart } from '../../Backend/BookingAPI';
import { getFirstImageUrl, formatPrice } from '../../Utils/imageUrl';

const toList = value => {
    if (Array.isArray(value)) {
        return value;
    }
    try {
        const parsed = JSON.parse(value || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
};

const { width } = Dimensions.get('window');

const ServiceDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [service, setService] = useState(route?.params?.service || {});
    const [adding, setAdding] = useState(false);

    // Refresh from the API so details are always current
    useEffect(() => {
        const id = route?.params?.service?.id || route?.params?.id;
        if (!id) {
            return;
        }
        GET(
            `${SUBCATEGORIES}/${id}`,
            res => res?.data && setService(prev => ({ ...prev, ...res.data })),
            err => console.log('Service details error:', err),
        );
    }, [route?.params?.service?.id, route?.params?.id]);

    const image = getFirstImageUrl(service.images);
    const hasDiscount = Number(service.discount) > 0 && Number(service.discounted_price) > 0;
    const suitsFor = toList(service.suits_for);
    const benefits = toList(service.benefits);

    const handleCheckout = () => {
        if (!service.id) {
            return;
        }
        setAdding(true);
        addToCart(
            { sub_category_id: service.id, quantity: 1 },
            () => {
                setAdding(false);
                navigation.navigate('SelectLocation');
            },
            err => {
                setAdding(false);
                SimpleToast.show(err?.data?.message || 'Could not add to cart', SimpleToast.SHORT);
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
                <ScreenHeader title="Service Details" showGreenLine={false} />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}>
                    
                    {/* Hero Image */}
                    <View style={styles.heroImageContainer}>
                        <Image
                            source={image ? { uri: image } : ImageConstant.girl}
                            style={styles.heroImage}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Content Container */}
                    <View style={styles.contentContainer}>
                        {/* Service Title with Rating */}
                        <View style={styles.titleRow}>
                            <Typography
                                type={Font.GeneralSans_Semibold}
                                size={20}
                                color="#000000"
                                style={styles.serviceTitle}>
                                {service.name}
                            </Typography>
                            <View style={styles.ratingContainer}>
                                <Typography
                                    type={Font.GeneralSans_Regular}
                                    size={16}
                                    color="#000000"
                                    style={styles.starIcon}>
                                    ⭐
                                </Typography>
                                <Typography
                                    type={Font.GeneralSans_Regular}
                                    size={16}
                                    color="#000000"
                                    style={styles.rating}>
                                    {Number(service.rating || 0).toFixed(1)}
                                </Typography>
                            </View>
                        </View>

                        {/* Duration */}
                        {!!service.category_name && (
                        <View style={styles.durationContainer}>
                            <Typography
                                type={Font.GeneralSans_Regular}
                                size={16}
                                color="#666666">
                                {service.category_name}
                            </Typography>
                        </View>
                        )}

                        {/* Price Section */}
                        <View style={styles.priceSection}>
                            <Typography
                                type={Font.GeneralSans_Bold}
                                size={24}
                                color="#000000"
                                style={styles.price}>
                                {formatPrice(hasDiscount ? service.discounted_price : service.price)}
                            </Typography>
                            {hasDiscount && (
                                <View style={styles.priceDetails}>
                                    <Typography
                                        type={Font.GeneralSans_Regular}
                                        size={18}
                                        color="#999999"
                                        style={styles.originalPrice}>
                                        {formatPrice(service.price)}
                                    </Typography>
                                    <Typography
                                        type={Font.GeneralSans_Medium}
                                        size={16}
                                        color="#FFBA6A"
                                        style={styles.discount}>
                                        {Math.round(Number(service.discount))}% off
                                    </Typography>
                                </View>
                            )}
                        </View>

                        {/* Description */}
                        <View style={styles.descriptionContainer}>
                            <Typography
                                type={Font.GeneralSans_Regular}
                                size={16}
                                color="#666666"
                                style={styles.description}>
                                {service.description}
                            </Typography>
                        </View>

                        {/* Suits For Section */}
                        {suitsFor.length > 0 && (
                        <View style={styles.section}>
                            <Typography
                                type={Font.GeneralSans_Semibold}
                                size={18}
                                color="#000000"
                                style={styles.sectionTitle}>
                                Suits for:
                            </Typography>
                            <View style={styles.listContainer}>
                                {suitsFor.map((item, index) => (
                                    <View key={index} style={styles.listItem}>
                                        <View style={styles.checkmark}>
                                            <Typography
                                                type={Font.GeneralSans_Bold}
                                                size={14}
                                                color={Colors.zyaraGreen}>
                                                ✓
                                            </Typography>
                                        </View>
                                        <Typography
                                            type={Font.GeneralSans_Regular}
                                            size={16}
                                            color="#666666"
                                            style={styles.listText}>
                                            {item}
                                        </Typography>
                                    </View>
                                ))}
                            </View>
                        </View>
                        )}

                        {/* Benefits Section */}
                        {benefits.length > 0 && (
                        <View style={styles.section}>
                            <Typography
                                type={Font.GeneralSans_Semibold}
                                size={18}
                                color="#000000"
                                style={styles.sectionTitle}>
                                Benefits:
                            </Typography>
                            <View style={styles.listContainer}>
                                {benefits.map((item, index) => (
                                    <View key={index} style={styles.listItem}>
                                        <View style={styles.checkmark}>
                                            <Typography
                                                type={Font.GeneralSans_Bold}
                                                size={14}
                                                color={Colors.zyaraGreen}>
                                                ✓
                                            </Typography>
                                        </View>
                                        <Typography
                                            type={Font.GeneralSans_Regular}
                                            size={16}
                                            color="#666666"
                                            style={styles.listText}>
                                            {item}
                                        </Typography>
                                    </View>
                                ))}
                            </View>
                        </View>
                        )}
                    </View>
                </ScrollView>

                
                    <Button
                        title="CHECKOUT"
                        onPress={handleCheckout}
                        loader={adding}
                        style={styles.checkoutButton}
                        linerColor={[Colors.zyaraGreen, Colors.zyaraGreen]}
                        title_style={styles.buttonText}
                    />
         
            </SafeAreaView>
        </>
    );
};

export default ServiceDetails;

const styles = StyleSheet.create({
    backgroundGradient: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },

    scrollContent: {
        paddingBottom: 0,
    },

    heroImageContainer: {
        width: '100%',
        height: 300,
        backgroundColor: Colors.lightGreen,
    },

    heroImage: {
        width: '100%',
        height: '100%',
    },

    contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },

    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    serviceTitle: {
        flex: 1,
        fontSize: 20,
        marginRight: 10,
    },

    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    starIcon: {
        marginRight: 6,
    },

    rating: {
        fontSize: 16,
    },

    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },

    clockIcon: {
        width: 18,
        height: 18,
        marginRight: 8,
        tintColor: '#666666',
    },

    priceSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },

    price: {
        fontSize: 24,
        marginRight: 12,
    },

    priceDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    originalPrice: {
        textDecorationLine: 'line-through',
        marginRight: 8,
        fontSize: 18,
    },

    discount: {
        fontSize: 16,
    },

    descriptionContainer: {
        marginBottom: 24,
    },

    description: {
        fontSize: 16,
    },

    section: {
        marginBottom: 24,
    },

    sectionTitle: {
        fontSize: 18,
        marginBottom: 12,
    },

    listContainer: {
        marginTop: 8,
    },

    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },

    checkmark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.lightGreen,
        borderWidth: 1,
        borderColor: Colors.zyaraGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    listText: {
        flex: 1,
        fontSize: 16,
    },
    
    checkoutButton:{
        width:'90%',
        alignSelf:'center'
    }

  
    
});

