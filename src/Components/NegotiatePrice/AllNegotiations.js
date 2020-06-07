import React, { Component } from "react";
import { connect } from "react-redux";
import "./AllNegotiations.css";
import { withRouter } from "react-router-dom";
import Firebase from "../../Firebase/Firebase.js";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    View, 
    Text, 
    FlatList,
    TouchableHighlight,
  } from 'react-native';

class ConnectedAllNegotiations extends Component {
    state = {
        allChatsOnProduct: []
    }

    componentDidMount(){
        Firebase.initializeApp()
        
        Firebase.getAllNegotiations(this.props.loggedInUser.uid, this.props.match.params.id).
        then(result => {
            let buyersId = Object.keys(result)
            let sammy = []
            let promises = []
            let orderedBuyers = []

            buyersId.forEach((id) => {
                if (this.props.loggedInUser.uid != id){
                    orderedBuyers.push(id)
                    promises.push(
                        Firebase.getUserNameFromID(id)
                    )
                }
            })

            Promise.all(promises).
            then((val) => {
                for (var i=0; i<val.length; i++){
                    sammy.push({
                        id: orderedBuyers[i],
                        name: val[i]
                    })
                }
                this.setState({allChatsOnProduct: sammy})
            })
            
        }).catch(error => {
            console.log("err", error)
        })
    }

    onPress = (item) =>{
        this.props.history.push({
            pathname: "/negotiateprice/" + this.props.match.params.id,
            state: { clickedBuyerId: item["id"] }
        });
    }

    renderItem({item, onPress}) {
        return (
            <TouchableHighlight onPress={onPress}>
                <View>
                    <Text>{item["name"]}</Text>
                </View>
            </TouchableHighlight>
        );
    }
  
    render() {

        if (this.state.allChatsOnProduct.length > 0){
            return (
                <div className="negotiations-area-container">
                    Seller Page
                    <FlatList
                        data={this.state.allChatsOnProduct}
                        renderItem={({ item }) => 
                            <this.renderItem 
                                onPress={() => this.onPress(item)}
                                item={item} 
                            />
                        }
                        keyExtractor={item => item["name"]}
                    />
                </div>
            );
        }

        return (
            <CircularProgress className="circular" />
        )
    }
}

const mapStateToProps = state => {
    return {
      loggedInUser: state.loggedInUser,
    };
};

let AllNegotiations = withRouter(connect(mapStateToProps)(ConnectedAllNegotiations));
export default AllNegotiations;
