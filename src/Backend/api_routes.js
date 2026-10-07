// CMS APIs
export const GET_CMS_DATA = 'cms/slug';

// Beautician APIs - Old (keeping for backward compatibility)
export const BEAUTICIAN_SIGNUP = 'beauticians/signup';
export const BEAUTICIAN_VERIFY_OTP_SIGNUP = 'beauticians/verify-otp-signup';
export const BEAUTICIAN_RESEND_OTP_SIGNUP = 'beauticians/resend-otp-signup';
export const BEAUTICIAN_SEND_OTP = 'beauticians/send-otp';
export const BEAUTICIAN_VERIFY_OTP = 'beauticians/verify-otp';

// Beautician APIs - New Step-by-Step Flow
export const BEAUTICIAN_SIGNUP_STEP1 = 'beauticians/signup/step1';
export const BEAUTICIAN_SIGNUP_STEP2 = 'beauticians/signup/step2';
export const BEAUTICIAN_SIGNUP_STEP3 = 'beauticians/signup/step3';
export const BEAUTICIAN_SIGNUP_STEP4 = 'beauticians/signup/step4';

// Customer/User APIs
export const USER_SIGNUP = 'users/signup';
export const USER_VERIFY_OTP_SIGNUP = 'users/verify-otp-signup';
export const USER_RESEND_OTP_SIGNUP = 'users/resend-otp-signup';
export const USER_SEND_OTP = 'users/send-otp';
export const USER_VERIFY_OTP = 'users/verify-otp';
export const USER_LOGOUT = 'users/logout';
export const USER_DELETE_ACCOUNT = 'users/delete-account';
export const USER_PROFILE = 'users/profile';

// Beautician Logout
export const BEAUTICIAN_LOGOUT = 'Beautician/logout';

// Beautician Delete Account
export const BEAUTICIAN_DELETE_ACCOUNT = 'beauticians/delete-account';

// Beautician Profile APIs
export const BEAUTICIAN_PROFILE = 'beauticians/profile';

// Beautician Address APIs
export const BEAUTICIAN_ADDRESSES = 'beauticians/addresses';

// Location APIs
export const LOCATIONS_STATES = 'locations/states';

export const CATEGORIES = 'categories';
export const SUBCATEGORIES = 'sub-categories';

// Customer Address APIs
export const USER_ADDRESSES = 'users/addresses';

// Cart APIs
export const CART = 'cart';

// Booking APIs
export const BOOKINGS = 'bookings';
export const BOOKING_SLOTS = 'bookings/slots';
export const MY_BOOKINGS = 'bookings/my';
export const BEAUTICIAN_BOOKINGS = 'bookings/beautician';

// Beautician discovery & dashboard APIs
export const BEAUTICIANS_AVAILABLE = 'beauticians/available';
export const BEAUTICIAN_GALLERY = 'beauticians/gallery';
export const BEAUTICIAN_DASHBOARD = 'beauticians/dashboard';
export const BEAUTICIAN_ONLINE_STATUS = 'beauticians/online-status';
export const BEAUTICIAN_EARNINGS = 'beauticians/earnings';
export const BEAUTICIAN_PAYOUTS = 'beauticians/payouts';

// Home screen (banners, categories, recommended, beauticians)
export const HOME = 'home';

// Help & support / app config
export const SUPPORT = 'support';
export const APP_CONFIG = 'config';