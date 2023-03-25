import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";
import axios from 'axios'

// Add items to cart
export const addItemsToCart = (id, quantity) => async (dispatch,getState) => {
   
    const { data } = await axios.get(
      `http://0.0.0.0:4000/api/v1/product/${id}`
      // `https://ecommerce-notoriousbrain.onrender.com/api/v1/product/${id}`
    );
 
    dispatch({
      type: ADD_TO_CART,
      payload: {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        stock: data.product.stock,
        quantity,
      },
    });
    localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems)); //If the user adds to cart and refresh the data should be sstored in localstorage
}; 

// Remove items from cart
export const removeItemsFromCart = (id) => async (dispatch,getState) => {

    dispatch({
      type: REMOVE_CART_ITEM,
      payload: id
    });

    localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems)); //If the user adds to cart and refresh the data should be sstored in localstorage
}; 

// Save shipping info 
export const saveShippingInfo = (data) => async (dispatch,getState) => {
  dispatch({
    type:SAVE_SHIPPING_INFO,
    payload: data,
  });

  localStorage.setItem("shippingInfo",JSON.stringify(data))
}