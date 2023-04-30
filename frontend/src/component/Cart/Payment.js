import React, { Fragment, useEffect, useRef } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Typography } from "@material-ui/core";
import { useAlert } from "react-alert";

import { useNavigate } from "react-router-dom";

import "./Payment.css";
import { createOrder, ClearErrors } from "../../actions/orderAction";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const payBtn = useRef(null);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { error } = useSelector((state) => state.newOrder);

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
          dispatch(createOrder(order));
          alert.success("Payment was successful")
          navigate("/success");

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
          <Typography>Payment</Typography>
        <input
          type="submit"
          value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
          ref={payBtn}
          onClick={submitHandler}
          className="paymentFormBtn"
        />
      </div>
    </Fragment>
  );
};

export default Payment;