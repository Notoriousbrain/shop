// Redux Actions
// These actions are dispatched to reducers
import axios from 'axios';
import {
  All_PRODUCT_REQUEST,
  All_PRODUCT_SUCCESS,
  All_PRODUCT_FAIL,
  ADMIN_PRODUCT_REQUEST,
  ADMIN_PRODUCT_SUCCESS,
  ADMIN_PRODUCT_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_SUCCESS,
  ALL_REVIEW_REQUEST,
  ALL_REVIEW_SUCCESS,
  ALL_REVIEW_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  CLEAR_ERRORS,
} from "../constants/productConstants";

// Fetching product data from backend
export const getProduct =
  (keyword = "", currentPage = 1, price = [0, 25000] , category , ratings = 0) => 
  async (dispatch) => {
    try {
      dispatch({ type: All_PRODUCT_REQUEST });

      let link = `http://0.0.0.0:4000/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
      // let link = `https://ecommerce-notoriousbrain.onrender.com/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

      if(category){ 
        // link = `https://ecommerce-notoriousbrain.onrender.com/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`;
        link = `http://0.0.0.0:4000/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`;
      }

      const { data } = await axios.get(link);
      dispatch({
        type: All_PRODUCT_SUCCESS, 
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: All_PRODUCT_FAIL,
        payload: error.response.data.message,
      });
    }
  };

  // Get All Products For Admin
export const getAdminProducts = () => async (dispatch) => {
  try{
    dispatch({ type: ADMIN_PRODUCT_REQUEST})

    const { data } = await axios.get(`http://0.0.0.0:4000/api/v1/admin/products`);
    // const { data } = await axios.get(`https://ecommerce-notoriousbrain.onrender.com/api/v1/admin/products`);

    dispatch({
      type: ADMIN_PRODUCT_SUCCESS,
      payload:data.products,
    })
  }catch(error){ 
    dispatch({
      type: ADMIN_PRODUCT_FAIL,
      payload: error.message.data.message,
    })
  }
}


// Fetching single product data
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(`http://0.0.0.0:4000/api/v1/product/${id}`);
    // const { data } = await axios.get(`https://ecommerce-notoriousbrain.onrender.com/api/v1/product/${id}`);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  } 
}; 


// Create a Product --Admin
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PRODUCT_REQUEST });

    const config = {
      header: { "Content-Type": "application/json"}
    }

    const { data } = await axios.post(
      `http://0.0.0.0:4000/api/v1/admin/product/new`,
      productData,
      config
    );
    // const { data } = await axios.post(`https://ecommerce-notoriousbrain.onrender.com/api/v1/admin/product/new`,productData,config);

    dispatch({
      type: NEW_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update a Product --Admin
export const updateProduct = (id,productData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const config = {
      header: { "Content-Type": "application/json"}
    }

    const { data } = await axios.put(
      `http://0.0.0.0:4000/api/v1/admin/product/${id}`,
      productData,
      config
    );
    // const { data } = await axios.put(`https://ecommerce-notoriousbrain.onrender.com/api/v1/admin/product/${id}`,productData,config);
    // console.log(data)
    dispatch({ 
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    // console.log(error.message)
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete a Product --Admin
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    const { data } = await axios.delete(
      `http://0.0.0.0:4000/api/v1/admin/product/${id}`
    );
    // const { data } = await axios.delete(`https://ecommerce-notoriousbrain.onrender.com/api/v1/admin/product/${id}`);

    dispatch({
      type: DELETE_PRODUCT_SUCCESS, 
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// New Review
export const newReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });

    const config = {
      header: { "Content-Type": "application/json"}
    }

    const { data } = await axios.put(
      `http://0.0.0.0:4000/api/v1/review`,
      reviewData,
      config
    );
    // const { data } = await axios.put(`https://ecommerce-notoriousbrain.onrender.com/api/v1/review`,reviewData,config);

    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.response.data.message,
    });
  }
};


// Get All Reviews 
export const getAllReviews = (id) => async (dispatch) => {
  try {
    dispatch({ type: ALL_REVIEW_REQUEST });

    const { data } = await axios.get(
      `http://0.0.0.0:4000/api/v1/reviews?id=${id}`
    );
    // const { data } = await axios.get(`https://ecommerce-notoriousbrain.onrender.com/api/v1/reviews?id=${id}`);

    dispatch({
      type: ALL_REVIEW_SUCCESS,
      payload: data.reviews,
    });
  } catch (error) {
    dispatch({
      type: ALL_REVIEW_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete Reviews 
export const deleteReviews = (reviewId,productId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_REVIEW_REQUEST });

    const { data } = await axios.delete(
      `http://0.0.0.0:4000/api/v1/reviews?id=${reviewId}&productId=${productId}`
    );
    // const { data } = await axios.delete(`https://ecommerce-notoriousbrain.onrender.com/api/v1/reviews?id=${reviewId}&productId=${productId}`);

    dispatch({
      type: DELETE_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clearing Errors

export const clearErrors = () => async (dispatch) => {
    dispatch ({ type: CLEAR_ERRORS })
}