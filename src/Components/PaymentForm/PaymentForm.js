import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "./CardSectionStyles.css";

const promise = loadStripe('pk_test_PIzaoa0Dq0IPmzb6f0ePnTi200Wyr850qg');

const PaymentForm = (state) => {
    console.log(state)
    return (
        <div className="PaymentForm">
            <Elements stripe={promise}>
                <CheckoutForm totalPriceToCharge={state.totalPriceToCharge} />
            </Elements>
        </div>
    )
}

function getTotalPrice(cartItems){
    let totalPrice = 0

    cartItems.forEach((value,index,array) => {
        totalPrice += value.price
    })
    return totalPrice * 100;
}

const mapStateToProps = state => {
    return {
      nrOfItemsInCard: state.cartItems.length,
      loggedInUser: state.loggedInUser,
      totalPriceToCharge: getTotalPrice(state.cartItems)
    };
};

export default  withRouter(connect(mapStateToProps)(PaymentForm));