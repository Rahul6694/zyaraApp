import {BASE_URL} from '../Backend/env';

// Server root without the trailing /api/ (e.g. http://10.0.2.2:4000)
const BASE_DOMAIN = BASE_URL.replace(/\/api\/?$/, '');

/**
 * Turns an image value from the API into a loadable URL.
 * Uploaded files come back as relative paths ("/uploads/..."), seed data as full URLs.
 */
export const getImageUrl = path => {
  if (!path || typeof path !== 'string') {
    return null;
  }
  if (/^https?:\/\//.test(path)) {
    return path;
  }
  return `${BASE_DOMAIN}${path.startsWith('/') ? '' : '/'}${path}`;
};

/** First image of a JSON images array (sub-categories store images as an array) */
export const getFirstImageUrl = images => {
  let list = images;
  if (typeof images === 'string') {
    try {
      list = JSON.parse(images);
    } catch (e) {
      list = [images];
    }
  }
  return Array.isArray(list) && list.length ? getImageUrl(list[0]) : null;
};

/** "₹1,299" — prices arrive from the API as strings like "1299.00" */
export const formatPrice = value => {
  const amount = Number(value);
  if (!value && value !== 0) {
    return '';
  }
  return `₹${amount.toLocaleString('en-IN', {maximumFractionDigits: amount % 1 ? 2 : 0})}`;
};
