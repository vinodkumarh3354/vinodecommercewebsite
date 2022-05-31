
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
 useStripe,
   useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";
import "./Payment.css";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
// import { createOrder, clearErrors } from "../../actions/orderAction";



const Payment = () => {
    
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

    const payBtn = useRef(null);

    const dispatch = useDispatch();
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);



    const submitHandler=(e)=>{
        e.preventDefault();

        payBtn.current.disabled = true;
        try {
            const config = {
                headers:{
                    "content-Type":"application/json"
                }
            }
        //  const {data} = await axios.post(
        //      "api/v1/process/payment",
        //      paymentData,
        //      config
        //  )

        // const client_secret = data.client_secret

            
        } catch (error) {
            payBtn.current.disabled = false;
            alert.error(error.response.data.message)
            
        }
    

    }

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
  )
}

export default Payment