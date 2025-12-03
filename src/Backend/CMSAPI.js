import {
  GET_WITH_TOKEN,
} from './Backend';
import {
  GET_CMS_DATA,
} from './api_routes';

/**
 * Get CMS Data by Slug
 * @param {string} slug - CMS page slug (e.g., 'help-support', 'terms-conditions')
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const getCMSData = (slug, onSuccess, onError) => {
  GET_WITH_TOKEN(
    `${GET_CMS_DATA}/${slug}`,
    onSuccess,
    onError,
  );
};

