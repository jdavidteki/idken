import React, { Component } from "react";
import { connect } from "react-redux";
import "./AllNegotiations.css";
import { withRouter } from "react-router-dom";
import Firebase from "../../Firebase/Firebase.js";

class ConnectedAllNegotiations extends Component {
    state = {
        allChatsOnProduct: {}
    }

   componentDidMount(){

    Firebase.initializeApp()

    Firebase.getAllNegotiations(this.props.loggedInUser.uid, this.props.match.params.id).
    then(result => {
        console.log(Object(result)) // render results on a nice display container
        this.setState({allChatsOnProduct: result})
    }).catch(error => {
        console.log("err", error)
    })

   }

  render() {
    return (
        <div className="negotiations-area-container">
            Seller Negotiations Area
        </div>
    );
  }
}

const mapStateToProps = state => {
    return {
      loggedInUser: state.loggedInUser,
    };
};

let AllNegotiations = withRouter(connect(mapStateToProps)(ConnectedAllNegotiations));
export default AllNegotiations;
