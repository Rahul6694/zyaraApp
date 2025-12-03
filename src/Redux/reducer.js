import { AUTH, TOKEN, LOG_OUT, USER, SKIP, LANGUAGE_CODE, USERTYPE, USER_TYPE } from './constant';

const initialState = {
  isAuth: false,
  isIntro: false,
  userDetails: {},
  Token: '',
  userType: null, // 'customer' or 'beautician'
  skipData: {
    intro: true,
  },
  language_code: '',
};

const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH: {
      const status = action.payload;
      return {
        ...state,
        isAuth: status.isAuth,
      };
    }

    case SKIP: {
      const status = action.payload;
      return {
        ...state,
        skipData: status.skipData,
      };
    }

    case TOKEN: {
      const status = action.payload;
      return {
        ...state,
        Token: status.Token,
        isAuth: status.Token ? true : false, // Auto set isAuth when token is set
      };
    }
    case USER: {
      const status = action.payload;
      return {
        ...state,
        userDetails: status.userDetails,
      };
    }
    case LOG_OUT: {
      return initialState;
    }
    case LANGUAGE_CODE:
      return {
        ...state,
        language_code: action.payload.language_code,
      };
    case USERTYPE: {
      const status = action.payload;
      return {
        ...state,
        userType: status.userType,
      };
    }
    case USER_TYPE: {
      return {
        ...state,
        userType: action.payload.userType,
      };
    }
    default:
      return state;
  }
};

export default todoReducer;
