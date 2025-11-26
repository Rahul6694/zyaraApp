import {
  POST_FORM_DATA,
  POST_JSON,
} from './Backend';
import {
  USER_SIGNUP,
  USER_VERIFY_OTP_SIGNUP,
  USER_RESEND_OTP_SIGNUP,
  USER_SEND_OTP,
  USER_VERIFY_OTP,
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

