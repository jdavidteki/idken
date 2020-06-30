import * as CONSTANTS from "./Constants";
import firebase from "../Firebase/firebase.js"

// If multiple components need access to some data, in that case we store such data in redux.
const initialState = {
  cartItems: [],
  showCartDialog: false,
  showMenu: true,
  checkedOutItems: [],
  loggedInUser: null
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONSTANTS.SHOW_CART_DLG:
      return { ...state, showCartDialog: action.payload };
    case CONSTANTS.DELETE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(x => x.id !== action.payload)
      };
    case CONSTANTS.TOGGLE_MENU:
      return { ...state, showMenu: !state.showMenu };
    case CONSTANTS.SET_LOGGED_IN_USER:
      return { ...state, loggedInUser: action.payload };
    case CONSTANTS.LOGOUT:
      return { ...state, loggedInUser: null, checkedOutItems: [] };
    case CONSTANTS.SET_CHECKEDOUT_ITEMS:
      return { ...state, checkedOutItems: action.payload };
    case CONSTANTS.UPDATE_CART_ITEM_QUANTITY: {
      let index = state.cartItems.findIndex(x => x.id === action.payload.id);

      // User wants to update quantity of existing item.
      if (index !== -1) {
        let cloneCartItems = [...state.cartItems];
        cloneCartItems[index] = {
          ...cloneCartItems[index],
          quantity: action.payload.quantity
        };

        return { ...state, cartItems: cloneCartItems };
      }

      // If we couldn't find such item, do nothing.
      return state;
    }
    default:
      return state;
  }
};

export default rootReducer;
