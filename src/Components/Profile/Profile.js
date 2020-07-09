import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Firebase from "../../Firebase/firebase";
import CircularProgress from "@material-ui/core/CircularProgress";

import "./Profile.css";

const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
    someoneLoggedIn: state.someoneLoggedIn
  };
};

class ConnectedProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileInfo: null
        };
    }

    componentDidUpdate(){
        if (this.props.someoneLoggedIn){
            Firebase.fetchUserProfile(this.props.loggedInUser.uid).
            then(val => {
                this.setState({profileInfo: val})
            })
        }
    }

    render () {
        if (!this.props.someoneLoggedIn){
            return (
                <div className="Profile">
                    <div className="Profile-wrapper">
                        <div className="Profile-info">
                            <div className="Profile-notFound">
                            <h2>Oops!</h2>
                            <p>Can't find this user. Try again.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        //TODOP: whenever user checks out an item, update totalSepnt in profiles/totalSpent
        if (this.state.profileInfo != null){
            return (

                <div className="Profile">
                    <div className="Profile-wrapper">
                        <div className="Profile-info">
                            <a href="#">
                                <img src={this.state.profileInfo.avatar} alt="Profile image" />
                            </a>
                            <h2>
                                <a>{this.state.profileInfo.firstName}, {this.state.profileInfo.lastName}</a>
                            </h2>
                            <h3>{this.state.profileInfo.location}</h3>
                        </div>
                        <div className="Profile-state">
                        <ul>
                            <li>
                                <a href="#" target="_blank">
                                    <i>N{this.state.profileInfo.totalSpent}</i>
                                    <span>Total Spent</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" target="_blank">
                                    <i>{this.state.profileInfo.dateJoined}</i>
                                    <span>Date Joined</span>
                                </a>
                            </li>
                        </ul>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <CircularProgress className="circular" />
        )
    }
}
const Profile = withRouter(connect(mapStateToProps)(ConnectedProfile));
export default Profile;
