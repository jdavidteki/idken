import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { setLoggedInUser } from "../../Redux/Actions";
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Firebase from "../../Firebase/Firebase.js";

class ConnectedSignUp extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    pass: "",
    repass: "",
    redirectToReferrer: false,
    SignUpErrorMsg: ""
  };

  componentDidMount() {
    Firebase.initializeApp()
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };

    // If user was authenticated, redirect her to where she came from.
    if (this.state.redirectToReferrer === true) {
      return <Redirect to={from} />;
    }

    return (
      <div style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",

        alignItems: "center",
      }}>
        <div
          style={{
            height: 300,
            width: 200,
            padding: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          <Avatar style={{ marginBottom: 10 }}>
            <LockOutlinedIcon />
          </Avatar>
          <div
            style={{
              marginBottom: 20,
              fontSize: 24,
              textAlign: "center"
            }}
          >
            {" "}
            Sign Up
            {" "}
          </div>
          <TextField
            value={this.state.firstName}
            placeholder="First Name"
            onChange={e => {
              this.setState({ firstName: e.target.value });
            }}
          />
          <TextField
            value={this.state.lastName}
            placeholder="Last Name"
            onChange={e => {
              this.setState({ lastName: e.target.value });
            }}
          />
          <TextField
            value={this.state.email}
            placeholder="User Email"
            onChange={e => {
              this.setState({ email: e.target.value });
            }}
          />
          <TextField
            value={this.state.pass}
            type="password"
            placeholder="Password"
            onChange={e => {
              this.setState({ pass: e.target.value });
            }}
          />
          <TextField
            value={this.state.repass}
            type="password"
            placeholder="re-type password"
            onChange={e => {
              this.setState({ repass: e.target.value });
            }}
          />
          <Button
            style={{ marginTop: 20, width: 200 }}
            variant="outlined"
            color="primary"
            onClick={() => {
              if (this.state.repass != this.state.pass) {
                this.setState({ wrongCred: true, SignUpErrorMsg: "Passwords dont match, try again"});
                return;
              }

              Firebase.createFirebaseAccount(this.state.firstName + ' ' + this.state.lastName, this.state.email, this.state.pass)
              .then(user => {
                console.log("user is ", user.user.uid)
                localStorage.setItem('loggedInUser', JSON.stringify({
                  "name": this.state.firstName + ' ' + this.state.lastName,
                  "uid": user.user.uid,
                }));
                this.props.dispatch(setLoggedInUser({ name: this.state.firstName + ' ' + this.state.lastName }));
                this.setState(() => ({
                  redirectToReferrer: true
                }));
              }).catch(error => {
                console.log(error)
                this.setState({ wrongCred: true, SignUpErrorMsg: error.toString()});
                return;
              });
            }}
          >
           Sign Up
          </Button>
          {this.state.wrongCred && (
            <div style={{ color: "red" }}>{this.state.SignUpErrorMsg}</div>
          )}
        </div>
      </div>
    );
  }
}
const SignUp = withRouter(connect()(ConnectedSignUp));

export default SignUp;
