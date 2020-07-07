import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
    someoneLoggedIn: state.someoneLoggedIn
  };
};

class ConnectedProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.props.someoneLoggedIn){
        return (
            <div>Hi {this.props.loggedInUser.name}</div>
        )
    }

    return (
        <div>
            Please log in to view your profile
        </div>
    )
  }
}
const Profile = withRouter(connect(mapStateToProps)(ConnectedProfile));
export default Profile;
