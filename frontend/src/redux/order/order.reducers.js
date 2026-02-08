import {
  PLACE_ORDER_REQUEST,
  PLACE_ORDER_SUCCESS,
  PLACE_ORDER_FAIL,
  GET_ADMIN_ORDER_REQUEST,
  GET_ADMIN_ORDER_SUCCESS,
  GET_ADMIN_ORDER_FAIL,
  GET_MY_ORDERS_REQUEST,
  GET_MY_ORDERS_SUCCESS,
  GET_MY_ORDERS_FAIL,
  CONFIRM_ORDER_REQUEST,
  CONFIRM_ORDER_SUCCESS,
  CONFIRM_ORDER_FAIL,
  SET_PAYMENT_TYPE_REQUEST,
  SET_PAYMENT_TYPE_SUCCESS,
  SET_PAYMENT_TYPE_FAIL,
  SET_PAYMENT_STATUS_REQUEST,
  SET_PAYMENT_STATUS_SUCCESS,
  SET_PAYMENT_STATUS_FAIL,
  SUBMIT_FEEDBACK_REQUEST,
  SUBMIT_FEEDBACK_SUCCESS,
  SUBMIT_FEEDBACK_FAIL,
} from "./order.types";

const initialState = {
  orders: [],
  order: {},
  loading: true,
  error: "",
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case PLACE_ORDER_REQUEST:
    case GET_ADMIN_ORDER_REQUEST:
    case GET_MY_ORDERS_REQUEST:
    case CONFIRM_ORDER_REQUEST:
    case SET_PAYMENT_TYPE_REQUEST:
    case SET_PAYMENT_STATUS_REQUEST:
    case SUBMIT_FEEDBACK_REQUEST:
      return { ...state, loading: true };
    case PLACE_ORDER_SUCCESS:
      return { ...state, orders: [...state.orders, payload], loading: false };
    case GET_ADMIN_ORDER_SUCCESS:
    case GET_MY_ORDERS_SUCCESS:
      return { ...state, orders: payload, loading: false };
    case CONFIRM_ORDER_SUCCESS:
      return {
        ...state,
        orders: state.orders.map((order) =>
          order._id === payload.id
            ? { ...order, isConfirmed: payload.isConfirmed, rejectionReason: payload.rejectionReason }
            : order
        ),
        loading: false,
      };
    case SET_PAYMENT_TYPE_SUCCESS:
      return {
        ...state,
        orders: state.orders.map((order) =>
          order._id === payload.id
            ? { ...order, paymentType: payload.paymentType }
            : order
        ),
        loading: false,
      };
    case SET_PAYMENT_STATUS_SUCCESS:
      return {
        ...state,
        orders: state.orders.map((order) =>
          order._id === payload.id
            ? { ...order, paymentStatus: true }
            : order
        ),
        loading: false,
      };
    case SUBMIT_FEEDBACK_SUCCESS:
      return {
        ...state,
        orders: state.orders.map((order) =>
          order._id === payload.id
            ? { ...order, feedback: payload.feedback }
            : order
        ),
        loading: false,
      };
    case PLACE_ORDER_FAIL:
    case GET_ADMIN_ORDER_FAIL:
    case GET_MY_ORDERS_FAIL:
    case CONFIRM_ORDER_FAIL:
    case SET_PAYMENT_STATUS_FAIL:
    case SET_PAYMENT_TYPE_FAIL:
    case SUBMIT_FEEDBACK_FAIL:
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
}
