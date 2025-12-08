import React, { useState, useCallback, useMemo } from 'react';
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
import Typography from '../../Component/UI/Typography';
import { Font } from '../../Constants/Font';
import Button from '../../Component/Button';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Static Data for Beauticians - Matching Figma Design
const recommendedBeauticians = [
    {
        id: 1,
        name: 'Anita Sharma',
        experience: 'Exp: 6 Years',
        rating: 4.5,
        timeSlot: '02:30 PM - 02:45 PM',
        price: '₹500',
        image: ImageConstant.user1,
    },
    {
        id: 2,
        name: 'Shreya Gupta',
        experience: 'Exp: 6 Years',
        rating: 4.5,
        timeSlot: '02:30 PM - 02:45 PM',
        price: '₹1000',
        image: ImageConstant.user2,
    },
];

const otherBeauticians = [
    {
        id: 3,
        name: 'Neha Shrivastav',
        experience: 'Exp: 6 Years',
        rating: 4.5,
        timeSlot: '02:30 PM - 02:45 PM',
        price: '₹400',
        image: ImageConstant.user3,
    },
    {
        id: 4,
        name: 'Anjali Misra',
        experience: 'Exp: 6 Years',
        rating: 4.5,
        timeSlot: '02:30 PM - 02:45 PM',
        price: '₹700',
        image: ImageConstant.user4,
    },
    {
        id: 5,
        name: 'Kavita Pathak',
        experience: 'Exp: 6 Years',
        rating: 4.5,
        timeSlot: '02:30 PM - 02:45 PM',
        price: '₹600',
        image: ImageConstant.user5,
    },
];

const ChooseBeauticians = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const cartItems = route?.params?.cartItems || 0;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBeautician, setSelectedBeautician] = useState(null);

    const filteredRecommended = useMemo(() => 
        recommendedBeauticians.filter(beautician =>
            beautician.name.toLowerCase().includes(searchQuery.toLowerCase())
        ), [searchQuery]
    );

    const filteredOther = useMemo(() => 
        otherBeauticians.filter(beautician =>
            beautician.name.toLowerCase().includes(searchQuery.toLowerCase())
        ), [searchQuery]
    );

    const handleSelectBeautician = useCallback((beautician) => {
        setSelectedBeautician(beautician.id);
    }, []);

    const handleContinue = useCallback(() => {
        if (selectedBeautician) {
            navigation.navigate('ServiceDetails', {
                beauticianId: selectedBeautician,
                cartItems: cartItems,
            });
        }
    }, [selectedBeautician, cartItems, navigation]);

    const renderBeauticianItem = useCallback(({ item }) => (
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
                    source={item.image}
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
                    style={styles.beauticianName}>
                    {item.name}
                </Typography>

                {/* Experience and Rating Row */}
                <View style={styles.experienceRatingRow}>
                    <Typography
                        type={Font.GeneralSans_Regular}
                        size={16}
                        color="#191919"
                        style={styles.experience}>
                        {item.experience}
                    </Typography>
                    
                    {/* Dots */}
                    <View style={styles.dotsContainer}>
                        <View style={styles.dot} />
                    </View>

                    {/* Rating */}
                    <Typography
                        type={Font.GeneralSans_Regular}
                        size={14}
                        color="#191919"
                        style={styles.rating}>
                        ⭐ {item.rating}
                    </Typography>
                </View>

                {/* Time Slot Row */}
                <View style={styles.timeSlotRow}>
                    <Typography
                        type={Font.GeneralSans_Regular}
                        size={14}
                        color="#000000"
                        style={styles.timeSlot}>
                        {item.timeSlot}
                    </Typography>
                </View>
            </View>

            {/* Price - Right Aligned */}
            <View style={styles.priceContainer}>
                <Typography
                    type={Font.GeneralSans_Semibold}
                    size={18}
                    color="#000000"
                    style={styles.price}>
                    {item.price}
                </Typography>
            </View>
        </TouchableOpacity>
    ), [selectedBeautician, handleSelectBeautician]);

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
                        placeholder="Search for waxing, facial, spa..."
                        style_inputContainer={styles.searchInput}
                        placeholderTextColor="#656565"
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />

                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}>
                        
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
                    </ScrollView>
                </View>

                {/* Continue Button */}
                <View style={styles.bottomContainer}>
                    <Button
                        title="CONTINUE"
                        onPress={handleContinue}
                        style={styles.continueButton}
                        linerColor={['#00B272', '#00B272']}
                        title_style={styles.buttonText}
                        disabled={!selectedBeautician}
                    />
                </View>
            </SafeAreaView>
        </>
    );
};

export default ChooseBeauticians;

const styles = StyleSheet.create({
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
        paddingBottom: 100,
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
        marginBottom: 4,
        fontSize: 16,
    },

    experienceRatingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },

    experience: {
        fontSize: 16,
    },

    dotsContainer: {
        marginHorizontal: 8,
    },

    dot: {
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
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 22,
        paddingBottom: 23,
        paddingTop: 10,
        backgroundColor: 'transparent',
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

