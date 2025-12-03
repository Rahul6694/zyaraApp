import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { Colors } from '../../Constants/Colors';
import { Font } from '../../Constants/Font';
import Typography from '../../Component/UI/Typography';
import { ImageConstant } from '../../Constants/ImageConstant';
import { logOut } from '../../Redux/action';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Static Data
const categoriesData = [
  {
    id: 1,
    title: `Hair ${'\n'} Services`,
    image: ImageConstant.user1,
  },
  {
    id: 2,
    title: 'Skin Care & Facial',
    image: ImageConstant.user2,
  },
  {
    id: 3,
    title: 'Nail Care Services',
    image: ImageConstant.user5,
  },
  {
    id: 4,
    title: 'Skin Care & Facial',
    image: ImageConstant.user4,
  },
];

const recommendedServices = [
  {
    id: 1,
    title: 'Korean Luxe Manicure & Pedicure',
    duration: '1 hr 50 mins',
    price: '₹999',
    image: ImageConstant.user1,
  },
  {
    id: 2,
    title: 'Korean Glow Facial Clean Up',
    duration: '1 hr 15 mins',
    price: '₹999',
    image: ImageConstant.user2,
  },
];

const nearbyBeauticians = [
  {
    id: 1,
    name: 'Anita Sharma',
    experience: 'Exp : 6 Years',
    rating: 4.5,
    price: '₹749',
    timeSlot: '02:30 PM - 02:45 PM',
    image: ImageConstant.user1,
  },
  {
    id: 2,
    name: 'Priya Patel',
    experience: 'Exp : 4 Years',
    rating: 4.8,
    price: '₹899',
    timeSlot: '03:00 PM - 03:15 PM',
    image: ImageConstant.user2,
  },
  {
    id: 3,
    name: 'Sneha Desai',
    experience: 'Exp : 8 Years',
    rating: 4.7,
    price: '₹999',
    timeSlot: '03:30 PM - 03:45 PM',
    image: ImageConstant.user3,
  },
  {
    id: 4,
    name: 'Meera Joshi',
    experience: 'Exp : 5 Years',
    rating: 4.6,
    price: '₹849',
    timeSlot: '04:00 PM - 04:15 PM',
    image: ImageConstant.user4,
  },
  {
    id: 5,
    name: 'Kavita Shah',
    experience: 'Exp : 7 Years',
    rating: 4.9,
    price: '₹1099',
    timeSlot: '04:30 PM - 04:45 PM',
    image: ImageConstant.user5,
  },
];

const Home = () => {

  const [cartItems, setCartItems] = useState(0);
  const insets = useSafeAreaInsets();

  const renderCategoryItem = ({ item }) => (
    <LinearGradient
  colors={["#FFFFFF", "#FFF8F8"]}
  start={{ x: 0, y: 0 }}
  end={{ x: 0, y: 1 }}
  style={{
    paddingBottom:10
  }}
>


    <TouchableOpacity style={styles.categoryCard}>
      <Image source={item.image} style={styles.categoryImage} resizeMode="cover" />
      <Typography
        size={16}
        type={Font.GeneralSans_Medium}
        color="#090909"
        style={styles.categoryTitle}>
        {item.title}
      </Typography>
    </TouchableOpacity>
    </LinearGradient>
  );

  const renderServiceItem = ({ item }) => (
    <View style={styles.serviceCard}>
      <Image source={item.image} style={styles.serviceImage} resizeMode="cover" />
      <View style={styles.serviceInfo}>
        <Typography
          size={16}
          type={Font.GeneralSans_Semibold}
          color="#242424"
          style={styles.serviceTitle}>
          {item.title}
        </Typography>
        <View style={styles.serviceDurationRow}>
          <Image
            source={ImageConstant.clock}
            style={styles.clockIcon}
            resizeMode="contain"
          />
          <Typography
            size={15}
            type={Font.GeneralSans_Regular}
            color={Colors.black}
            style={styles.serviceDuration}>
            {item.duration}
          </Typography>
        </View>
        <View style={styles.serviceDivider} />
        <View style={styles.serviceFooter}>
          <Typography
            size={16}
            type={Font.GeneralSans_Semibold}
            color={Colors.black}>
            {item.price}
          </Typography>
          <TouchableOpacity style={styles.addToCartButton} onPress={()=>setCartItems(cartItems+1)}>
            <Typography
              size={16}
              type={Font.GeneralSans_Medium}
              color={Colors.zyaraGreen}
              style={styles.addToCartText}>
              Add To Cart
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderBeauticianItem = ({ item }) => (
    <View style={styles.beauticianCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>


        <Image source={item.image} style={styles.beauticianImage} resizeMode="cover" />
        <View>
          <Typography
            size={16}
            type={Font.GeneralSans_Semibold}
            color="#242424"
            style={styles.beauticianName}>
            {item.name}
          </Typography>
          <Typography
            size={16}
            type={Font.GeneralSans_Regular}
            color="#191919"
            style={styles.beauticianExp}>
            {item.experience}
            <Typography
              size={14}
              type={Font.GeneralSans_Regular}
              color="#191919">
              {''} ⭐{item.rating}
            </Typography>
          </Typography>
          <View style={styles.beauticianRatingRow}>

            <View style={styles.dot} />
            <Typography
              size={14}
              type={Font.GeneralSans_Regular}
              color={Colors.black}>
              {item.timeSlot}
            </Typography>
            <View style={styles.dot} />
          </View>
        </View>
      </View>
      <View style={styles.beauticianPriceRow}>
        <Typography
          size={18}
          type={Font.GeneralSans_Semibold}
          color={Colors.black}>
          {item.price}
        </Typography>
      </View>

    </View>
  );

  return (

    <View style={[styles.container, {paddingTop:insets.top}]}>

      {/* Top Gradient */}
      <LinearGradient
        colors={[ Colors.lightGreen,Colors.white]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topGradient}
      />

      {/* Middle Gradient */}
      <LinearGradient
        colors={[Colors.white, '#FFF8F8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.middleGradient}
      />

      {/* Bottom Gradient */}
      <LinearGradient
        colors={[Colors.white, Colors.lightGreen]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.bottomGradient}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>

            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                <Image
                  source={ImageConstant.Location}
                  style={styles.locationIcon}
                  resizeMode="contain"
                />
                <Typography
                  size={18}
                  type={Font.GeneralSans_Semibold}
                  color={Colors.black}>
                  Home
                </Typography>

                <Image
                  source={ImageConstant.nextarrow}
                  style={{
                    height: 14,
                    width: 27,
                    marginTop: 3,
                    resizeMode: "contain",
                    transform: [{ rotate: "90deg" }],
                  }}
                />

              </View>
              <Typography
                size={15}
                type={Font.GeneralSans_Regular}
                color={Colors.black}>
                123, Green Park Apartments
              </Typography>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.notificationContainer}>
              <Image
                source={ImageConstant.buket}
                style={styles.bellIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationContainer}>
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
          <View style={styles.searchBar}>
            <Image
              source={ImageConstant.search}
              style={styles.searchIcon}
              resizeMode="contain"
            />
            <Typography
              size={16}
              type={Font.GeneralSans_Regular}
              color="#656565"
              style={styles.searchPlaceholder}>
              search
            </Typography>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Image
              source={ImageConstant.filter}
              style={styles.filterIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Promotional Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerTextContainer}>
                <Typography
                  size={16}
                  type={Font.GeneralSans_Regular}
                  color="#002122"
                  style={styles.bannerTitle}>
                  Makeup & Bridal
                </Typography>
                <Typography
                  size={38}
                  type={Font.GeneralSans_Bold}
                  color="#36430A"
                  style={styles.bannerSubtitle}>
                  Flat 30%
                </Typography>
                <Typography
                  size={14}
                  type={Font.GeneralSans_Regular}
                  color={Colors.black}
                  style={styles.bannerDesc}>
                  Manicure + Pedicure Combo
                </Typography>
                <TouchableOpacity>
                  <Typography
                    size={16}
                    type={Font.GeneralSans_Semibold}
                    color="#12B347"
                    style={styles.bookNowText}>
                    Book Now
                  </Typography>
                </TouchableOpacity>
              </View>
              <Image
                source={ImageConstant.girl}
                style={styles.bannerImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* Our Categories */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Typography
              size={20}
              type={Font.GeneralSans_Semibold}
              color="#000707"
              style={styles.sectionTitle}>
              Our Categories
            </Typography>
            <TouchableOpacity>
              <Typography
                size={16}
                type={Font.GeneralSans_Medium}
                color={Colors.zyaraGreen}>
                View All
              </Typography>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categoriesData}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* View Cart Button */}
       

        {/* Recommended for you */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Typography
              size={20}
              type={Font.GeneralSans_Semibold}
              color="#000707"
              style={styles.sectionTitle}>
              Recommended for you
            </Typography>
            <TouchableOpacity>
              <Typography
                size={16}
                type={Font.GeneralSans_Medium}
                color={Colors.zyaraGreen}>
                View All
              </Typography>
            </TouchableOpacity>
          </View>
          <View style={styles.locationRow}>
            <Typography
              size={16}
              type={Font.GeneralSans_Regular}
              color={Colors.black}>
              in your area
            </Typography>
            <Typography
              size={16}
              type={Font.GeneralSans_Regular}
              color={Colors.black}>
              Surat, Gujarat
            </Typography>
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

        {/* Nearby Beautician */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Typography
              size={20}
              type={Font.GeneralSans_Semibold}
              color="#000707"
              style={styles.sectionTitle}>
              Nearby Beautician
            </Typography>
            <TouchableOpacity>
              <Typography
                size={16}
                type={Font.GeneralSans_Medium}
                color={Colors.zyaraGreen}>
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
        
      </ScrollView>
      {cartItems>0 && (
          <View style={styles.viewCartContainer}>
            <TouchableOpacity style={styles.viewCartButton}>
              <View style={styles.viewCartContent}>
                <View style={{paddingLeft:15}}>
                  <Typography
                    size={15}
                    type={Font.GeneralSans_Semibold}
                    color={Colors.white}
                    style={styles.viewCartText}>
                    View Carts
                  </Typography>
                  <Typography
                    size={13}
                    type={Font.GeneralSans_Regular}
                    color={Colors.white}
                    style={styles.viewCartItems}>
                    {cartItems} Items
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
    </View>

  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topGradient: {
    position: 'absolute',
    width: width,
    height: height * 0.39,
    top: 0,
    left: 0,
  },
  middleGradient: {
    position: 'absolute',
    width: width,
    height: height * 0.17,
    top: height * 0.51,
    left: 0,
  },
  bottomGradient: {
    position: 'absolute',
    width: width,
    height: height * 0.28,
    bottom: height * 0.096,
    left: 0,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: width * 0.05,
    paddingTop:10,
    paddingBottom: height * 0.022,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    width: width * 0.032,
    height: width * 0.032,
    marginRight: width * 0.019,
    tintColor: Colors.zyaraGreen,
  },
  notificationContainer: {
    position: 'relative',
  },
  logoutButton: {
    backgroundColor: Colors.zyaraGreen,
    borderRadius: width * 0.04,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.008,
  },
  bellIcon: {
    width: width * 0.056,
    height: width * 0.056,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.022,
    gap: width * 0.023,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0, 178, 114, 0.2)',
    borderRadius: width * 0.028,
    paddingHorizontal: width * 0.047,
    height: height * 0.065,
  },
  searchIcon: {
    width: width * 0.037,
    height: width * 0.037,
    marginRight: width * 0.023,
    tintColor: '#434B67',
  },
  searchPlaceholder: {
    flex: 1,
  },
  filterButton: {
    width: width * 0.141,
    height: width * 0.141,
    backgroundColor: Colors.zyaraGreen,
    borderRadius: width * 0.028,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    width: width * 0.047,
    height: width * 0.047,
    tintColor: Colors.white,
  },
  bannerContainer: {
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.032,
  },
  banner: {
    backgroundColor: '#DBFBD1',
    borderRadius: width * 0.035,
    overflow: 'hidden',
    height: height * 0.193,
  },
  bannerContent: {
    flexDirection: 'row',
    padding: width * 0.047,
    alignItems: 'center',
    height: '100%',
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerTitle: {
    marginBottom: 5,
  },
  bannerSubtitle: {
    marginBottom: 5,
  },
  bannerDesc: {
    marginBottom: 10,
    textTransform: 'lowercase',
  },
  bookNowText: {
    textDecorationLine: 'underline',
  },
  bannerImage: {
    width: 166,
    height: 166,
    resizeMode: 'contain',

  },
  sectionContainer: {
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.032,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.016,
  },
  sectionTitle: {
    marginBottom: 0,
  },
  locationRow: {
    flexDirection: 'row',
    gap: width * 0.012,
    marginBottom: height * 0.016,
  },
  categoriesList: {
 
    paddingRight: width * 0.047,
   
  },
  categoryCard: {
    width: width * 0.28,
    marginRight: width * 0.029,
    alignItems: 'center',
  },
  categoryImage: {
    width: width * 0.28,
    height: width * 0.22,
    borderRadius: width * 0.028,
    marginBottom: height * 0.011,
    borderWidth: 2,
    borderColor: '#FFDDDD',
  },
  categoryTitle: {
    textAlign: 'center',
  },
  viewCartContainer: {
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.011,
    alignItems: 'center',
    position:'absolute', bottom:0, zIndex:1, alignSelf:'center'
  },
  viewCartButton: {
width:'65%',
    height: height * 0.049,
    backgroundColor: Colors.zyaraGreen,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.zyaraGreen,
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  cartBadge: {
    width: width * 0.105,
    height: width * 0.105,
    borderRadius: width * 0.053,
    backgroundColor: '#05A66C',
    borderWidth: 1,
    borderColor: '#3ABF5F',
    alignItems: 'center',
    justifyContent: 'center',


  },
  servicesList: {
    paddingRight: width * 0.047,
  },
  serviceCard: {
    width: width * 0.503,
    backgroundColor: Colors.white,
    borderRadius: width * 0.028,
    marginBottom: height * 0.016,
    marginRight: width * 0.035,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    padding: width * 0.035,
  },
  serviceImage: {
    width: '100%',
    height: height * 0.135,
    borderTopLeftRadius: width * 0.023,
    borderTopRightRadius: width * 0.023,
  },
  serviceInfo: {
    paddingVertical: height * 0.011,
  },
  serviceTitle: {
    marginBottom: height * 0.009,
  },
  serviceDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.011,
  },
  clockIcon: {
    width: width * 0.028,
    height: width * 0.028,
    marginRight: width * 0.012,
    tintColor: '#8C8C8C',
  },
  serviceDuration: {
    marginLeft: width * 0.012,
  },
  serviceDivider: {
    height: 1,
    backgroundColor: '#DDDDDD',
    marginBottom: height * 0.011,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addToCartButton: {
    paddingHorizontal: width * 0.023,
    paddingVertical: height * 0.005,
  },
  addToCartText: {
    textTransform: 'uppercase',
  },
  beauticiansList: {
    paddingRight: width * 0.047,
  },
  beauticianCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.772,
    marginRight: width * 0.027,
    backgroundColor: Colors.white,
    borderRadius: width * 0.028,
    padding: width * 0.023,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  beauticianImage: {
    width: width * 0.195,
    height: width * 0.195,
    marginRight: width * 0.035,
    borderRadius: width * 0.023,
  },
  beauticianName: {
    marginBottom: height * 0.005,
  },
  beauticianExp: {
    marginBottom: height * 0.005,
  },
  beauticianRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  beauticianPriceRow: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: height * 0.005,
  },
});
