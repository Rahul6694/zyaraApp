import {
  POST_FORM_DATA,
  POST_JSON,
  POST_WITH_TOKEN,
  DELETE_WITH_TOKEN,
  GET_WITH_TOKEN,
  PUT_FORM_DATA,
} from './Backend';
import {
  USER_SIGNUP,
  USER_VERIFY_OTP_SIGNUP,
  USER_RESEND_OTP_SIGNUP,
  USER_SEND_OTP,
  USER_VERIFY_OTP,
  USER_LOGOUT,
  USER_DELETE_ACCOUNT,
  USER_PROFILE,
} from './api_routes';

/**
 * Customer/User Signup API
 * @param {FormData} formData - Form data containing:
 *   - name
 *   - email
 *   - number
 *   - profile_picture (optional)
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const customerSignup = (formData, onSuccess, onError) => {
  POST_FORM_DATA(
    USER_SIGNUP,
    formData,
    onSuccess,
    onError,
  );
};

/**
 * Customer/User Verify OTP for Signup
 * @param {Object} data - { number: string, otp: string }
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const customerVerifyOTPSignup = (data, onSuccess, onError) => {
  POST_JSON(
    USER_VERIFY_OTP_SIGNUP,
    data,
    onSuccess,
    onError,
  );
};

/**
 * Customer/User Resend OTP for Signup
 * @param {Object} data - { number: string }
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const customerResendOTPSignup = (data, onSuccess, onError) => {
  POST_JSON(
    USER_RESEND_OTP_SIGNUP,
    data,
    onSuccess,
    onError,
  );
};

/**
 * Customer/User Send OTP for Login
 * @param {Object} data - { user_type: string, phone: string }
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const customerSendOTP = (data, onSuccess, onError) => {
  POST_JSON(
    USER_SEND_OTP,
    data,
    onSuccess,
    onError,
  );
};

/**
 * Customer/User Verify OTP for Login
 * @param {Object} data - { user_type: string, phone: string, otp: string }
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const customerVerifyOTP = (data, onSuccess, onError) => {
  POST_JSON(
    USER_VERIFY_OTP,
    data,
    onSuccess,
    onError,
  );
};

/**
 * Customer/User Logout
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const customerLogout = (onSuccess, onError) => {
  POST_WITH_TOKEN(
    USER_LOGOUT,
    {},
    null, // Token will be fetched from store automatically
    onSuccess,
    onError,
  );
};

/**
 * Customer/User Delete Account
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const customerDeleteAccount = (onSuccess, onError) => {
  DELETE_WITH_TOKEN(
    USER_DELETE_ACCOUNT,
    {},
    onSuccess,
    onError,
  );
};

/**
 * Get User Profile
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const getUserProfile = (onSuccess, onError) => {
  GET_WITH_TOKEN(
    USER_PROFILE,
    onSuccess,
    onError,
  );
};

/**
 * Update User Profile
 * @param {FormData} formData - Form data containing:
 *   - profile_picture (file, optional)
 *   - name (string, optional)
 *   - email (string, optional)
 *   - number (string, optional)
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const updateUserProfile = (formData, onSuccess, onError) => {
  PUT_FORM_DATA(
    USER_PROFILE,
    formData,
    onSuccess,
    onError,
  );
};

