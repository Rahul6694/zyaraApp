import {
  POST_FORM_DATA,
  POST_JSON,
  POST_WITH_TOKEN,
  POST_FORM_DATA_WITH_TOKEN,
} from './Backend';
import {
  BEAUTICIAN_SIGNUP,
  BEAUTICIAN_VERIFY_OTP_SIGNUP,
  BEAUTICIAN_RESEND_OTP_SIGNUP,
  BEAUTICIAN_SEND_OTP,
  BEAUTICIAN_VERIFY_OTP,
  BEAUTICIAN_SIGNUP_STEP1,
  BEAUTICIAN_SIGNUP_STEP2,
  BEAUTICIAN_SIGNUP_STEP3,
  BEAUTICIAN_SIGNUP_STEP4,
} from './api_routes';

/**
 * Beautician Signup API
 * @param {FormData} formData - Form data containing:
 *   - name
 *   - number
 *   - email
 *   - business_name
 *   - address
 *   - experience
 *   - account_holder_name
 *   - bank_name
 *   - account_number
 *   - ifsc_code
 *   - city
 *   - state
 *   - bio
 *   - profile_image (optional)
 *   - cover_image (optional)
 *   - id_proof_front (optional)
 *   - id_proof_back (optional)
 *   - license_certificate (optional)
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const beauticianSignup = (formData, onSuccess, onError) => {
  POST_FORM_DATA(
    BEAUTICIAN_SIGNUP,
    formData,
    onSuccess,
    onError,
  );
};

/**
 * Beautician Verify OTP for Signup
 * @param {Object} data - { number: string, otp: string }
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const beauticianVerifyOTPSignup = (data, onSuccess, onError) => {
  POST_JSON(
    BEAUTICIAN_VERIFY_OTP_SIGNUP,
    data,
    onSuccess,
    onError,
  );
};

/**
 * Beautician Resend OTP for Signup
 * @param {Object} data - { number: string }
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const beauticianResendOTPSignup = (data, onSuccess, onError) => {
  POST_JSON(
    BEAUTICIAN_RESEND_OTP_SIGNUP,
    data,
    onSuccess,
    onError,
  );
};

/**
 * Beautician Send OTP for Login
 * @param {Object} data - { user_type: string, phone: string }
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const beauticianSendOTP = (data, onSuccess, onError) => {
  POST_JSON(
    BEAUTICIAN_SEND_OTP,
    data,
    onSuccess,
    onError,
  );
};

/**
 * Beautician Verify OTP for Login
 * @param {Object} data - { number: string, otp: string }
 * @param {Function} onSuccess - Success callback (receives token in response)
 * @param {Function} onError - Error callback
 */
export const beauticianVerifyOTP = (data, onSuccess, onError) => {
  POST_JSON(
    BEAUTICIAN_VERIFY_OTP,
    data,
    onSuccess,
    onError,
  );
};

/**
 * Beautician Signup Step 1 - Upload Profile Picture, Banner & Bio
 * @param {FormData} formData - Form data containing:
 *   - profile_picture (file)
 *   - banner (file)
 *   - bio (text)
 * @param {string} token - Bearer token from verify-otp
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const beauticianSignupStep1 = (formData, token, onSuccess, onError) => {
  POST_FORM_DATA_WITH_TOKEN(
    BEAUTICIAN_SIGNUP_STEP1,
    formData,
    token,
    onSuccess,
    onError,
  );
};

/**
 * Beautician Signup Step 2 - Profile Details
 * @param {Object} data - JSON containing:
 *   - beautician_id (number)
 *   - name (string)
 *   - number (string)
 *   - email (string)
 *   - business_name (string)
 *   - city (string)
 *   - state (string)
 *   - address (string)
 *   - experience (number)
 * @param {string} token - Bearer token
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const beauticianSignupStep2 = (data, token, onSuccess, onError) => {
  POST_WITH_TOKEN(
    BEAUTICIAN_SIGNUP_STEP2,
    data,
    token,
    onSuccess,
    onError,
  );
};

/**
 * Beautician Signup Step 3 - ID Proofs & Certificates
 * @param {FormData} formData - Form data containing:
 *   - id_proof_front (file)
 *   - id_proof_back (file)
 *   - beauty_certificates (file)
 * @param {string} token - Bearer token
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const beauticianSignupStep3 = (formData, token, onSuccess, onError) => {
  POST_FORM_DATA_WITH_TOKEN(
    BEAUTICIAN_SIGNUP_STEP3,
    formData,
    token,
    onSuccess,
    onError,
  );
};

/**
 * Beautician Signup Step 4 - Bank Details
 * @param {Object} data - JSON containing:
 *   - account_holder_name (string)
 *   - bank_name (string)
 *   - account_number (string)
 *   - ifsc_code (string)
 * @param {string} token - Bearer token
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const beauticianSignupStep4 = (data, token, onSuccess, onError) => {
  POST_WITH_TOKEN(
    BEAUTICIAN_SIGNUP_STEP4,
    data,
    token,
    onSuccess,
    onError,
  );
};

