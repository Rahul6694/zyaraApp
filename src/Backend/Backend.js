import SimpleToast from 'react-native-simple-toast';
import {BASE_URL} from './env';
import {createRef} from 'react';
import axios from 'axios';

// Import store - handle case where store might not be initialized
let store = null;
try {
  // Try to import store, but it might be commented out
  const storeModule = require('../Redux/store');
  // Check if store is exported (not commented out)
  if (storeModule && storeModule.store) {
    store = storeModule.store;
  }
} catch (error) {
  // Store file might not export store or might be commented out
  console.warn('Redux store not available - API calls will work without authentication token');
}

export const toastRef = createRef();
const errorHandling = {
  validateStatus: function (status) {
    return status >= 200 && status < 501; // default
  },
};

export const API = BASE_URL;
// Get token lazily to avoid errors if store is not initialized
export const getToken = () => {
  try {
    return store?.getState()?.Token || null;
  } catch (error) {
    return null;
  }
};
export const token = getToken(); // For backward compatibility, but may be null
export const statusMessage = {
  400: 'Invalid request format.',
  401: 'Invalid API Key.',
  403: 'The request is forbidden.',
  404: 'The specified resource could not be found.',
  405: 'You tried to access the resource with an invalid method.',
  500: 'We had a problem with our server. Try again later.',
  503: "We're temporarily offline for maintenance. Please try again later.",
};

const responseBack = (data, msg, status) => {
  return {
    data,
    msg,
    status,
  };
};

export const POST_FORM_DATA = async (
  route,
  body,
  onSuccess = () => {},
  onError = () => {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
  Content = 'multipart/form-data',
) => {
  try {
    await axios({
      method: 'post',
      url: `${API}${route}`,
      data: body,
      headers: {
        'Content-Type': Content,
        authorization: `Bearer ${getToken()}`,
      },
      ...errorHandling,
    })
      .then(res => {
        if (res?.status == 200 || res?.status == 201) {
          onSuccess(res?.data);
        } else {
          if (res?.status == 400) {
            onError(res?.data);
          } else {
            onError(res);
          }
          //
        }
      })
      .catch(err => {
        console.error(err, '----error ,api catch');
        onError(err);
      });
  } catch (error) {
    onFail({data: null, msg: 'Network Error', status: 'error'});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};

export const POST = async (
  route,
  body = {},
  onSuccess = () => {},
  onError = () => {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
) => {
  try {
    axios({
      method: 'post',
      url: `${API}${route}`,
      data: body,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
      validateStatus: function (status) {
        return status >= 200 && status < 501; // default
      },
    })
      .then(res => {
        if (res?.status == 200) {
          if (!!res?.data) {
            console.log('POST Success - calling onSuccess');
            onSuccess(res?.data);
          } else {
            console.log('POST Error - no data in response');
            onError(res?.data);
          }
        } else {
          console.log('POST Error - status not 200:', res?.status);
          onError(res);
        }
      })
      .catch(err => {
        console.error(err);
        onError(err);
      });
  } catch (error) {
    onFail({data: null, msg: 'Network Error', status: 'error'});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};

export const POST_JSON = async (
  route,
  body = {},
  onSuccess = () => {},
  onError = () => {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
) => {
  try {
    axios({
      method: 'post',
      url: `${API}${route}`,
      data: body,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      validateStatus: function (status) {
        return status >= 200 && status < 501; // default
      },
    })
      .then(res => {
        if (res?.status == 200 || res?.status == 201) {
          if (!!res?.data) {
            console.log('POST_JSON Success - calling onSuccess');
            onSuccess(res?.data);
          } else {
            console.log('POST_JSON Error - no data in response');
            onError(res?.data);
          }
        } else {
          console.log('POST_JSON Error - status not 200:', res?.status);
          onError(res);
        }
      })
      .catch(err => {
        console.error(err);
        onError(err);
      });
  } catch (error) {
    onFail({data: null, msg: 'Network Error', status: 'error'});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};

export const GET = async (
  route,
  onSuccess = () => {},
  onError = () => {},
  headers = {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
) => {
  try {
    axios({
      method: 'get',
      url: `${API}${route}`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...errorHandling,
    })
      .then(res => {
        if (res?.status == 200) {
          onSuccess(res?.data);
        } else {
          if (res.status in statusMessage) {
            onError({
              data: null,
              message: statusMessage[res.status],
              status: false,
            });
          }
          onError(res);
        }
      })
      .catch(err => {
        onError(err);
      });
  } catch (error) {
    onFail({data: null, msg: 'Network Error', status: 'error'});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};

export const POST_WITH_TOKEN = async (
  route,
  body = {},
  token = null,
  onSuccess = () => {},
  onError = () => {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
) => {
  try {
    await axios({
      method: 'post',
      url: `${API}${route}`,
      data: body,
      headers: {
        Authorization: `Bearer ${token || getToken()}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      ...errorHandling,
    })
      .then(res => {
        if (res?.status == 200 || res?.status == 201) {
          onSuccess(res?.data);
        } else {
          if (res?.status == 401) {
            // updateUnAuthorizedError();
          }
          onError(res);
        }
      })
      .catch(err => {
        console.error(err);
        onError(err);
      });
  } catch (error) {
    onFail({data: null, msg: 'Network Error', status: 'error'});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};

export const GET_WITH_TOKEN = async (
  route,
  onSuccess = () => {},
  onError = () => {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
  headers = {},
  status = () => {},
) => {
  console.log('USER TOKEN', getToken());
  try {
    await axios({
      method: 'get',
      url: `${API}${route}`,
      headers: {
        authorization: `Bearer ${getToken()}`,
        // 'Accept-Language': localization.getLanguage(),
        ...headers,
      },
      ...errorHandling,
    })
      .then(res => {
        if (res?.status == 200) {
          onSuccess(res?.data);
          return res?.data;
        } else {
          if (res?.status == 401) {
            // updateUnAuthorizedError();
          }
          if (statusMessage[res?.status]) {
            // SimpleToast(`${statusMessage[res?.status]}`, 'danger');
          }
          onError(res);
          return res;
        }
      })
      .catch(err => {
        onError(err);
        return err;
      });
    return;
  } catch (error) {
    console.log(error);
    onFail({data: null, msg: 'Network Error', status: 'error', error});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};

export const DELETE_WITH_TOKEN = async (
  route,
  body = {},
  onSuccess = () => {},
  onError = () => {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
  headers = {},
) => {
  try {
    axios({
      method: 'delete',
      url: `${API}${route}`,
      data: body,
      headers: {
        authorization: `Bearer ${getToken()}`,
        // 'Accept-Language': localization.getLanguage(),
        ...headers,
      },
      ...errorHandling,
    })
      .then(res => {
        if (res?.status == 200) {
          onSuccess(res?.data);
        } else {
          if (res?.status == 401) {
            // updateUnAuthorizedError();
          }
          onError(res);
        }
      })
      .catch(err => {
        onError(err);
      });
  } catch (error) {
    onFail({data: null, msg: 'Network Error', status: 'error', error});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};

export const POST_FORM_DATA_WITH_TOKEN = async (
  route,
  body,
  token,
  onSuccess = () => {},
  onError = () => {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
) => {
  try {
    await axios({
      method: 'post',
      url: `${API}${route}`,
      data: body,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      ...errorHandling,
    })
      .then(res => {
        if (res?.status == 200 || res?.status == 201) {
          onSuccess(res?.data);
        } else {
          if (res?.status == 401) {
            // updateUnAuthorizedError();
          }
          onError(res);
        }
      })
      .catch(err => {
        console.error(err, '----error ,api catch');
        onError(err);
      });
  } catch (error) {
    onFail({data: null, msg: 'Network Error', status: 'error'});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};

export const PUT_FORM_DATA = async (
  route,
  body,
  onSuccess = () => {},
  onError = () => {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
) => {
  console.log('PUT_FORM_DATA URL:', `${API}${route}`);
  console.log('PUT_FORM_DATA Token:', getToken());
  console.log('PUT_FORM_DATA Body:', body);
  
  try {
    axios({
      method: 'put',
      url: `${API}${route}`,
      data: body,
      headers: {
        'Content-Type': 'multipart/form-data',
        authorization: `Bearer ${getToken()}`,
        // 'Accept-Language': localization.getLanguage()
      },
      ...errorHandling,
    })
      .then(res => {
        console.log('PUT_FORM_DATA Response Status:', res?.status);
        console.log('PUT_FORM_DATA Response Data:', res?.data);
        if (res?.status == 200 || res?.status == 201) {
          onSuccess(res?.data);
        } else {
          if (res?.status == 401) {
            // updateUnAuthorizedError();
          }
          onError(res);
        }
      })
      .catch(err => {
        console.error('PUT_FORM_DATA Error:', err);
        onError(err);
      });
  } catch (error) {
    console.log('PUT_FORM_DATA Catch Error:', error);
    onFail({data: null, msg: 'Network Error', status: 'error'});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};

export const PUT_WITH_TOKEN = async (
  route,
  body = {},
  onSuccess = () => {},
  onError = () => {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
) => {
  try {
    axios({
      method: 'put',
      url: `${API}${route}`,
      data: body,
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
        // 'Accept-Language': localization.getLanguage()
      },
      ...errorHandling,
    })
      .then(res => {
        if (res?.status == 200) {
          onSuccess(res?.data);
        } else {
          if (res?.status == 401) {
            // updateUnAuthorizedError();
          }
          onError(res);
        }
      })
      .catch(err => {
        console.error(err);
        onError(err);
      });
  } catch (error) {
    onFail({data: null, msg: 'Network Error', status: 'error'});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};


export function onErrorFound(res, onError) {
  const errorResponse = responseBack(null, statusMessage[res.status], 'error');
  onError(errorResponse);
  return errorResponse;
}
