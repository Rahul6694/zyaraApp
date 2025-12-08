import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../Constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../Component/ScreenHeader';
import Input from '../../Component/Input';
import { ImageConstant } from '../../Constants/ImageConstant';
import { GET } from '../../Backend/Backend';
import Typography from '../../Component/UI/Typography';
import { SUBCATEGORIES } from '../../Backend/api_routes';
import { Font } from '../../Constants/Font';
import Button from '../../Component/Button';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Static Data for Services
const staticServices = [
    {
        id: 1,
        name: 'Haircut & Styling',
        title: 'Haircut & Styling',
        image: 'https://images.unsplash.com/photo-1560869713-7d0a8c41b0b5?w=400',
        rating: 4.5,
        duration: '1 hr 50 mins',
        price: '999',
        original_price: '1500',
        discount: '20',
        inCart: false,
    },
    {
        id: 2,
        name: 'Hair Treatments',
        title: 'Hair Treatments',
        image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400',
        rating: 4.5,
        duration: '1 hr 50 mins',
        price: '999',
        original_price: '1500',
        discount: '20',
        inCart: false,
    },
    {
        id: 3,
        name: 'Hair Coloring',
        title: 'Hair Coloring',
        image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a13737?w=400',
        rating: 4.5,
        duration: '1 hr 50 mins',
        price: '749',
        original_price: '1099',
        discount: '31',
        inCart: false,
    },
    {
        id: 4,
        name: 'Hair Spa',
        title: 'Hair Spa',
        image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a13737?w=400',
        rating: 4.5,
        duration: '1 hr 50 mins',
        price: '999',
        original_price: '1500',
        discount: '20',
        inCart: false,
    },
    {
        id: 5,
        name: 'Advanced Facial',
        title: 'Advanced Facial (Glow, Detan, Anti-aging)',
        image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
        rating: 4.5,
        duration: '1 hr 50 mins',
        price: '999',
        original_price: '1600',
        discount: '20',
        inCart: false,
    },
    {
        id: 6,
        name: 'Deep Cleansing Facial',
        title: 'Deep Cleansing Facial',
        image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
        rating: 4.5,
        duration: '1 hr 15 mins',
        price: '799',
        original_price: '1200',
        discount: '33',
        inCart: false,
    },
];

const SubCategories = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const categoryId = route?.params?.categoryId || route?.params?.id;
    const categoryName = route?.params?.categoryName || route?.params?.name || 'Sub Categories';

    const [serviceList, setServiceList] = useState(staticServices);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cartItems, setCartItems] = useState(0);

    useEffect(() => {
        // Initialize cart items from services that are already in cart
        const initialCartCount = staticServices.filter(s => s.inCart).length;
        setCartItems(initialCartCount);

        // Uncomment below to fetch from API
        // if (categoryId) {
        //     getSubCategories();
        // }
    }, [categoryId]);

    const getSubCategories = () => {
        setLoading(true);
        GET(
            `${SUBCATEGORIES}?category_id=${categoryId}`,
            res => {
                console.log('Sub Categories:', res);
                setServiceList(res?.data || staticServices);
                setLoading(false);
            },
            err => {
                console.log('Get Error:', err);
                setServiceList(staticServices); // Fallback to static data
                setLoading(false);
            }
        );
    };

    const filteredServices = serviceList.filter(service =>
        service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddToCart = (item) => {
        // Add to cart logic
        if (!item.inCart) {
            setServiceList(prev =>
                prev.map(service =>
                    service.id === item.id
                        ? { ...service, inCart: true }
                        : service
                )
            );
            setCartItems(prev => prev + 1);
            console.log('Added to cart:', item);
        }
    };

    const handleViewDetails = (item) => {
        // Navigate to service details
        navigation.navigate('ServiceDetails', { service: item });
    };

    const renderServiceItem = ({ item }) => (
        <View style={styles.serviceCard}>
            <View style={styles.serviceImageContainer}>
                <Image
                    source={ImageConstant.girl}
                    style={styles.serviceImage}
                    resizeMode="cover"
                    onError={(error) => {
                        console.log('Service image error:', error);
                    }}
                />
            </View>

            <View style={styles.serviceContent}>
                <Typography
                    type={Font.GeneralSans_Semibold}
                    size={16}
                    color="#000000"
                    style={styles.serviceTitle}>
                    {item?.name || item?.title || 'Service Name'}
                </Typography>

                {/* Rating */}
                <View style={styles.ratingContainer}>
                    <View style={styles.ratingBadge}>
                        <Typography
                            type={Font.GeneralSans_Regular}
                            size={15}
                            color="#000000">
                            {item?.rating || 4.5}
                        </Typography>
                        <View style={styles.starIcon}>
                            <Typography size={12}>⭐</Typography>
                        </View>
                    </View>
                    <View style={styles.clockContainer}>
                        <Typography
                            type={Font.GeneralSans_Regular}
                            size={15}
                            color="#8C8C8C"
                            style={styles.duration}>
                            {item?.duration || item?.service_duration || '1 hr 50 mins'}
                        </Typography>
                    </View>
                </View>

                {/* Price */}
                <View style={styles.priceContainer}>
                    <Typography
                        type={Font.GeneralSans_Bold}
                        size={18}
                        color="#000000">
                        ₹{item?.price || item?.service_price || '999'}
                    </Typography>
                    {item?.original_price && (
                        <>
                            <Typography
                                type={Font.GeneralSans_Regular}
                                size={16}
                                color="#8C8C8C"
                                style={styles.originalPrice}>
                                ₹{item.original_price}
                            </Typography>
                            {item?.discount && (
                                <Typography
                                    type={Font.GeneralSans_Medium}
                                    size={16}
                                    color="#FFBA6A"
                                    style={styles.discount}>
                                    {item.discount}% off
                                </Typography>
                            )}
                        </>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        style={[
                            styles.addButton,
                            item.inCart && styles.addButtonActive
                        ]}
                        onPress={() => handleAddToCart(item)}>
                        <Typography
                            type={Font.GeneralSans_Medium}
                            size={18}
                            color={item.inCart ? '#FFFFFF' : Colors.zyaraGreen}>
                            {item.inCart ? 'ADDED' : 'ADD'}
                        </Typography>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.viewDetailsButton}
                        onPress={() => handleViewDetails(item)}>
                        <Typography
                            type={Font.GeneralSans_Medium}
                            size={14}
                            color={Colors.zyaraGreen}>
                            View Details
                        </Typography>
                        <Typography
                            type={Font.GeneralSans_Medium}
                            size={14}
                            color={Colors.zyaraGreen}
                            style={styles.arrow}>
                            &gt;
                        </Typography>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <>
            <LinearGradient
                colors={[Colors.white, Colors.lightGreen]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.backgroundGradient}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <ScreenHeader title={categoryName} showGreenLine={true} />

                <View style={styles.container}>
                    <Input
                        mainStyle={{ marginTop: 5 }}
                        source={ImageConstant.search}
                        showImage={true}
                        placeholder="Search for waxing, facial, spa..."
                        style_inputContainer={styles.searchInput}
                        placeholderTextColor="rgba(0,0,0,0.5)"
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />

                    <FlatList
                        data={filteredServices}
                        keyExtractor={item => item?.id?.toString() || Math.random().toString()}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderServiceItem}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Typography
                                    type={Font.GeneralSans_Regular}
                                    size={16}
                                    color="#999999"
                                    textAlign="center">
                                    {loading ? 'Loading...' : 'No services found'}
                                </Typography>
                            </View>
                        }
                    />
                </View>

                {/* Floating Cart Button */}
                {cartItems > 0 && (
                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={() => navigation.navigate('AddToCart')}>
                        <View style={styles.cartBadge}>
                            <Typography
                                type={Font.GeneralSans_Bold}
                                size={12}
                                color="#FFFFFF">
                                {cartItems}
                            </Typography>
                        </View>
                        <Typography
                            type={Font.GeneralSans_Semibold}
                            size={14}
                            color="#FFFFFF">
                            View Carts {cartItems} Item{cartItems > 1 ? 's' : ''}
                        </Typography>
                    </TouchableOpacity>
                )}

                {/* Continue Button */}
           
           
                        <Button
                            title="CONTINUE"
                            onPress={() => navigation.navigate('ChooseBeauticians', { cartItems })}
                            style={styles.continueButton}
                            linerColor={[Colors.zyaraGreen, Colors.zyaraGreen]}
                            title_style={styles.buttonText}
                        />
               
        
            </SafeAreaView>
        </>
    );
};

export default SubCategories;

const styles = StyleSheet.create({
    backgroundGradient: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },

    container: {
        flex: 1,
        paddingHorizontal: 20,
    },

    searchInput: {
        height: 55,
        borderRadius: 12,
        backgroundColor: Colors.white,
        marginBottom: 10,
    },

    listContainer: {
        paddingBottom: 100,
    },

    serviceCard: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 16,
        marginTop: 15,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E3E3E3',
        shadowColor: '#D3D1D8',
        shadowOffset: {
            width: 15,
            height: 15,
        },
        shadowOpacity: 0.25,
        shadowRadius: 30,
        elevation: 5,
    },

    serviceImageContainer: {
        width: 135,
        height: 120,
        borderRadius: 15,
        overflow: 'hidden',
    },

    serviceImage: {
        width: '100%',
        height: '100%',
    },

    serviceContent: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },

    serviceTitle: {
        marginBottom: 8,
        fontSize: 18,
    },

    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },

    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F3F3F3',
        borderRadius: 112,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
    },

    starIcon: {
        marginLeft: 4,
    },

    clockContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    duration: {
        marginLeft: 4,
    },

    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    originalPrice: {
        textDecorationLine: 'line-through',
        marginLeft: 8,
    },

    discount: {
        marginLeft: 8,
    },

    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    addButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.zyaraGreen,
        backgroundColor: '#EFFFF9',
        minWidth: 108,
        alignItems: 'center',
    },

    addButtonActive: {
        backgroundColor: Colors.zyaraGreen,
        borderColor: Colors.zyaraGreen,
    },

    viewDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
    },

    arrow: {
        marginLeft: 4,
    },

    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },

    cartButton: {
        position: 'absolute',
        bottom: 110,
        left: '30%',
        backgroundColor: Colors.zyaraGreen,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,

    },

    cartBadge: {
        backgroundColor: '#FF4444',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },

   

    continueButton: {
        width: '90%',
        alignSelf:'center',
        position: 'absolute',
        bottom: 0,
      
       
    },
});

