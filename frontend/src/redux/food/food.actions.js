import axios from "axios";
import {
  ADD_FOOD_REQUEST,
  ADD_FOOD_SUCCESS,
  ADD_FOOD_FAIL,
  GET_ALL_FOOD_ITEMS_REQUEST,
  GET_ALL_FOOD_ITEMS_SUCCESS,
  GET_ALL_FOOD_ITEMS_FAIL,
  GET_SINGLE_FOOD_ITEM_REQUEST,
  GET_SINGLE_FOOD_ITEM_SUCCESS,
  GET_SINGLE_FOOD_ITEM_FAIL,
  EDIT_FOOD_ITEM_REQUEST,
  EDIT_FOOD_ITEM_SUCCESS,
  EDIT_FOOD_ITEM_FAIL,
  DELETE_FOOD_ITEM_REQUEST,
  DELETE_FOOD_ITEM_SUCCESS,
  DELETE_FOOD_ITEM_FAIL,
} from "./food.types";
import { setAlert } from "../alert/alert.actions";

export const addFoodItem = (foodData, history) => async (dispatch) => {
  try {
    dispatch({ type: ADD_FOOD_REQUEST });

    // Axios automatically sets Content-Type to multipart/form-data when data is FormData
    const { data } = await axios.post("/api/add", foodData);

    dispatch({ type: ADD_FOOD_SUCCESS, payload: data });
    dispatch(setAlert("Added food successfully", "success"));

    history.push("/");
  } catch (error) {
    const errors = error.response?.data?.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    if (error.response?.data?.msg) {
      dispatch(setAlert(error.response.data.msg, "danger"));
    }
    dispatch({ type: ADD_FOOD_FAIL, payload: error.message });
    console.log(error);
  }
};

export const getAllFoodItems = (category) => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_FOOD_ITEMS_REQUEST });

    const { data } = await axios.get(`/api/food/${category}`);

    dispatch({ type: GET_ALL_FOOD_ITEMS_SUCCESS, payload: data.data });
  } catch (error) {
    console.log(error);
    dispatch({ type: GET_ALL_FOOD_ITEMS_FAIL, payload: error.message });
  }
};

export const getSingleFoodItem = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_SINGLE_FOOD_ITEM_REQUEST });
    const { data } = await axios.get(`/api/food-item/${id}`);
    dispatch({ type: GET_SINGLE_FOOD_ITEM_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: GET_SINGLE_FOOD_ITEM_FAIL, payload: error.message });
  }
};

export const editFoodItem = (foodData, id, history) => async (dispatch) => {
  try {
    dispatch({ type: EDIT_FOOD_ITEM_REQUEST });
    
    // Axios automatically sets Content-Type to multipart/form-data when data is FormData
    const { data } = await axios.put(`/api/edit/${id}`, foodData);
    
    dispatch({ type: EDIT_FOOD_ITEM_SUCCESS, payload: data });
    dispatch(setAlert("Edit food done", "success"));

    history.push("/");
  } catch (error) {
    console.log(error);
    const errors = error.response?.data?.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    if (error.response?.data?.msg) {
      dispatch(setAlert(error.response.data.msg, "danger"));
    }
    dispatch({ type: EDIT_FOOD_ITEM_FAIL, payload: error.message });
  }
};

export const deleteFoodItem = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_FOOD_ITEM_REQUEST });
    await axios.delete(`/api/delete/${id}`);

    dispatch({ type: DELETE_FOOD_ITEM_SUCCESS, payload: id });
    dispatch(setAlert("Item deleted successfully", "success"));
  } catch (error) {
    dispatch({ type: DELETE_FOOD_ITEM_FAIL, payload: error.message });
    if (error.response?.data?.msg) {
        dispatch(setAlert(error.response.data.msg, "danger"));
    }
  }
};
