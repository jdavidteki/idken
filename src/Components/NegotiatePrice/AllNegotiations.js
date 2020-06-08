import React, { Component } from "react";
import { connect } from "react-redux";
import "./AllNegotiations.css";
import { withRouter } from "react-router-dom";
import Firebase from "../../Firebase/Firebase.js";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    SafeAreaView, 
    View, 
    StyleSheet, 
    Text, 
    FlatList, 
    TouchableHighlight, 
  } from 'react-native';

class ConnectedAllNegotiations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allChatsOnProduct: [],
            loadedNego: false,
        };
    }

    componentDidMount(){
        Firebase.initializeApp()    
    }

    loadAllNegotiations(){
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
                this.setState({allChatsOnProduct: sammy, loadedNego: true})
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
                <View style={styles.item}>
                    <Text>{item["name"]}</Text>
                </View>
            </TouchableHighlight>
        );
    }
  
    render() {
        if (this.props.loggedInUser && !this.state.loadedNego){
            console.log("what this to load just once")
            this.loadAllNegotiations()
        }

        if (this.state.allChatsOnProduct.length > 0){
            return (
                <div className="negotiations-area-container">
                    <Text style={styles.title}>All Negotiating Buyers</Text>
                    <SafeAreaView style={styles.container}>
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
                    </SafeAreaView>
                </div>
            );
        }

        return (
            <CircularProgress className="circular" />
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 15,
      backgroundColor: '#fff',
    },
    item: {
      backgroundColor: '#d5f3f5',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      width: '40%',
    },
    title: {
      fontSize: 32,
      marginVertical: 8,
      marginHorizontal: 16,
    },
});
  

const mapStateToProps = state => {
    return {
      loggedInUser: state.loggedInUser,
    };
};

let AllNegotiations = withRouter(connect(mapStateToProps)(ConnectedAllNegotiations));
export default AllNegotiations;
