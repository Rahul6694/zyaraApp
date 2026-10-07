import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Dimensions,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import SimpleToast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { Colors, Shadow } from '../../Constants/Colors';
import { Font } from '../../Constants/Font';
import Typography from '../../Component/UI/Typography';
import { ImageConstant } from '../../Constants/ImageConstant';
import { logOut } from '../../Redux/action';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Input from '../../Component/Input';
import {
  getHomeData,
  getUserAddresses,
  getCart,
  addToCart,
  filterServices,
} from '../../Backend/BookingAPI';
import FilterModal, {
  EMPTY_FILTERS,
  countActiveFilters,
  filtersToParams,
} from '../../Component/Modals/FilterModal';
import { getImageUrl, getFirstImageUrl, formatPrice } from '../../Utils/imageUrl';

const { width, height } = Dimensions.get('window');

const Home = ({navigation}) => {

  const [cartItems, setCartItems] = useState(0);
  const insets = useSafeAreaInsets();

  const [categoryList, setCategoryList] = useState([]);
  const [banners, setBanners] = useState([]);
  const [recommendedServices, setRecommendedServices] = useState([]);
  const [nearbyBeauticians, setNearbyBeauticians] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchTimer = useRef(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filterVisible, setFilterVisible] = useState(false);
  const activeFilterCount = countActiveFilters(filters);
  const showResults = !!search.trim() || activeFilterCount > 0;

  const city = address?.city || '';

  const loadHome = useCallback((cityName, onDone) => {
    getHomeData(
      cityName,
      res => {
        const data = res?.data || {};
        setBanners(data.banners || []);
        setCategoryList(data.categories || []);
        setRecommendedServices(data.recommended || []);
        setNearbyBeauticians(data.beauticians || []);
        setLoading(false);
        onDone && onDone();
      },
      err => {
        console.log('Home load error:', err);
        setLoading(false);
        onDone && onDone();
      },
    );
  }, []);

  // Default saved address decides the header and which beauticians count as "nearby"
  const loadAddressThenHome = useCallback(onDone => {
    getUserAddresses(
      res => {
        const list = res?.data || [];
        const selected = list.find(a => a.is_default) || list[0] || null;
        setAddress(selected);
        loadHome(selected?.city, onDone);
      },
      () => {
        setAddress(null);
        loadHome('', onDone);
      },
    );
  }, [loadHome]);

  const refreshCartCount = useCallback(() => {
    getCart(
      null,
      res => setCartItems(res?.data?.total_items || 0),
      () => {},
    );
  }, []);

  // Refresh address and cart every time Home comes back into view
  useFocusEffect(
    useCallback(() => {
      loadAddressThenHome();
      refreshCartCount();
    }, [loadAddressThenHome, refreshCartCount]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    refreshCartCount();
    loadAddressThenHome(() => setRefreshing(false));
  };

  // Debounced search + filters across catalogue services
  useEffect(() => {
    clearTimeout(searchTimer.current);
    const term = search.trim();
    if (!term && !countActiveFilters(filters)) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    searchTimer.current = setTimeout(() => {
      filterServices(
        { search: term, ...filtersToParams(filters) },
        res => {
          setSearchResults(res?.data || []);
          setSearching(false);
        },
        () => setSearching(false),
      );
    }, 350);
    return () => clearTimeout(searchTimer.current);
  }, [search, filters]);

  const handleAddToCart = item => {
    setAddingId(item.id);
    addToCart(
      { sub_category_id: item.id, quantity: 1 },
      res => {
        setAddingId(null);
        setCartItems(res?.data?.total_items || cartItems + 1);
        SimpleToast.show(`${item.name} added to cart`, SimpleToast.SHORT);
      },
      err => {
        setAddingId(null);
        SimpleToast.show(err?.data?.message || 'Could not add to cart', SimpleToast.SHORT);
      },
    );
  };

  const openBanner = banner => {
    if (banner?.category_id) {
      navigation.navigate('SubCategories', {
        categoryId: banner.category_id,
        categoryName: banner.category_name,
        id: banner.category_id,
        name: banner.category_name,
      });
    } else {
      navigation.navigate('Categories');
    }
  };

  const addressLine = address
    ? [address.house_no, address.road_name, address.address, address.city].filter(Boolean).join(', ')
    : '';


  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.categoryCard}
      onPress={() => navigation.navigate('SubCategories', {
        categoryId: item.id,
        categoryName: item.name,
        id: item.id,
        name: item.name,
      })}>
      <View style={styles.categoryImageWrap}>
        {getImageUrl(item.image) ? (
          <Image
            source={{ uri: getImageUrl(item.image) }}
            style={styles.categoryImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.categoryImage, styles.imagePlaceholder]}>
            <Typography size={26} type={Font.GeneralSans_Semibold} color={Colors.brand}>
              {item.name?.charAt(0)}
            </Typography>
          </View>
        )}
      </View>
      <Typography
        size={14}
        type={Font.GeneralSans_Medium}
        color={Colors.textPrimary}
        numberOfLines={1}
        style={styles.categoryTitle}>
        {item.name}
      </Typography>
    </TouchableOpacity>
  );

  const renderServiceItem = ({ item }) => {
    const image = getFirstImageUrl(item.images);
    const hasDiscount = Number(item.discount) > 0 && Number(item.discounted_price) > 0;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.serviceCard}
        onPress={() => navigation.navigate('ServiceDetails', { service: item })}>
        {image ? (
          <Image source={{ uri: image }} style={styles.serviceImage} resizeMode="cover" />
        ) : (
          <View style={[styles.serviceImage, styles.imagePlaceholder]} />
        )}
        {hasDiscount && (
          <View style={styles.discountTag}>
            <Typography size={11} type={Font.GeneralSans_Semibold} color={Colors.white}>
              {Math.round(Number(item.discount))}% OFF
            </Typography>
          </View>
        )}
        <View style={styles.serviceInfo}>
          <Typography
            size={15}
            type={Font.GeneralSans_Semibold}
            color={Colors.textPrimary}
            numberOfLines={2}
            lineHeight={20}
            style={styles.serviceTitle}>
            {item.name}
          </Typography>
          <View style={styles.serviceDurationRow}>
            <Typography size={12} type={Font.GeneralSans_Semibold} color={Colors.star}>
              ★
            </Typography>
            <Typography
              size={13}
              type={Font.GeneralSans_Regular}
              color={Colors.textSecondary}
              numberOfLines={1}
              style={styles.serviceDuration}>
              {Number(item.rating || 0).toFixed(1)}
              {item.category_name ? ` · ${item.category_name}` : ''}
            </Typography>
          </View>
          <View style={styles.serviceDivider} />
          <View style={styles.serviceFooter}>
            <View>
              <Typography
                size={17}
                type={Font.GeneralSans_Semibold}
                color={Colors.textPrimary}>
                {formatPrice(hasDiscount ? item.discounted_price : item.price)}
              </Typography>
              {hasDiscount && (
                <Typography
                  size={12}
                  type={Font.GeneralSans_Regular}
                  color={Colors.textMuted}
                  style={styles.strikePrice}>
                  {formatPrice(item.price)}
                </Typography>
              )}
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.addToCartButton}
              disabled={addingId === item.id}
              onPress={() => handleAddToCart(item)}>
              {addingId === item.id ? (
                <ActivityIndicator size="small" color={Colors.brandDark} />
              ) : (
                <Typography
                  size={13}
                  type={Font.GeneralSans_Semibold}
                  color={Colors.brandDark}>
                  + Add
                </Typography>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBeauticianItem = ({ item }) => {
    const photo = getImageUrl(item.profile_picture);
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.beauticianCard}
        onPress={() => navigation.navigate('ChooseBeauticians', { beauticianId: item.id })}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.beauticianImage} resizeMode="cover" />
          ) : (
            <View style={[styles.beauticianImage, styles.imagePlaceholder]}>
              <Typography size={24} type={Font.GeneralSans_Semibold} color={Colors.brand}>
                {item.name?.charAt(0)}
              </Typography>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Typography
              size={16}
              type={Font.GeneralSans_Semibold}
              color={Colors.textPrimary}
              numberOfLines={1}
              style={styles.beauticianName}>
              {item.name}
            </Typography>
            <View style={styles.beauticianMetaRow}>
              {item.experience != null && (
                <Typography
                  size={13}
                  type={Font.GeneralSans_Regular}
                  color={Colors.textSecondary}>
                  Exp : {item.experience} {Number(item.experience) === 1 ? 'Year' : 'Years'}
                </Typography>
              )}
              {Number(item.rating) > 0 && (
                <View style={styles.ratingChip}>
                  <Typography size={12} type={Font.GeneralSans_Semibold} color={Colors.star}>
                    ★
                  </Typography>
                  <Typography
                    size={12}
                    type={Font.GeneralSans_Semibold}
                    color={Colors.textPrimary}
                    style={{ marginLeft: 3 }}>
                    {Number(item.rating).toFixed(1)}
                  </Typography>
                </View>
              )}
            </View>
            <View style={styles.timeSlotChip}>
              {item.is_online && <View style={styles.onlineDot} />}
              <Image
                source={ImageConstant.Location}
                style={styles.clockIcon}
                resizeMode="contain"
              />
              <Typography
                size={12}
                type={Font.GeneralSans_Medium}
                color={Colors.brandDark}
                numberOfLines={1}
                style={{ marginLeft: 4 }}>
                {[item.city, item.state].filter(Boolean).join(', ') || 'Available'}
              </Typography>
            </View>
          </View>
        </View>
        {item.starting_price != null && (
          <View style={styles.beauticianPriceRow}>
            <Typography size={11} type={Font.GeneralSans_Regular} color={Colors.textMuted}>
              from
            </Typography>
            <Typography
              size={17}
              type={Font.GeneralSans_Semibold}
              color={Colors.textPrimary}>
              {formatPrice(item.starting_price)}
            </Typography>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (

    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* Soft brand wash behind the header */}
      <LinearGradient
        colors={[Colors.lightGreen, Colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topGradient}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand} colors={[Colors.brand]} />
        }
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.locationContainer}
            onPress={() => navigation.navigate(address ? 'SelectLocation' : 'AddNewAddress', { returnTo: 'back' })}>
            <View style={styles.locationIconWrap}>
              <Image
                source={ImageConstant.Location}
                style={styles.locationIcon}
                resizeMode="contain"
              />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Typography
                  size={17}
                  type={Font.GeneralSans_Semibold}
                  color={Colors.textPrimary}>
                  {address ? address.label || 'Home' : 'Add address'}
                </Typography>
                <Image
                  source={ImageConstant.nextarrow}
                  style={styles.locationChevron}
                />
              </View>
              <Typography
                size={13}
                numberOfLines={1}
                type={Font.GeneralSans_Regular}
                color={Colors.textSecondary}>
                {address ? addressLine : 'Set your location to see nearby beauticians'}
              </Typography>
            </View>
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.iconButton}
              onPress={() => navigation.navigate('AddToCart')}>
              <Image
                source={ImageConstant.buket}
                style={styles.bellIcon}
                resizeMode="contain"
              />
              {cartItems > 0 && (
                <View style={styles.headerBadge}>
                  <Typography size={10} type={Font.GeneralSans_Bold} color={Colors.white}>
                    {cartItems > 9 ? '9+' : cartItems}
                  </Typography>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={styles.iconButton}>
              <Image
                source={ImageConstant.notification}
                style={styles.bellIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={{ flex: 1 }}>
            <Input
              mainStyle={{ marginVertical: 0 }}
              source={ImageConstant.search}
              showImage={true}
              placeholder="Search services"
              value={search}
              onChange={setSearch}
              style_inputContainer={styles.searchInput}
              keyboardType="default"
              showTitle={false}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.filterButton}
            onPress={() => setFilterVisible(true)}>
            <Image
              source={ImageConstant.filter}
              style={styles.filterIcon}
              resizeMode="contain"
            />
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Typography size={10} type={Font.GeneralSans_Semibold} color={Colors.white}>
                  {activeFilterCount}
                </Typography>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {showResults ? (
          /* Search / filter results replace the home sections */
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Typography
                size={19}
                type={Font.GeneralSans_Semibold}
                color={Colors.textPrimary}
                numberOfLines={1}
                style={{ flex: 1 }}>
                {search.trim() ? `Results for "${search.trim()}"` : 'Filtered services'}
              </Typography>
              {activeFilterCount > 0 && (
                <TouchableOpacity onPress={() => setFilters(EMPTY_FILTERS)}>
                  <Typography size={14} type={Font.GeneralSans_Semibold} color={Colors.brand}>
                    Clear filters
                  </Typography>
                </TouchableOpacity>
              )}
            </View>
            {searching ? (
              <ActivityIndicator color={Colors.brand} style={{ marginTop: 20 }} />
            ) : searchResults.length ? (
              <FlatList
                data={searchResults}
                renderItem={renderServiceItem}
                keyExtractor={item => `search-${item.id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.servicesList}
              />
            ) : (
              <Typography
                size={14}
                type={Font.GeneralSans_Regular}
                color={Colors.textSecondary}
                style={styles.emptyText}>
                {activeFilterCount > 0
                  ? 'No services match these filters.'
                  : 'No services found. Try another search.'}
              </Typography>
            )}
          </View>
        ) : null}

        {!showResults && loading ? (
          <ActivityIndicator color={Colors.brand} size="large" style={{ marginTop: 60 }} />
        ) : null}

        {/* Promotional Banners (managed from admin) */}
        {!showResults && banners.length > 0 && (
          <FlatList
            data={banners}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => `banner-${item.id}`}
            style={styles.bannerList}
            renderItem={({ item }) => (
              <View style={styles.bannerContainer}>
                <LinearGradient
                  colors={['#DDF8E9', '#B9EFD3']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.banner}>
                  <View style={styles.bannerCircle} />
                  <View style={styles.bannerContent}>
                    <View style={styles.bannerTextContainer}>
                      {!!item.tag && (
                        <View style={styles.bannerTag}>
                          <Typography
                            size={12}
                            type={Font.GeneralSans_Semibold}
                            color={Colors.brandDark}>
                            {item.tag}
                          </Typography>
                        </View>
                      )}
                      <Typography
                        size={34}
                        type={Font.GeneralSans_Bold}
                        color="#0B3B26"
                        numberOfLines={1}
                        style={styles.bannerSubtitle}>
                        {item.title}
                      </Typography>
                      {!!item.subtitle && (
                        <Typography
                          size={13}
                          type={Font.GeneralSans_Regular}
                          color="#2F4A3D"
                          numberOfLines={2}
                          style={styles.bannerDesc}>
                          {item.subtitle}
                        </Typography>
                      )}
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.bookNowButton}
                        onPress={() => openBanner(item)}>
                        <Typography
                          size={13}
                          type={Font.GeneralSans_Semibold}
                          color={Colors.white}>
                          {item.button_text || 'Book Now'}
                        </Typography>
                      </TouchableOpacity>
                    </View>
                    <Image
                      source={getImageUrl(item.image) ? { uri: getImageUrl(item.image) } : ImageConstant.girl}
                      style={styles.bannerImage}
                      resizeMode="contain"
                    />
                  </View>
                </LinearGradient>
              </View>
            )}
          />
        )}

        {/* Our Categories */}
        {!showResults && !loading && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Typography
              size={19}
              type={Font.GeneralSans_Semibold}
              color={Colors.textPrimary}
              style={styles.sectionTitle}>
              Our Categories
            </Typography>
            <TouchableOpacity onPress={()=>navigation.navigate('Categories')}>
              <Typography
                size={14}
                type={Font.GeneralSans_Semibold}
                color={Colors.brand}>
                View All
              </Typography>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categoryList}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
        )}

        {/* View Cart Button */}


        {/* Recommended for you */}
        {!showResults && !loading && recommendedServices.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View>
              <Typography
                size={19}
                type={Font.GeneralSans_Semibold}
                color={Colors.textPrimary}
                style={styles.sectionTitle}>
                Recommended for you
              </Typography>
              <Typography
                size={13}
                type={Font.GeneralSans_Regular}
                color={Colors.textSecondary}
                style={{ marginTop: 2 }}>
                {city ? `Top rated · ${city}` : 'Top rated services'}
              </Typography>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Typography
                size={14}
                type={Font.GeneralSans_Semibold}
                color={Colors.brand}>
                View All
              </Typography>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recommendedServices}
            renderItem={renderServiceItem}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesList}
          />
        </View>
        )}

        {/* Nearby Beautician */}
        {!showResults && !loading && nearbyBeauticians.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Typography
              size={19}
              type={Font.GeneralSans_Semibold}
              color={Colors.textPrimary}
              style={styles.sectionTitle}>
              {city ? 'Nearby Beauticians' : 'Top Beauticians'}
            </Typography>
            <TouchableOpacity onPress={() => navigation.navigate('ChooseBeauticians')}>
              <Typography
                size={14}
                type={Font.GeneralSans_Semibold}
                color={Colors.brand}>
                View All
              </Typography>
            </TouchableOpacity>
          </View>
          <FlatList
            data={nearbyBeauticians}
            renderItem={renderBeauticianItem}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.beauticiansList}
          />

        </View>
        )}

      </ScrollView >
      {cartItems > 0 && (
        <View style={styles.viewCartContainer}>
          <TouchableOpacity
            style={styles.viewCartButton}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('AddToCart')}>
            <View style={styles.viewCartContent}>
              <View style={{ paddingLeft: 15 }}>
                <Typography
                  size={15}
                  type={Font.GeneralSans_Semibold}
                  color={Colors.white}
                  style={styles.viewCartText}>
                  View Cart
                </Typography>
                <Typography
                  size={13}
                  type={Font.GeneralSans_Regular}
                  color={Colors.white}
                  style={styles.viewCartItems}>
                  {cartItems} {cartItems === 1 ? 'Item' : 'Items'}
                </Typography>
              </View>
              <View style={styles.cartBadge}>
                <Typography
                  size={12}
                  type={Font.GeneralSans_Bold}
                  color={Colors.white}>
                  {cartItems}
                </Typography>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <FilterModal
        visible={filterVisible}
        filters={filters}
        categories={categoryList}
        onClose={() => setFilterVisible(false)}
        onApply={next => {
          setFilters(next);
          setFilterVisible(false);
        }}
      />
    </View >

  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topGradient: {
    position: 'absolute',
    width: width,
    height: height * 0.35,
    top: 0,
    left: 0,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  locationIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  locationIcon: {
    width: 16,
    height: 16,
    tintColor: Colors.brand,
  },
  locationChevron: {
    height: 10,
    width: 10,
    marginLeft: 6,
    resizeMode: 'contain',
    tintColor: Colors.textPrimary,
    transform: [{ rotate: '90deg' }],
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  bellIcon: {
    width: 20,
    height: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchInput: {
    height: 52,
    borderRadius: 14,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  filterButton: {
    height: 52,
    width: 52,
    backgroundColor: Colors.brand,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    ...Shadow.sm,
    shadowColor: Colors.brandDark,
    shadowOpacity: 0.2,
  },
  filterIcon: {
    height: 20,
    width: 20,
    tintColor: Colors.white,
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: Colors.brandDark,
    borderWidth: 1.5,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bannerList: {
    marginBottom: 26,
  },
  bannerContainer: {
    width: width,
    paddingHorizontal: 20,
  },
  imagePlaceholder: {
    backgroundColor: Colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  discountTag: {
    position: 'absolute',
    top: 18,
    left: 18,
    backgroundColor: Colors.brand,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  strikePrice: {
    textDecorationLine: 'line-through',
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.brand,
    marginRight: 5,
  },
  emptyText: {
    paddingHorizontal: 20,
  },
  banner: {
    borderRadius: 22,
    overflow: 'hidden',
    height: 170,
  },
  bannerCircle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    right: -50,
    top: -30,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  bannerContent: {
    flexDirection: 'row',
    paddingLeft: 20,
    alignItems: 'center',
    height: '100%',
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  bannerSubtitle: {
    marginBottom: 2,
  },
  bannerDesc: {
    marginBottom: 12,
  },
  bookNowButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.brandDark,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bannerImage: {
    width: 150,
    height: 170,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  },
  sectionContainer: {
    marginBottom: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 0,
  },
  categoriesList: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  categoryCard: {
    width: width * 0.26,
    marginRight: 12,
    alignItems: 'center',
  },
  categoryImageWrap: {
    width: width * 0.26,
    height: width * 0.26,
    borderRadius: 18,
    backgroundColor: Colors.white,
    padding: 4,
    marginBottom: 8,
    ...Shadow.sm,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  categoryTitle: {
    textAlign: 'center',
  },
  viewCartContainer: {
    position: 'absolute',
    bottom: 12,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  viewCartButton: {
    height: 56,
    backgroundColor: Colors.brand,
    borderRadius: 18,
    justifyContent: 'center',
    paddingRight: 8,
    ...Shadow.md,
    shadowColor: Colors.brandDark,
    shadowOpacity: 0.3,
  },
  viewCartContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  viewCartText: {
    textTransform: 'capitalize',
  },
  viewCartItems: {
    textTransform: 'capitalize',
    opacity: 0.9,
  },
  cartBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  servicesList: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  serviceCard: {
    width: width * 0.56,
    backgroundColor: Colors.white,
    borderRadius: 18,
    marginBottom: 10,
    marginRight: 14,
    padding: 10,
    ...Shadow.md,
  },
  serviceImage: {
    width: '100%',
    height: height * 0.14,
    borderRadius: 14,
  },
  serviceInfo: {
    paddingTop: 10,
    paddingHorizontal: 2,
  },
  serviceTitle: {
    marginBottom: 6,
    minHeight: 40,
  },
  serviceDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  clockIcon: {
    width: 12,
    height: 12,
    tintColor: Colors.textMuted,
  },
  serviceDuration: {
    marginLeft: 6,
  },
  serviceDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginBottom: 10,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: Colors.brandSoft,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  beauticiansList: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    paddingBottom: 12,
  },
  beauticianCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.8,
    marginRight: 14,
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 12,
    ...Shadow.md,
  },
  beauticianImage: {
    width: 72,
    height: 72,
    marginRight: 12,
    borderRadius: 14,
  },
  beauticianName: {
    marginBottom: 4,
  },
  beauticianMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF6E5',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  timeSlotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.brandTint,
    borderWidth: 1,
    borderColor: Colors.brandSoft,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  beauticianPriceRow: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginLeft: 8,
  },
});
