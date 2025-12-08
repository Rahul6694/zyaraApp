import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

// Static Data for Service Details
const defaultServiceData = {
    id: 1,
    name: 'Advanced Facial (Glow, Detan, Anti-aging)',
    rating: 4.5,
    duration: '1 hr 50 mins',
    price: '999',
    original_price: '1200',
    discount: '20',
    image: ImageConstant.girl,
    description: 'Deep Cleansing helps remove dirt, oil, and impurities from pores, unclogs blackheads, and refreshes dull skin, leaving it smoother and glowing.',
    suitsFor: [
        'Basic Haircut',
        'Layer Cut',
        'Kids Haircut',
        'Hair Styling',
        'All Type',
    ],
    benefits: [
        'Removes dirt, oil & Impurities from pores',
        'Helps prevent acne & blackheads',
        'Improves skin texture & smoothness',
        'Restores natural glow & radiance',
        'Boosts hydration & freshness',
        'Promotes healthy, clear-looking skin',
    ],
};

const ServiceDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const serviceData = route?.params?.service || defaultServiceData;

    const [service, setService] = useState({
        ...defaultServiceData,
        ...serviceData,
    });

    const handleCheckout = () => {
        // Navigate to checkout or add to cart
        navigation.navigate('SelectLocation', {
            service: service,
            cartItems: 1,
        });
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
                            source={service.image || ImageConstant.girl}
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
                                {service.name || service.title || 'Service Name'}
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
                                    {service.rating || '4.5'}
                                </Typography>
                            </View>
                        </View>

                        {/* Duration */}
                        <View style={styles.durationContainer}>
                            <Image 
                                source={ImageConstant.clock} 
                                style={styles.clockIcon} 
                            />
                            <Typography
                                type={Font.GeneralSans_Regular}
                                size={16}
                                color="#666666">
                                {service.duration || service.service_duration || '1 hr 50 mins'}
                            </Typography>
                        </View>

                        {/* Price Section */}
                        <View style={styles.priceSection}>
                            <Typography
                                type={Font.GeneralSans_Bold}
                                size={24}
                                color="#000000"
                                style={styles.price}>
                                ₹{service.price || service.service_price || '999'}
                            </Typography>
                            {service.original_price && (
                                <View style={styles.priceDetails}>
                                    <Typography
                                        type={Font.GeneralSans_Regular}
                                        size={18}
                                        color="#999999"
                                        style={styles.originalPrice}>
                                        ₹{service.original_price}
                                    </Typography>
                                    {service.discount && (
                                        <Typography
                                            type={Font.GeneralSans_Medium}
                                            size={16}
                                            color="#FFBA6A"
                                            style={styles.discount}>
                                            {service.discount}% off
                                        </Typography>
                                    )}
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
                                {service.description || defaultServiceData.description}
                            </Typography>
                        </View>

                        {/* Suits For Section */}
                        <View style={styles.section}>
                            <Typography
                                type={Font.GeneralSans_Semibold}
                                size={18}
                                color="#000000"
                                style={styles.sectionTitle}>
                                Suits for:
                            </Typography>
                            <View style={styles.listContainer}>
                                {service.suitsFor?.map((item, index) => (
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

                        {/* Benefits Section */}
                        <View style={styles.section}>
                            <Typography
                                type={Font.GeneralSans_Semibold}
                                size={18}
                                color="#000000"
                                style={styles.sectionTitle}>
                                Benefits:
                            </Typography>
                            <View style={styles.listContainer}>
                                {service.benefits?.map((item, index) => (
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
                    </View>
                </ScrollView>

                
                    <Button
                        title="CHECKOUT"
                        onPress={handleCheckout}
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

