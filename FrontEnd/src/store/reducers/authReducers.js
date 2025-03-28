import actionTypes from "../actions/actionType";
const initState = {
  isLoggedIn: false,
  message: null,
  code: null,
  token: null,
  username: null,
  result: null,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
        message: action.data.message,
        token: null,
        code: action.data.code,
        username: null,
        update: false,
        result: null,
      };
    case actionTypes.REGISTER_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        message: action.data.message,
        token: null,
        code: action.data.code,
        username: null,
        update: !state.update,
        result: action.data.result,
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: action.data.result.authenticated,
        message: action.data.message,
        token: action.data.result.token,
        code: action.data.code,
        username: action.data.result.username,
        update: false,
        result: null,
      };
    case actionTypes.LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        message: action.data.message,
        token: null,
        code: action.data.code,
        username: null,
        update: !state.update,
        result: null,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        message: null,
        token: null,
        code: null,
        username: null,
        result: null,
      };
    default:
      return state;
  }
};
export default authReducer;
