import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../Constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../Component/ScreenHeader';
import Input from '../../Component/Input';
import { ImageConstant } from '../../Constants/ImageConstant';
import { GET } from '../../Backend/Backend';
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
            CATEGORIES,
            res => {
                console.log('Categories:', res);
                setCategoryList(res?.data);

            },
            err => {
                console.log('Get Error:', err);
            }
        );
    };
    console.log('categors:', categoryList)

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
                        placeholder="Search"
                        style_inputContainer={styles.searchInput}
                        placeholderTextColor="rgba(0,0,0,0.5)"
                    />

                    <FlatList
                        data={categoryList}
                        keyExtractor={item => item.id?.toString()}
                        contentContainerStyle={{ paddingBottom: 10 }}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={[styles.card, { backgroundColor: item.color || COLORS[index % COLORS.length] }]}
                                onPress={() => navigation.navigate('SubCategories', {
                                    categoryId: item.id,
                                    categoryName: item.name,
                                    id: item.id,
                                    name: item.name,
                                })}>
                                <View style={styles.cardContent}>
                                    <Typography type={Font.GeneralSans_Bold} size={22} color='#363620' style={styles.cardTitle}>{item.name}</Typography>
                                    <Typography
                                        style={styles.cardSubtitle}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                        color='#000000'
                                        size={14}
                                    >
                                        {item.description}
                                    </Typography>
                                </View>

                                <Image
                                    source={{ uri: item?.image }}
                                    style={styles.cardImage}
                                    resizeMode="contain"
                                    onError={(error) => {
                                        console.log('Image load error:', error.nativeEvent.error);
                                        console.log('Failed URL:', item?.image);
                                    }}
                                    onLoad={() => {
                                        console.log('Image loaded successfully:', item?.image);
                                    }}
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
        height: 55,
        borderRadius: 12,
        backgroundColor: Colors.white,
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 12,
        marginTop: 15,
    },

    cardImage: {
        width: 120,
        height: 120,
        borderRadius: 12,
        resizeMode: 'contain',
        zIndex: 999
    },

    cardContent: {
        marginLeft: 15,
        flex: 1,
    },

    cardTitle: {
        fontSize: 18,
    },

    cardSubtitle: {
        marginTop: 3,
    },
});
