import React, { Component } from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { showCartDlg } from "../../Redux/Actions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Firebase from "../../Firebase/firebase.js"

class CartRow extends Component {
  state = {
    hideRow: false,
    quantityValue: this.props.item.quantity,
  }

  handleQuantityTextFieldChange = (e) => {
    e.preventDefault()
    this.setState({quantityValue: e.target.value});
    let quantity = parseInt(e.target.value, 10);

    if (quantity > 0) {
      Firebase.updateCartItemQnt({id: this.props.item.id, uid: this.props.loggedInUser.uid, quantity: quantity})
    }else{
      //change this logic if it breaks any other part of cart
      Firebase.updateCartItemQnt({id: this.props.item.id, uid: this.props.loggedInUser.uid, quantity: 0})
    }
  }

  render(){
    if (this.state.hideRow){
      return (<TableRow  style={{ display: "none" }}></TableRow>)
    }

    return (
      <TableRow>
        <TableCell>
          <Link to={`/idken/details/${this.props.item.id}`}>
            <div
              onClick={() => {
                this.props.dispatch(showCartDlg(false));
              }}
            >
              {this.props.item.name}
            </div>
          </Link>
        </TableCell>
        <TableCell>{this.props.item.price}</TableCell>
        <TableCell>
          <TextField
            type="number"
            style={{ width: 40 }}
            value={this.state.quantityValue}
            onChange={this.handleQuantityTextFieldChange}
          />
        </TableCell>
        <TableCell>
          <Button
            color="secondary"
            onClick={() => {
              this.setState({hideRow: true})
              Firebase.deleteItemFromCart({id: this.props.item.id, uid: this.props.loggedInUser.uid})
            }}
          >
            Delete
          </Button>
        </TableCell>
      </TableRow>
    )
  }
};

export default CartRow;
