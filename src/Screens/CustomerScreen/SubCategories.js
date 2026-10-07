import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import SimpleToast from 'react-native-simple-toast';
import { SUBCATEGORIES } from '../../Backend/api_routes';
import { GET } from '../../Backend/Backend';
import { addToCart, getCart } from '../../Backend/BookingAPI';
import Button from '../../Component/Button';
import Input from '../../Component/Input';
import ScreenHeader from '../../Component/ScreenHeader';
import Typography from '../../Component/UI/Typography';
import { Colors } from '../../Constants/Colors';
import { Font } from '../../Constants/Font';
import { ImageConstant } from '../../Constants/ImageConstant';
import { formatPrice, getFirstImageUrl } from '../../Utils/imageUrl';

const { width } = Dimensions.get('window');

const SubCategories = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const categoryId = route?.params?.categoryId || route?.params?.id;
    const categoryName = route?.params?.categoryName || route?.params?.name || 'Sub Categories';

    const [serviceList, setServiceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [cartItems, setCartItems] = useState(0);
    // sub_category_id -> quantity currently in the cart
    const [cartMap, setCartMap] = useState({});
    const [addingId, setAddingId] = useState(null);

    const applyCart = cart => {
        const map = {};
        (cart?.items || []).forEach(i => {
            if (i.sub_category_id) {
                map[i.sub_category_id] = i.quantity;
            }
        });
        setCartMap(map);
        setCartItems(cart?.total_items || 0);
    };

    const getSubCategories = useCallback(() => {
        GET(
            categoryId ? `${SUBCATEGORIES}/category/${categoryId}?limit=100` : `${SUBCATEGORIES}?limit=100`,
            res => {
                setServiceList(res?.data || []);
                setLoading(false);
            },
            err => {
                console.log('Get Error:', err);
                setLoading(false);
            }
        );
    }, [categoryId]);

    // Reload services and cart state whenever the screen is shown
    useFocusEffect(
        useCallback(() => {
            getSubCategories();
            getCart(null, res => applyCart(res?.data), () => {});
        }, [getSubCategories])
    );

    const filteredServices = serviceList.filter(service =>
        service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service?.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddToCart = (item) => {
        setAddingId(item.id);
        addToCart(
            { sub_category_id: item.id, quantity: 1 },
            res => {
                setAddingId(null);
                applyCart(res?.data);
            },
            err => {
                setAddingId(null);
                SimpleToast.show(err?.data?.message || 'Could not add to cart', SimpleToast.SHORT);
            }
        );
    };

    const handleViewDetails = (item) => {
        // Navigate to service details
        navigation.navigate('ServiceDetails', { service: item });
    };

    const renderServiceItem = ({ item }) => {
        const image = getFirstImageUrl(item.images);
        const inCart = !!cartMap[item.id];
        const hasDiscount = Number(item.discount) > 0 && Number(item.discounted_price) > 0;
        return (
        <View style={styles.serviceCard}>
            <View style={styles.serviceImageContainer}>
                <Image
                    source={image ? { uri: image } : ImageConstant.girl}
                    style={styles.serviceImage}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.serviceContent}>
                <Typography
                    type={Font.GeneralSans_Semibold}
                    size={16}
                    color="#000000"
                    style={styles.serviceTitle}>
                    {item?.name}
                </Typography>

                {/* Rating */}
                <View style={styles.ratingContainer}>
                    <View style={styles.ratingBadge}>
                        <Typography
                            type={Font.GeneralSans_Regular}
                            size={15}
                            color="#000000">
                            {Number(item?.rating || 0).toFixed(1)}
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
                            numberOfLines={1}
                            style={styles.duration}>
                            {item?.category_name || categoryName}
                        </Typography>
                    </View>
                </View>

                {/* Price */}
                <View style={styles.priceContainer}>
                    <Typography
                        type={Font.GeneralSans_Bold}
                        size={18}
                        color="#000000">
                        {formatPrice(hasDiscount ? item.discounted_price : item.price)}
                    </Typography>
                    {hasDiscount && (
                        <>
                            <Typography
                                type={Font.GeneralSans_Regular}
                                size={16}
                                color="#8C8C8C"
                                style={styles.originalPrice}>
                                {formatPrice(item.price)}
                            </Typography>
                            <Typography
                                type={Font.GeneralSans_Medium}
                                size={16}
                                color="#FFBA6A"
                                style={styles.discount}>
                                {Math.round(Number(item.discount))}% off
                            </Typography>
                        </>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        style={[
                            styles.addButton,
                            inCart && styles.addButtonActive
                        ]}
                        disabled={addingId === item.id}
                        onPress={() => (inCart ? navigation.navigate('AddToCart') : handleAddToCart(item))}>
                        {addingId === item.id ? (
                            <ActivityIndicator size="small" color={Colors.zyaraGreen} />
                        ) : (
                            <Typography
                                type={Font.GeneralSans_Medium}
                                size={16}
                                color={inCart ? '#FFFFFF' : Colors.zyaraGreen}>
                                {inCart ? `ADDED${cartMap[item.id] > 1 ? ` (${cartMap[item.id]})` : ''}` : 'ADD'}
                            </Typography>
                        )}
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
                                    {loading ? 'Loading...' : 'No services in this category yet'}
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
                            disabled={cartItems === 0}
                            onPress={() => navigation.navigate('AddToCart')}
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
        width: 110,
        height: 110,
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
        paddingHorizontal: 10,
        paddingVertical: 9,
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
        bottom: 120,
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

