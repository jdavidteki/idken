import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import ForumIcon from '@material-ui/icons/Forum';
import { connect } from "react-redux";
import  Firebase from "../../Firebase/firebase.js"
import { withRouter } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";


class ConnectedItem extends Component {
  render() {
    return (
      <Card
        style={{ width: 200, height: 270, margin: 10, display: "inline-block" }}
      >
        <CardActionArea
          onClick={() => {
            this.props.history.push("/idken/details/" + this.props.item.id);
          }}
        >
          <CardMedia
            style={{ height: 140 }}
            image={this.props.item.imageUrls[0]}
          />
          <CardContent style={{ height: 50 }}>
            <div
              style={{
                marginLeft: 5,
                fontWeight: "bold",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {this.props.item.name}
            </div>
            <div style={{ margin: 5 }}>Price: {this.props.item.price} $</div>
            <div style={{ color: "#1a9349", fontWeight: "bold", margin: 5 }}>
              {this.props.item.popular && "Popular"}
            </div>
          </CardContent>
        </CardActionArea>
        <CardActions
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 45 }}
        >
          <Button
            size="small"
            style={{ marginRight: 50 }}
            onClick={() => {
              this.props.history.push("/idken/details/" + this.props.item.id);
            }}
          >
            {" "}
            Details
          </Button>
          <Tooltip title="Add to cart">
            <IconButton
              size="small"
              onClick={e => {
                e.stopPropagation();
                Firebase.addItemToCart({ item: this.props.item, quantity: 1, uid: this.props.loggedInUser.uid})
              }}
              color="primary"
              aria-label="Add to shopping cart"
            >
              <AddShoppingCartIcon size="small" />
            </IconButton>
          </Tooltip>
          {this.props.loggedInUser ? (
            <Tooltip title="Negotiate Price">
              <IconButton
                size="small"
                onClick={e => {
                  e.stopPropagation();

                if (this.props.loggedInUser.uid == this.props.item.sellerId){
                    //call seller view negotiation view
                    this.props.history.push("/idken/allnegotiations/" + this.props.item.id);
                  } else {
                    this.props.history.push("/idken/negotiateprice/" + this.props.item.id);
                  }
                }}
                color="primary"
                aria-label="Negotiate Price"
              >
                <ForumIcon size="small" />
              </IconButton>
            </Tooltip>
          ):(
            <div  style={{ display: "none" }}></div>
          )}
        </CardActions>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
  };
};

export default withRouter(connect(mapStateToProps)(ConnectedItem));
