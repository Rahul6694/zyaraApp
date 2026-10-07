import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors, Shadow } from '../../Constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../Component/ScreenHeader';
import Input from '../../Component/Input';
import { ImageConstant } from '../../Constants/ImageConstant';
import { GET } from '../../Backend/Backend';
import { getImageUrl } from '../../Utils/imageUrl';
import Typography from '../../Component/UI/Typography';
import { CATEGORIES } from '../../Backend/api_routes';
import { Font } from '../../Constants/Font';
import { useNavigation } from '@react-navigation/native';

const Categories = () => {
    const navigation = useNavigation();

    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        GET(
            `${CATEGORIES}?limit=100`,
            res => {
                setCategoryList(res?.data);
            },
            err => {
                console.log('Get Error:', err);
            }
        );
    };

    const COLORS = ['#FFE7D5', '#C7F4D1', '#D9E4FE', '#EBEBCD', '#E2D5F4', '#C7F4D1', '#FFD2D2', "#C7F4D1"];
    return (
        <LinearGradient
            colors={['#EFFFF4', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.backgroundGradient}>
            <SafeAreaView style={styles.safeArea}>
                <ScreenHeader title="All Categories" showGreenLine={true} />

                <View style={styles.container}>

                    <Input
                        mainStyle={{ marginTop: 5 }}
                        source={ImageConstant.search}
                        showImage={true}
                        placeholder="Search categories"
                        showTitle={false}
                        style_inputContainer={styles.searchInput}
                    />

                    <FlatList
                        data={categoryList}
                        keyExtractor={item => item.id?.toString()}
                        contentContainerStyle={{ paddingBottom: 10 }}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                activeOpacity={0.85}
                                style={[styles.card, { backgroundColor: item.color || COLORS[index % COLORS.length] }]}
                                onPress={() => navigation.navigate('SubCategories', {
                                    categoryId: item.id,
                                    categoryName: item.name,
                                    id: item.id,
                                    name: item.name,
                                })}>
                                <View style={styles.cardContent}>
                                    <Typography type={Font.GeneralSans_Semibold} size={19} color={Colors.textPrimary} style={styles.cardTitle}>{item.name}</Typography>
                                    <Typography
                                        style={styles.cardSubtitle}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                        color={Colors.textSecondary}
                                        size={13}
                                        lineHeight={18}
                                    >
                                        {item.description}
                                    </Typography>
                                    <View style={styles.exploreChip}>
                                        <Typography size={12} type={Font.GeneralSans_Semibold} color={Colors.textPrimary}>
                                            Explore  →
                                        </Typography>
                                    </View>
                                </View>

                                <Image
                                    source={{ uri: getImageUrl(item?.image) || undefined }}
                                    style={styles.cardImage}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default Categories;

const styles = StyleSheet.create({
    backgroundGradient: {
        flex: 1,
        width: '100%',
     
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
    },

    searchInput: {
        height: 52,
        borderRadius: 14,
        backgroundColor: Colors.white,
        ...Shadow.sm,
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingRight: 8,
        borderRadius: 20,
        marginTop: 14,
        overflow: 'hidden',
    },

    cardImage: {
        width: 110,
        height: 110,
        borderRadius: 16,
        resizeMode: 'contain',
    },

    cardContent: {
        marginLeft: 18,
        flex: 1,
    },

    cardTitle: {},

    cardSubtitle: {
        marginTop: 4,
    },

    exploreChip: {
        alignSelf: 'flex-start',
        marginTop: 10,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
});
