import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import "./CardSectionStyles.css";

const promise = loadStripe('pk_test_PIzaoa0Dq0IPmzb6f0ePnTi200Wyr850qg');

const PaymentForm = (state) => {
    //if there are zero items in the cart it means user is here illegally
    const { from } =  { from: { pathname: "/idken" } };
    if (state.nrOfItemsInCard == 0) {
      return <Redirect to={from} />;
    }

    return (
        <div className="PaymentForm">
            <Elements stripe={promise}>
                <CheckoutForm 
                    checkedOutItems={state.checkedOutItems} 
                    totalPriceToCharge={state.totalPriceToCharge} 
                    uid={state.loggedInUser.uid} 
                />
            </Elements>
        </div>
    )
}

function getTotalPrice(cartItems){
    let totalPrice = 0

    cartItems.forEach((item,index,array) => {
        totalPrice += item.price * item.quantity
    })
    return totalPrice * 100;
}

const mapStateToProps = state => {
    return {
      nrOfItemsInCard: state.checkedOutItems.length,
      loggedInUser: state.loggedInUser,
      totalPriceToCharge: getTotalPrice(state.checkedOutItems),
      checkedOutItems: state.checkedOutItems
    };
};

export default withRouter(connect(mapStateToProps)(PaymentForm));