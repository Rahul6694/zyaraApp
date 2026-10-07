import {
  GET,
  GET_WITH_TOKEN,
  POST_WITH_TOKEN,
  PUT_WITH_TOKEN,
  DELETE_WITH_TOKEN,
  POST_FORM_DATA_WITH_TOKEN,
  getToken,
} from './Backend';
import {
  USER_ADDRESSES,
  CART,
  BOOKINGS,
  BOOKING_SLOTS,
  MY_BOOKINGS,
  BEAUTICIAN_BOOKINGS,
  BEAUTICIANS_AVAILABLE,
  BEAUTICIAN_GALLERY,
  BEAUTICIAN_DASHBOARD,
  BEAUTICIAN_ONLINE_STATUS,
  BEAUTICIAN_EARNINGS,
  BEAUTICIAN_PAYOUTS,
  SUPPORT,
  APP_CONFIG,
  HOME,
  SUBCATEGORIES,
} from './api_routes';

const query = (params = {}) => {
  const parts = Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return parts.length ? `?${parts.join('&')}` : '';
};

// ============================================
// HOME
// ============================================

/**
 * Home screen data
 * @param {string} city - customer's city, used to show nearby beauticians first
 * Response: { banners, categories, recommended, beauticians }
 */
export const getHomeData = (city, onSuccess, onError) => {
  GET(`${HOME}${query({city})}`, onSuccess, onError, {});
};

/** Search catalogue services by name, description or category */
export const searchServices = (search, onSuccess, onError) => {
  GET(`${SUBCATEGORIES}${query({search, limit: 30})}`, onSuccess, onError, {});
};

/**
 * Search + filter catalogue services
 * @param {Object} params - { search, category_id, min_price, max_price, min_rating,
 *   sort: 'newest'|'price_asc'|'price_desc'|'rating'|'discount' }
 */
export const filterServices = (params, onSuccess, onError) => {
  GET(`${SUBCATEGORIES}${query({...params, limit: 50})}`, onSuccess, onError, {});
};

// ============================================
// CUSTOMER ADDRESSES (AddNewAddress / ManageAddress / SelectLocation)
// ============================================

export const getUserAddresses = (onSuccess, onError) => {
  GET_WITH_TOKEN(USER_ADDRESSES, onSuccess, onError);
};

/**
 * Create Customer Address
 * @param {Object} data - { label: 'Home'|'Office'|'Other', name, phone, house_no, road_name,
 *   landmark, address, city, state, pincode, latitude, longitude, is_default }
 */
export const createUserAddress = (data, onSuccess, onError) => {
  POST_WITH_TOKEN(USER_ADDRESSES, data, null, onSuccess, onError);
};

export const updateUserAddress = (addressId, data, onSuccess, onError) => {
  PUT_WITH_TOKEN(`${USER_ADDRESSES}/${addressId}`, data, onSuccess, onError);
};

export const setDefaultUserAddress = (addressId, onSuccess, onError) => {
  PUT_WITH_TOKEN(`${USER_ADDRESSES}/${addressId}/set-default`, {}, onSuccess, onError);
};

export const deleteUserAddress = (addressId, onSuccess, onError) => {
  DELETE_WITH_TOKEN(`${USER_ADDRESSES}/${addressId}`, {}, onSuccess, onError);
};

// ============================================
// CART (AddToCart)
// Every cart call responds with { items, total_items, summary }
// summary = { subtotal, tax_amount, platform_fee, discount_amount, total_amount, number_of_people }
// ============================================

export const getCart = (numberOfPeople, onSuccess, onError) => {
  GET_WITH_TOKEN(`${CART}${query({number_of_people: numberOfPeople})}`, onSuccess, onError);
};

/**
 * Add to Cart
 * @param {Object} data - { sub_category_id } or { service_id }, plus optional quantity
 */
export const addToCart = (data, onSuccess, onError) => {
  POST_WITH_TOKEN(CART, data, null, onSuccess, onError);
};

/** Quantity 0 removes the item */
export const updateCartItem = (cartItemId, quantity, onSuccess, onError) => {
  PUT_WITH_TOKEN(`${CART}/${cartItemId}`, {quantity}, onSuccess, onError);
};

export const removeCartItem = (cartItemId, onSuccess, onError) => {
  DELETE_WITH_TOKEN(`${CART}/${cartItemId}`, {}, onSuccess, onError);
};

export const clearCart = (onSuccess, onError) => {
  DELETE_WITH_TOKEN(CART, {}, onSuccess, onError);
};

// ============================================
// SLOTS, BEAUTICIANS & BOOKINGS (customer)
// ============================================

/**
 * Get Time Slots for a date (SlotBooking)
 * @param {string} date - 'YYYY-MM-DD'
 * @param {number} beauticianId - optional, marks that beautician's booked slots unavailable
 * Response: { date, slots: [{ value: '14:00-14:30', label: '02:00 pm - 02:30 pm', available }] }
 */
export const getBookingSlots = (date, beauticianId, onSuccess, onError) => {
  GET(`${BOOKING_SLOTS}${query({date, beautician_id: beauticianId})}`, onSuccess, onError, {});
};

/**
 * Get Available Beauticians (ChooseBeauticians)
 * @param {Object} params - { date, time_slot, search, city, category_id } (all optional)
 * Response: { data, recommended, others }
 */
export const getAvailableBeauticians = (params, onSuccess, onError) => {
  GET(`${BEAUTICIANS_AVAILABLE}${query(params)}`, onSuccess, onError, {});
};

export const getBeauticianPublicProfile = (beauticianId, onSuccess, onError) => {
  GET(`beauticians/${beauticianId}/public`, onSuccess, onError, {});
};

/**
 * Create Booking (BookingRequest)
 * @param {Object} data - {
 *   booking_date: 'YYYY-MM-DD', time_slot: '14:00-14:30', number_of_people,
 *   beautician_id (optional),
 *   address_id  OR  house_no, road_name, city, state, pincode,
 *   contact_name, contact_phone, contact_email, special_instructions,
 *   payment_method: 'cash'|'online',
 *   items (optional) - [{ sub_category_id | service_id, quantity }]; when omitted the cart is booked and cleared
 * }
 */
export const createBooking = (data, onSuccess, onError) => {
  POST_WITH_TOKEN(BOOKINGS, data, null, onSuccess, onError);
};

/** @param {string} status - optional, comma separated e.g. 'pending,accepted' */
export const getMyBookings = (status, page, onSuccess, onError) => {
  GET_WITH_TOKEN(`${MY_BOOKINGS}${query({status, page})}`, onSuccess, onError);
};

export const getBookingDetails = (bookingId, onSuccess, onError) => {
  GET_WITH_TOKEN(`${BOOKINGS}/${bookingId}`, onSuccess, onError);
};

export const cancelBooking = (bookingId, reason, onSuccess, onError) => {
  PUT_WITH_TOKEN(`${BOOKINGS}/${bookingId}/cancel`, {reason}, onSuccess, onError);
};

/** @param {Object} data - { rating: 1-5, comment } (completed bookings only) */
export const addBookingReview = (bookingId, data, onSuccess, onError) => {
  POST_WITH_TOKEN(`${BOOKINGS}/${bookingId}/review`, data, null, onSuccess, onError);
};

// ============================================
// BEAUTICIAN SIDE (BeauticianHome)
// ============================================

/** Response: { profile, stats, earnings, upcoming } */
export const getBeauticianDashboard = (onSuccess, onError) => {
  GET_WITH_TOKEN(BEAUTICIAN_DASHBOARD, onSuccess, onError);
};

export const setBeauticianOnlineStatus = (isOnline, onSuccess, onError) => {
  PUT_WITH_TOKEN(BEAUTICIAN_ONLINE_STATUS, {is_online: isOnline}, onSuccess, onError);
};

export const getBeauticianBookings = (status, page, onSuccess, onError) => {
  GET_WITH_TOKEN(`${BEAUTICIAN_BOOKINGS}${query({status, page})}`, onSuccess, onError);
};

/**
 * Update Booking Status (beautician)
 * @param {string} status - 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled'
 */
export const updateBeauticianBookingStatus = (bookingId, status, reason, onSuccess, onError) => {
  PUT_WITH_TOKEN(`${BEAUTICIAN_BOOKINGS}/${bookingId}/status`, {status, reason}, onSuccess, onError);
};

export const getBeauticianEarnings = (onSuccess, onError) => {
  GET_WITH_TOKEN(BEAUTICIAN_EARNINGS, onSuccess, onError);
};

/** Withdraw Earnings - amount optional (defaults to full available balance) */
export const requestBeauticianPayout = (amount, onSuccess, onError) => {
  POST_WITH_TOKEN(BEAUTICIAN_PAYOUTS, amount ? {amount} : {}, null, onSuccess, onError);
};

// ============================================
// HELP & SUPPORT / CONFIG (customer and beautician)
// ============================================

/** @param {Object} data - { subject, message, booking_id (optional) } */
export const createSupportTicket = (data, onSuccess, onError) => {
  POST_WITH_TOKEN(SUPPORT, data, null, onSuccess, onError);
};

export const getMySupportTickets = (onSuccess, onError) => {
  GET_WITH_TOKEN(`${SUPPORT}/my`, onSuccess, onError);
};

/** Public pricing & support contact: tax_percent, platform_fee, slot times, support_email... */
export const getAppConfig = (onSuccess, onError) => {
  GET(APP_CONFIG, onSuccess, onError, {});
};

// ============================================
// BEAUTICIAN SERVICES (Add Service)
// ============================================

export const getMyServices = (onSuccess, onError) => {
  GET_WITH_TOKEN('services/my-services?limit=100', onSuccess, onError);
};

/**
 * Create a service offered by the logged-in beautician
 * @param {FormData} formData - service_name, category_id, price, discount, duration (mins),
 *   service_type ('at_salon'|'home_visit'|'online'), description, status ('draft'|'published'), cover_photo (file)
 */
export const createBeauticianService = (formData, onSuccess, onError) => {
  POST_FORM_DATA_WITH_TOKEN('services', formData, getToken(), onSuccess, onError);
};

export const deleteBeauticianService = (serviceId, onSuccess, onError) => {
  DELETE_WITH_TOKEN(`services/${serviceId}`, {}, onSuccess, onError);
};

// ============================================
// BEAUTICIAN GALLERY (work photos)
// ============================================

/** Public: a beautician's gallery. Response: { data: [{ id, image, caption, created_at }] } */
export const getBeauticianGallery = (beauticianId, onSuccess, onError) => {
  GET(`beauticians/${beauticianId}/gallery`, onSuccess, onError, {});
};

/** Logged-in beautician's own gallery. Response: { data, max_images } */
export const getMyGallery = (onSuccess, onError) => {
  GET_WITH_TOKEN(BEAUTICIAN_GALLERY, onSuccess, onError);
};

/**
 * Upload photos to the logged-in beautician's gallery
 * @param {FormData} formData - images (up to 10 files per request), caption (optional)
 */
export const uploadGalleryImages = (formData, onSuccess, onError) => {
  POST_FORM_DATA_WITH_TOKEN(BEAUTICIAN_GALLERY, formData, getToken(), onSuccess, onError);
};

export const deleteGalleryImage = (imageId, onSuccess, onError) => {
  DELETE_WITH_TOKEN(`${BEAUTICIAN_GALLERY}/${imageId}`, {}, onSuccess, onError);
};
