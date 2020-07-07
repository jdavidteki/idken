import React, { Component } from "react";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import "./Header.css";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Badge from "@material-ui/core/Badge";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  showCartDlg,
  toggleMenu,
  logout,
} from "../../Redux/Actions";
import cartImage from "../../Images/logo.png";
import Auth from "../../Auth";
import { categories } from "../../Data";
import Person from "@material-ui/icons/PersonOutline";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Firebase from "../../Firebase/firebase.js";
import { setLoggedInUser } from "../../Redux/Actions";

const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
    someoneLoggedIn: state.someoneLoggedIn,
  };
};

// Option items for product categories.
const categoryOptions = categories.map(x => {
  return (
    <MenuItem key={x.name} value={x.name}>
      {x.name}
    </MenuItem>
  );
});

class ConnectedHeader extends Component {
  state = {
    searchTerm: "",
    anchorEl: null,
    categoryFilterValue: categories[0].name,
    nrOfItemsInCart: 0,
  };

  componentDidMount(){
    let user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (user != null){
      this.props.dispatch(setLoggedInUser({ name: user.name, uid: user.uid }));
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if ((prevProps.someoneLoggedIn !== this.props.someoneLoggedIn) && this.props.someoneLoggedIn) {
      this.getNoItemInCart()
    }
  }

  getNoItemInCart = () => {
    try {
      Firebase.db().ref("carts/" + this.props.loggedInUser.uid).on("value", snapshot => {
        if (snapshot.val()){
          this.setState({ nrOfItemsInCart: Object.keys(snapshot.val()).length,  });
        }else{
          this.setState({nrOfItemsInCart: 0, })
        }
      });
    } catch (error) {
      console.log("error", error)
    }
  }

  render() {
    let { anchorEl } = this.state;
    
    return (
      <AppBar
        position="static"
        style={{ backgroundColor: "#FFF", padding: 10 }}
      >
        <Toolbar>
          <div className="left-part">
            <IconButton
              onClick={() => {
                this.props.dispatch(toggleMenu());
              }}
            >
              <MenuIcon size="medium" />
            </IconButton>

            <img
              src={cartImage}
              alt={"Logo"}
              style={{ marginLeft: 10, height: 50 }}

            />
            <TextField
              label="Search products"
              value={this.state.searchTerm}
              onChange={e => {
                this.setState({ searchTerm: e.target.value });
              }}
              style={{ marginLeft: 30, width: 250, marginBottom: 15 }}
            />

            <Select
              style={{ maxWidth: 200, marginLeft: 20 }}
              value={this.state.categoryFilterValue}
              MenuProps={{
                style: {
                  maxHeight: 500
                }
              }}
              onChange={e => {
                this.setState({ categoryFilterValue: e.target.value });
              }}
            >
              {categoryOptions}
            </Select>

            <Button
              style={{ marginLeft: 20 }}
              variant="outlined"
              color="primary"
              onClick={() => {
                this.props.history.push(
                  "/?category=" +
                  this.state.categoryFilterValue +
                  "&term=" +
                  this.state.searchTerm
                );
              }}
            >
              {" "}
              Search
            </Button>
          </div>
          <div className="right-part">
            {!this.props.someoneLoggedIn ? (
              <Button
                variant="outlined"
                style={{ marginRight: 20 }}
                color="primary"
                onClick={() => {
                  this.props.history.push("/idken/login");
                }}
              >
                Log in
              </Button>
            ) : (
                <Avatar
                  onClick={event => {
                    this.setState({ anchorEl: event.currentTarget });
                  }}
                  style={{ backgroundColor: "#3f51b5", marginRight: 10 }}
                >
                  <Person />
                </Avatar>
              )}
            {this.props.someoneLoggedIn ? (
              <IconButton
                aria-label="Cart"
                onClick={() => {
                  this.props.dispatch(showCartDlg(true));
                }}
              >
                <Badge badgeContent={this.state.nrOfItemsInCart} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            ):(<div  style={{ display: "none" }}></div>)}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => {
                this.setState({ anchorEl: null });
              }}
            >
              <MenuItem
                onClick={() => {
                  this.setState({ anchorEl: null });
                  this.props.history.push("/idken/order");
                }}
              >
                Checkout page
              </MenuItem>
              <MenuItem
                onClick={() => {
                  Auth.signout(() => {
                    this.props.history.push("/idken/");
                    this.props.dispatch(logout());
                  });
                  this.setState({ anchorEl: null});
                  localStorage.removeItem('loggedInUser');
                }}
              >
                Logout
              </MenuItem>
              { this.props.someoneLoggedIn ? (
                  <MenuItem>
                    {this.props.loggedInUser.name}
                  </MenuItem>
                ):(
                  <TextField></TextField>
                )}
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

const Header = withRouter(connect(mapStateToProps)(ConnectedHeader));
export default Header;
