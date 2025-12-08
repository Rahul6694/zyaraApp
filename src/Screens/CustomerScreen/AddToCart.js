import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Image,
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
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const AddToCart = () => {
    const navigation = useNavigation();

    // Cart items state
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Chocolate Facial',
            price: 999,
            originalPrice: 500,
            duration: '1 hr 50 mins',
            quantity: 1,
        },
        {
            id: 2,
            name: 'Deep Cleansing Facial',
            price: 999,
            originalPrice: 500,
            duration: '1 hr 50 mins',
            quantity: 1,
            description: '9 Steps Facial | Includes Free Silicone Facial Brush',
        },
    ]);

    const [serviceChargesPerson, setServiceChargesPerson] = useState('1 person');
    const [productCostPerson, setProductCostPerson] = useState('1 person');

    const personOptions = [
        { label: '1 person', value: '1 person' },
        { label: '2 persons', value: '2 persons' },
        { label: '3 persons', value: '3 persons' },
        { label: '4 persons', value: '4 persons' },
    ];

    // Calculate totals
    const serviceCharges = 450;
    const productCost = 799;
    const subTotal = serviceCharges + productCost;
    const taxAndFees = 49;
    const offerDiscount = 49;
    const total = subTotal + taxAndFees - offerDiscount;
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handleQuantityChange = (itemId, change) => {
        setCartItems(prevItems =>
            prevItems.map(item => {
                if (item.id === itemId) {
                    const newQuantity = Math.max(1, item.quantity + change);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    const handleCheckout = () => {
        navigation.navigate('SlotBooking', {
            cartItems: cartItems,
            total: total,
        });
    };

    const handleBookingForSomeoneElse = () => {
        console.log('Booking for someone else');
    };

    const renderCartItem = (item, index) => (
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

                {/* Description for second item */}
                {item.description && (
                    <View style={styles.descriptionContainer}>
                        <Typography
                            type={Font.GeneralSans_Regular}
                            size={15}
                            color="#4D4D4D"
                            style={styles.descriptionText}>
                            9 Steps Facial
                        </Typography>
                        <Typography
                            type={Font.GeneralSans_Regular}
                            size={15}
                            color="#4D4D4D"
                            style={styles.descriptionText}>
                            Includes Free
                        </Typography>
                        <Typography
                            type={Font.GeneralSans_Regular}
                            size={15}
                            color="#4D4D4D"
                            style={styles.descriptionText}>
                            Silicone Facial Brush
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
                                ₹{item.price}
                            </Typography>
                            {item.originalPrice && (
                                <Typography
                                    type={Font.GeneralSans_Regular}
                                    size={15}
                                    color="#8C8C8C"
                                    style={styles.originalPrice}>
                                    ₹{item.originalPrice}
                                </Typography>
                            )}
                        </View>

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
                                {item.duration}
                            </Typography>
                        </View>
                    </View>

                    {/* Quantity Selector */}
                    <View style={styles.quantitySelector}>
                        <TouchableOpacity
                            onPress={() => handleQuantityChange(item.id, -1)}
                            style={styles.quantityButtonMinus}>
                            <View style={styles.minusLine} />
                        </TouchableOpacity>
                        <View style={styles.quantityValue}>
                            <Typography
                                type={Font.GeneralSans_Medium}
                                size={16}
                                color="#000000">
                                {String(item.quantity).padStart(2, '0')}
                            </Typography>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleQuantityChange(item.id, 1)}
                            style={styles.quantityButtonPlus}>
                            <View style={styles.plusLineHorizontal} />
                            <View style={styles.plusLineVertical} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Service Charges and Product Cost inside second item */}
                {index === 1 && (
                    <>
                        <View style={styles.dashedDivider} />
                        <View style={styles.chargesRow}>
                            <View style={styles.chargesLabel}>
                                <Typography
                                    type={Font.GeneralSans_Regular}
                                    size={15}
                                    color="#111111">
                                    Service Charges
                                </Typography>
                            </View>
                            <View style={styles.chargesRight}>
                               
                                <Typography
                                    type={Font.GeneralSans_Semibold}
                                    size={16}
                                    color="#262626"
                                    style={styles.chargeAmount}>
                                    ₹{serviceCharges}
                                </Typography>
                                <DropdownNew
                                    MainBoxStyle={styles.personDropdown}
                                    data={personOptions}
                                    value={serviceChargesPerson}
                                    onChange={(item) => setServiceChargesPerson(item.value)}
                                    style_dropdown={styles.dropdownStyle}
                                    placeholder=""
                                />
                            </View>
                        </View>
                        <View style={styles.chargesRow}>
                            <View style={styles.chargesLabel}>
                                <Typography
                                    type={Font.GeneralSans_Regular}
                                    size={15}
                                    color="#111111">
                                    Product Cost
                                </Typography>
                            </View>
                            <View style={styles.chargesRight}>
                             
                                <Typography
                                    type={Font.GeneralSans_Semibold}
                                    size={16}
                                    color="#262626"
                                    style={styles.chargeAmount}>
                                    ₹{productCost}
                                </Typography>

                                <DropdownNew
                                    MainBoxStyle={styles.personDropdown}
                                    data={personOptions}
                                    value={productCostPerson}
                                    onChange={(item) => setProductCostPerson(item.value)}
                                    style_dropdown={styles.dropdownStyle}
                                    placeholder=""
                                />
                            </View>
                        </View>
                    </>
                )}
            </View>
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
                    <View style={styles.content}>
                        {/* Booking for someone else */}
                        <View style={styles.bookingSection}>
                            <Typography
                                type={Font.GeneralSans_Medium}
                                size={16}
                                color="#000000"
                                style={styles.bookingText}>
                                Booking for someone else?
                            </Typography>
                            <TouchableOpacity
                                onPress={handleBookingForSomeoneElse}
                                style={styles.addButton}>
                                <Typography
                                    type={Font.GeneralSans_Medium}
                                    size={18}
                                    color="#00B272">
                                    ADD
                                </Typography>
                            </TouchableOpacity>
                        </View>

                        {/* Cart Items */}
                        <View style={styles.cartItemsContainer}>
                            {cartItems.map((item, index) => renderCartItem(item, index))}
                        </View>

                        {/* Summary Section */}
                        <View style={styles.summarySection}>
                            <View style={styles.summaryDivider} />
                            
                            {/* Sub Total */}
                            <View style={styles.summaryRow}>
                                <Typography
                                    type={Font.GeneralSans_Regular}
                                    size={16}
                                    color="#1C1C1C">
                                    Sub Total
                                </Typography>
                                <Typography
                                    type={Font.GeneralSans_Semibold}
                                    size={16}
                                    color="#262626"
                                    style={styles.summaryAmount}>
                                    ₹{subTotal.toFixed(2)}
                                </Typography>
                            </View>

                            {/* Tax and Fees */}
                            <View style={styles.summaryRow}>
                                <Typography
                                    type={Font.GeneralSans_Regular}
                                    size={16}
                                    color="#1C1C1C">
                                    Tax and Fees
                                </Typography>
                                <Typography
                                    type={Font.GeneralSans_Semibold}
                                    size={16}
                                    color="#262626"
                                    style={styles.summaryAmount}>
                                    ₹{taxAndFees.toFixed(2)}
                                </Typography>
                            </View>

                            {/* Offer & Discount */}
                            <View style={styles.summaryRow}>
                                <Typography
                                    type={Font.GeneralSans_Regular}
                                    size={16}
                                    color="#1C1C1C">
                                    Offer & Discount
                                </Typography>
                                <Typography
                                    type={Font.GeneralSans_Semibold}
                                    size={16}
                                    color="#262626"
                                    style={styles.summaryAmount}>
                                    ₹{offerDiscount.toFixed(2)}
                                </Typography>
                            </View>

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
                                        ({totalItems} items)
                                    </Typography>
                                </View>
                                <Typography
                                    type={Font.GeneralSans_Semibold}
                                    size={20}
                                    color="#262626">
                                    ₹{total.toFixed(2)}
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
                </ScrollView>
            </View>
        </SafeAreaView>
        </LinearGradient>
    );
};

export default AddToCart;

const styles = StyleSheet.create({
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
        width: 100,
        height: 35,
    },
    dropdownStyle: {
        height: 35,
        width:130,
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
