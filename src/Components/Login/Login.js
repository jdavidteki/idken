import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { setLoggedInUser } from "../../Redux/Actions";
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Firebase from "../../Firebase/Firebase.js";

class ConnectedLogin extends Component {
  state = {
    email: "",
    pass: "",
    redirectToReferrer: false,
    loginErrorMsg: ""
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
            Log in
            {" "}
          </div>
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
          <Button
            style={{ marginTop: 20, width: 200, marginBottom: 10 }}
            variant="outlined"
            color="primary"
            onClick={() => {

              Firebase.userLogin(this.state.email, this.state.pass)
              .then(user => {
                localStorage.setItem('loggedInUser', JSON.stringify({
                  "name": user.user.displayName,
                  "uid": user.user.uid,
                }));
                this.props.dispatch(setLoggedInUser({ name:  user.user.displayName, uid: user.user.uid }));
                this.setState(() => ({
                  redirectToReferrer: true
                }));
              }).catch(error => {
                this.setState({ wrongCred: true, loginErrorMsg: error.toString()});
                return;
              });
            }}
          >
            Log in
          </Button>
          {this.state.wrongCred && (
            <div style={{ color: "red" }}>{this.state.loginErrorMsg}</div>
          )}
          {" "}
          Or
          {" "}
          <Button
            style={{ marginTop: 20, width: 200 }}
            variant="outlined"
            color="primary"
            onClick={() => {
              this.props.history.push("/signup");
            }}
          >
            Sign Up
          </Button>
        </div>
      </div>
    );
  }
}
const Login = withRouter(connect()(ConnectedLogin));

export default Login;
