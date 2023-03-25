// import React, { useState , useEffect} from 'react'
// import './Payment.css'
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import { useAlert } from 'react-alert'
// import { createOrder } from '../../actions/orderAction'
// import { Button } from '@material-ui/core'

// const Payment = () => {
//   const dispatch = useDispatch();
//     const alert = useAlert();
//     const navigate = useNavigate();

//   const { shippingInfo, cartItems } = useSelector((state) => state.cart);
//   const [ paymentStatus , setPaymentStatus ] = useState("")

//   const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));


//     const order = {
//       shippingInfo,
//       orderItems: cartItems,
//       itemsPrice: orderInfo.subtotal,
//       taxPrice: orderInfo.tax,
//       shippingPrice: orderInfo.shippingCharges,
//       totalPrice: orderInfo.totalPrice,
//     }

    
//     const paymentSubmitHandler = async (e) => {
//       e.preventDefault();


//     setPaymentStatus("paid");
//     //  alert.success("Payment was success");
//     //  navigate("/success");
//     //  dispatch(createOrder(order));
//   };

//   useEffect(() => {
//   if(paymentStatus==="paid"){
//     alert.success("Payment was success");
//     dispatch(createOrder(order));
//     navigate("/success");
//   }
//   }, [dispatch  , paymentStatus , alert , navigate])
  

//   return <Button onClick={paymentSubmitHandler} className="pay">Pay</Button>;
// }

// export default Payment



import React, { Fragment, useEffect, useRef } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Typography } from "@material-ui/core";
import { useAlert } from "react-alert";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  // useStripe, 
  // useElements,  
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import "./Payment.css";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { createOrder, ClearErrors } from "../../actions/orderAction";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  // const stripe = useStripe();
  // const elements = useElements();
  const payBtn = useRef(null);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  // const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  // const paymentData = {
  //   amount: Math.round(orderInfo.totalPrice * 100),
  // };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // payBtn.current.disabled = true;

    // try {
    //   const config = {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   };
    //   const { data } = await axios.post(
    //     "/api/v1/payment/process",
    //     paymentData,
    //     config
    //   );

    //   const client_secret = data.client_secret;

    //   if (!stripe || !elements) return;

    //   const result = await stripe.confirmCardPayment(client_secret, {
    //     payment_method: {
    //       card: elements.getElement(CardNumberElement),
    //       billing_details: {
    //         name: user.name,
    //         email: user.email,
    //         address: {
    //           line1: shippingInfo.address,
    //           city: shippingInfo.city,
    //           state: shippingInfo.state,
    //           postal_code: shippingInfo.pinCode,
    //           country: shippingInfo.country,
    //         },
    //       },
    //     },
    //   });

    //   if (result.error) {
    //     payBtn.current.disabled = false;

    //     alert.error(result.error.message);
    //   } else {
    //     if (result.paymentIntent.status === "succeeded") {
    //       order.paymentInfo = {
    //         id: result.paymentIntent.id,
    //         status: result.paymentIntent.status,
    //       };

          dispatch(createOrder(order));
          alert.success("Payment was successful")
          navigate("/success");
  //       } else {
  //         alert.error("There's some issue while processing payment ");
  //       }
  //     }
  //   } catch (error) {
  //     payBtn.current.disabled = false;
  //     alert.error(error.response.data.message);
  //   }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(ClearErrors());
    }
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>

          <input
            type="submit"
            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;