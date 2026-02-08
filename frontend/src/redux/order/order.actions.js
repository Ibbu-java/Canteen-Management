import axios from "axios";
import {
  PLACE_ORDER_REQUEST,
  PLACE_ORDER_SUCCESS,
  PLACE_ORDER_FAIL,
  GET_ADMIN_ORDER_REQUEST,
  GET_ADMIN_ORDER_SUCCESS,
  GET_ADMIN_ORDER_FAIL,
  CONFIRM_ORDER_SUCCESS,
  CONFIRM_ORDER_REQUEST,
  CONFIRM_ORDER_FAIL,
  GET_MY_ORDERS_REQUEST,
  GET_MY_ORDERS_SUCCESS,
  GET_MY_ORDERS_FAIL,
  SET_PAYMENT_TYPE_SUCCESS,
  SET_PAYMENT_TYPE_REQUEST,
  SET_PAYMENT_TYPE_FAIL,
  SET_PAYMENT_STATUS_SUCCESS,
  SET_PAYMENT_STATUS_REQUEST,
  SET_PAYMENT_STATUS_FAIL,
  SUBMIT_FEEDBACK_REQUEST,
  SUBMIT_FEEDBACK_SUCCESS,
  SUBMIT_FEEDBACK_FAIL,
} from "./order.types";
import { setAlert } from "../alert/alert.actions";
import { clearCart } from "../cart/cart.actions";

export const placeOrder = (formData, history) => async (dispatch) => {
  try {
    dispatch({ type: PLACE_ORDER_REQUEST });

    const { data } = await axios.post("/place/order", formData);

    dispatch({ type: PLACE_ORDER_SUCCESS, data: data });
    dispatch(clearCart());
    dispatch(setAlert("Placed order successfully", "success"));

    history.push("/dashboard");
  } catch (error) {
    console.log(error);
    const errors = error.response?.data?.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    if (error.response?.data?.msg) {
      dispatch(setAlert(error.response.data.msg, "danger"));
    }

    dispatch({ type: PLACE_ORDER_FAIL, payload: error.message });
  }
};

export const getAdminORders = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ADMIN_ORDER_REQUEST });

    const { data } = await axios.get("/api/orders");
    console.log(data);
    dispatch({ type: GET_ADMIN_ORDER_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: GET_ADMIN_ORDER_FAIL, payload: error });
    console.log(error);
  }
};

export const confirmOrder = (id, isConfirmed, history, rejectionReason) => async (dispatch) => {
  try {
    dispatch({ type: CONFIRM_ORDER_REQUEST });

    const { data } = await axios.put(`/api/orders/${id}`, {
      isConfirmed,
      rejectionReason
    });
    dispatch({
        type: CONFIRM_ORDER_SUCCESS,
        payload: { data, id, isConfirmed, rejectionReason },
      });
      // window.location.reload();
      // history.push("/dashboard");
    } catch (error) {
    const errors = error.response && error.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    if (error.response && error.response.data.msg) {
      dispatch(setAlert(error.response.data.msg, "danger"));
    }

    dispatch({ type: CONFIRM_ORDER_FAIL, payload: error });
    console.log(error);
  }
};

export const getMyOrders = () => async (dispatch) => {
  try {
    dispatch({ type: GET_MY_ORDERS_REQUEST });

    const { data } = await axios.get(`/api/myorders`);
    dispatch({ type: GET_MY_ORDERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_MY_ORDERS_FAIL, payload: error });
    console.log(error);
  }
};

export const setpaymentType =
  (id, paymentType, history) => async (dispatch) => {
    try {
      dispatch({ type: SET_PAYMENT_TYPE_REQUEST });

      const { data } = await axios.put(`/api/order/payment-type/${id}`, {
        paymentType,
      });
      dispatch({
        type: SET_PAYMENT_TYPE_SUCCESS,
        payload: { data, id, paymentType },
      });
      // window.location.reload();
      // history.push("/dashboard");
    } catch (error) {
      dispatch({ type: SET_PAYMENT_TYPE_FAIL, payload: error });
      console.log(error);
    }
  };

export const setpaymentStatus = (id, history) => async (dispatch) => {
  try {
    dispatch({ type: SET_PAYMENT_STATUS_REQUEST });

    const { data } = await axios.put(`/payment-status/${id}`);
    dispatch({ type: SET_PAYMENT_STATUS_SUCCESS, payload: { data, id } });
    dispatch(setAlert("Payment done", "success"));
    // window.location.reload();
    // history.push("/dashboard");
  } catch (error) {
    dispatch({ type: SET_PAYMENT_STATUS_FAIL, payload: error });
    console.log(error);
  }
};

export const submitFeedback = (id, feedback) => async (dispatch) => {
  try {
    dispatch({ type: SUBMIT_FEEDBACK_REQUEST });

    const { data } = await axios.put(`/api/order/feedback/${id}`, { feedback });
    dispatch({ type: SUBMIT_FEEDBACK_SUCCESS, payload: { id, feedback: data.feedback } });
    dispatch(setAlert("Feedback submitted", "success"));
  } catch (error) {
    dispatch({ type: SUBMIT_FEEDBACK_FAIL, payload: error });
    console.log(error);
    dispatch(setAlert("Error submitting feedback", "danger"));
  }
};
