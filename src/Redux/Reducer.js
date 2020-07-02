import * as CONSTANTS from "./Constants";
import firebase from "../Firebase/firebase.js"

// If multiple components need access to some data, in that case we store such data in redux.
const initialState = {
  showCartDialog: false,
  showMenu: true,
  checkedOutItems: [],
  loggedInUser: null
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONSTANTS.SHOW_CART_DLG:
      return { ...state, showCartDialog: action.payload };
    case CONSTANTS.TOGGLE_MENU:
      return { ...state, showMenu: !state.showMenu };
    case CONSTANTS.SET_LOGGED_IN_USER:
      return { ...state, loggedInUser: action.payload };
    case CONSTANTS.LOGOUT:
      return { ...state, loggedInUser: null, checkedOutItems: [] };
    case CONSTANTS.SET_CHECKEDOUT_ITEMS:
      return { ...state, checkedOutItems: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
