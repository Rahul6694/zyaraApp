import React, { useCallback, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../Constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../Component/ScreenHeader';
import { ImageConstant } from '../../Constants/ImageConstant';
import Typography from '../../Component/UI/Typography';
import { Font } from '../../Constants/Font';
import Button from '../../Component/Button';
import DropdownNew from '../../Component/DropdownNew';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import SimpleToast from 'react-native-simple-toast';
import { getCart, updateCartItem } from '../../Backend/BookingAPI';
import { formatPrice } from '../../Utils/imageUrl';

const { width } = Dimensions.get('window');

const personOptions = [1, 2, 3, 4, 5].map(n => ({
    label: `${n} ${n === 1 ? 'person' : 'persons'}`,
    value: n,
}));

const AddToCart = () => {
    const navigation = useNavigation();

    const [cartItems, setCartItems] = useState([]);
    const [summary, setSummary] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const [forSomeoneElse, setForSomeoneElse] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const applyCart = data => {
        setCartItems(data?.items || []);
        setSummary(data?.summary || null);
        setTotalItems(data?.total_items || 0);
    };

    const loadCart = useCallback((people = numberOfPeople) => {
        getCart(
            people,
            res => {
                applyCart(res?.data);
                setLoading(false);
            },
            err => {
                console.log('Cart error:', err);
                setLoading(false);
            },
        );
    }, [numberOfPeople]);

    useFocusEffect(
        useCallback(() => {
            loadCart();
        }, [loadCart]),
    );

    const handlePeopleChange = value => {
        setNumberOfPeople(value);
        loadCart(value);
    };

    // Quantity 0 removes the item on the server
    const handleQuantityChange = (item, change) => {
        const quantity = Math.max(0, item.quantity + change);
        setUpdatingId(item.id);
        updateCartItem(
            item.id,
            quantity,
            () => {
                setUpdatingId(null);
                loadCart();
            },
            err => {
                setUpdatingId(null);
                SimpleToast.show(err?.data?.message || 'Could not update cart', SimpleToast.SHORT);
            },
        );
    };

    const handleCheckout = () => {
        navigation.navigate('SlotBooking', {
            numberOfPeople,
            forSomeoneElse,
            total: summary?.total_amount,
        });
    };

    const handleBookingForSomeoneElse = () => {
        setForSomeoneElse(prev => !prev);
    };

    const renderCartItem = (item) => {
        const hasDiscount = Number(item.original_price) > Number(item.price);
        return (
        <View key={item.id} style={styles.cartItem}>
            <View style={styles.cartItemContent}>
                {/* Item Name */}
                <Typography
                    type={Font.GeneralSans_Semibold}
                    size={18}
                    color="#1A1A1A"
                    style={styles.itemName}>
                    {item.name}
                </Typography>

                {!!item.description && (
                    <View style={styles.descriptionContainer}>
                        <Typography
                            type={Font.GeneralSans_Regular}
                            size={14}
                            color="#4D4D4D"
                            numberOfLines={2}
                            style={styles.descriptionText}>
                            {item.description}
                        </Typography>
                    </View>
                )}

                {/* Price, Duration and Quantity Row */}
                <View style={styles.priceDurationRow}>
                    <View style={styles.priceDurationLeft}>
                        <View style={styles.priceContainer}>
                            <Typography
                                type={Font.GeneralSans_Medium}
                                size={16}
                                color="#262626">
                                {formatPrice(item.price)}
                            </Typography>
                            {hasDiscount && (
                                <Typography
                                    type={Font.GeneralSans_Regular}
                                    size={15}
                                    color="#8C8C8C"
                                    style={styles.originalPrice}>
                                    {formatPrice(item.original_price)}
                                </Typography>
                            )}
                        </View>

                        {!!item.duration && (
                        <View style={styles.durationContainer}>
                            <Image
                                source={ImageConstant.clock}
                                style={styles.clockIcon}
                                resizeMode="contain"
                            />
                            <Typography
                                type={Font.GeneralSans_Regular}
                                size={15}
                                color="#090909">
                                {item.duration} mins
                            </Typography>
                        </View>
                        )}
                    </View>

                    {/* Quantity Selector */}
                    <View style={styles.quantitySelector}>
                        <TouchableOpacity
                            disabled={updatingId === item.id}
                            onPress={() => handleQuantityChange(item, -1)}
                            style={styles.quantityButtonMinus}>
                            <View style={styles.minusLine} />
                        </TouchableOpacity>
                        <View style={styles.quantityValue}>
                            {updatingId === item.id ? (
                                <ActivityIndicator size="small" color="#00B272" />
                            ) : (
                                <Typography
                                    type={Font.GeneralSans_Medium}
                                    size={16}
                                    color="#000000">
                                    {String(item.quantity).padStart(2, '0')}
                                </Typography>
                            )}
                        </View>
                        <TouchableOpacity
                            disabled={updatingId === item.id}
                            onPress={() => handleQuantityChange(item, 1)}
                            style={styles.quantityButtonPlus}>
                            <View style={styles.plusLineHorizontal} />
                            <View style={styles.plusLineVertical} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
        );
    };

    const summaryRow = (label, value) => (
        <View style={styles.summaryRow}>
            <Typography
                type={Font.GeneralSans_Regular}
                size={16}
                color="#1C1C1C">
                {label}
            </Typography>
            <Typography
                type={Font.GeneralSans_Semibold}
                size={16}
                color="#262626"
                style={styles.summaryAmount}>
                {value}
            </Typography>
        </View>
    );

    return (
        <LinearGradient
            colors={['#EFFFF4', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.backgroundGradient}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Header */}
                    <ScreenHeader title="Add to Cart" showGreenLine={true} />

                {/* Body */}
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}>
                    {loading ? (
                        <ActivityIndicator color="#00B272" size="large" style={{ marginTop: 60 }} />
                    ) : cartItems.length === 0 ? (
                        <View style={styles.emptyCart}>
                            <Typography type={Font.GeneralSans_Semibold} size={20} color="#1C1C1C">
                                Your cart is empty
                            </Typography>
                            <Typography
                                type={Font.GeneralSans_Regular}
                                size={15}
                                color={Colors.textSecondary}
                                style={styles.emptyText}>
                                Add a service to book a beautician at your home.
                            </Typography>
                            <Button
                                title="BROWSE SERVICES"
                                onPress={() => navigation.navigate('Categories')}
                                style={styles.button}
                                linerColor={['#00B272', '#00B272']}
                                title_style={styles.buttonText}
                            />
                        </View>
                    ) : (
                    <View style={styles.content}>
                        {/* Booking for someone else */}
                        <View style={styles.bookingSection}>
                            <Typography
                                type={Font.GeneralSans_Medium}
                                size={16}
                                color="#000000"
                                style={styles.bookingText}>
                                {forSomeoneElse ? "You'll enter their details next" : 'Booking for someone else?'}
                            </Typography>
                            <TouchableOpacity
                                onPress={handleBookingForSomeoneElse}
                                style={styles.addButton}>
                                <Typography
                                    type={Font.GeneralSans_Medium}
                                    size={18}
                                    color="#00B272">
                                    {forSomeoneElse ? 'REMOVE' : 'ADD'}
                                </Typography>
                            </TouchableOpacity>
                        </View>

                        {/* Cart Items */}
                        <View style={styles.cartItemsContainer}>
                            {cartItems.map(renderCartItem)}
                        </View>

                        {/* Number of people */}
                        <View style={styles.chargesRow}>
                            <View style={styles.chargesLabel}>
                                <Typography
                                    type={Font.GeneralSans_Regular}
                                    size={15}
                                    color="#111111">
                                    Number of people
                                </Typography>
                            </View>
                            <View style={styles.chargesRight}>
                                <DropdownNew
                                    MainBoxStyle={styles.personDropdown}
                                    marginHorizontal={0}
                                    size={35}
                                    data={personOptions}
                                    value={numberOfPeople}
                                    onChange={(item) => handlePeopleChange(item.value)}
                                    style_dropdown={styles.dropdownStyle}
                                    placeholder=""
                                />
                            </View>
                        </View>

                        {/* Summary Section */}
                        <View style={styles.summarySection}>
                            <View style={styles.summaryDivider} />

                            {summaryRow(
                                numberOfPeople > 1 ? `Sub Total (× ${numberOfPeople} people)` : 'Sub Total',
                                formatPrice(summary?.subtotal || 0),
                            )}
                            {summaryRow('Tax', formatPrice(summary?.tax_amount || 0))}
                            {summaryRow('Platform Fee', formatPrice(summary?.platform_fee || 0))}
                            {Number(summary?.discount_amount) > 0 &&
                                summaryRow('Offer & Discount', `−${formatPrice(summary.discount_amount)}`)}

                            {/* Total */}
                            <View style={styles.totalRow}>
                                <View>
                                    <Typography
                                        type={Font.GeneralSans_Semibold}
                                        size={20}
                                        color="#1C1C1C">
                                        Total
                                    </Typography>
                                    <Typography
                                        type={Font.GeneralSans_Regular}
                                        size={16}
                                        color="#000000"
                                        style={styles.itemsCount}>
                                        ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                                    </Typography>
                                </View>
                                <Typography
                                    type={Font.GeneralSans_Semibold}
                                    size={20}
                                    color="#262626">
                                    {formatPrice(summary?.total_amount || 0)}
                                </Typography>
                            </View>
                        </View>

                        {/* Checkout Button */}
                        <Button
                            title="CHECKOUT"
                            onPress={handleCheckout}
                            style={styles.button}
                            linerColor={['#00B272', '#00B272']}
                            title_style={styles.buttonText}
                        />
                    </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
        </LinearGradient>
    );
};

export default AddToCart;

const styles = StyleSheet.create({
    emptyCart: {
        alignItems: 'center',
        paddingHorizontal: 22,
        paddingTop: 60,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    backgroundGradient: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        paddingBottom: 10,
        flexGrow: 1,
    },
    content: {
        paddingHorizontal: 21,
        paddingTop: 20,
    },
    bookingSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FEFFFA',
        borderWidth: 1,
        borderColor: 'rgba(0, 178, 114, 0.2)',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 18,
        marginBottom: 20,
        shadowColor: '#E9E9E9',
        shadowOffset: {
            width: 15,
            height: 20,
        },
        shadowOpacity: 0.25,
        shadowRadius: 22.5,
        elevation: 8,
    },
    bookingText: {
        flex: 1,
    },
    addButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    cartItemsContainer: {
        marginBottom: 20,
    },
    cartItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        shadowColor: '#E9E9E9',
        shadowOffset: {
            width: 15,
            height: 20,
        },
        shadowOpacity: 0.25,
        shadowRadius: 22.5,
        elevation: 8,
    },
    cartItemContent: {
        width: '100%',
    },
    itemName: {
        marginBottom: 8,
        fontSize: 18,
    },
    descriptionContainer: {
        marginBottom: 12,
    },
    descriptionText: {
  
        marginBottom: 4,
    },
    priceDurationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    priceDurationLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    originalPrice: {
        textDecorationLine: 'line-through',
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    clockIcon: {
        width: 12,
        height: 12,
        tintColor: '#090909',
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 7,
        overflow: 'hidden',
        flexShrink: 0,
    },
    quantityButtonMinus: {
        width: 33.4,
        height: 33.4,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#00B272',
        borderRadius: 7,
        backgroundColor: '#FFFFFF',
    },
    quantityButtonPlus: {
        width: 33.4,
        height: 33.4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00B272',
        borderRadius: 7,
    },
    quantityValue: {
        width: 40,
        height: 33.4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    minusLine: {
        width: 11.79,
        height: 1.5,
        backgroundColor: '#00B272',
    },
    plusLineHorizontal: {
        position: 'absolute',
        width: 11.79,
        height: 1.5,
        backgroundColor: '#FFFFFF',
    },
    plusLineVertical: {
        position: 'absolute',
        width: 1.5,
        height: 11.79,
        backgroundColor: '#FFFFFF',
    },
    dashedDivider: {
        height: 1.2,
        borderTopWidth: 1.2,
        borderTopColor: '#A1A1A1',
        borderStyle: 'dashed',
        marginVertical: 16,
    },
    chargesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    chargesLabel: {
        flex: 1,
   
    },
    chargesRight: {
        flexDirection: 'row',
        alignItems: 'center',
 
        gap: 8,
    
    },
    personDropdown: {
        width: 130,
        marginVertical: 0,
    },
    dropdownStyle: {
        height: 35,
        width: '100%',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#00B272',
    },
    chargeAmount: {
        width: 60,
        textAlign: 'right',
    },
    summarySection: {
        marginBottom: 24,
    },
    summaryDivider: {
        height: 4,
        backgroundColor: '#F4F4F4',
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    summaryAmount: {
        minWidth: 102,
        textAlign: 'right',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    itemsCount: {
        marginTop: 4,
    },
  
    
});
