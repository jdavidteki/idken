import React, { Component } from "react";
import Firebase from "../../Firebase/Firebase.js";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import "./NegotiatePrice.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Api from "../../Api";
import { withRouter } from "react-router-dom";

class ConnectedNegotiatePrice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      content: '',
      user: null,
      readError: null,
      writeError: null,
      loadingChats: false,
      item: null,
      sellerName: '',
      dealAmount: '',
    };
    let buyerToUse = ""
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.myRef = React.createRef();
  }

  async componentDidMount() {
    Firebase.initializeApp()

    this.setState({ readError: null, loadingChats: true });
    const chatArea = this.myRef.current;

    let item = await Api.getItemUsingID(this.props.match.params.id);
    this.setState({
        item: item,
        user: this.props.loggedInUser
    })

    this.getSellerName()
    this.buyerToUse = this.state.user.uid
   
    if (this.state.user.uid == this.state.item.sellerId){
      this.buyerToUse = this.props.location.state.clickedBuyerId
    }

    try {
      Firebase.db().ref("chats/" + this.state.item.sellerId + "/" + this.props.match.params.id + "/" + this.buyerToUse ).on("value", snapshot => {
        let chats = [];
        snapshot.forEach((snap) => {
        chats.push(snap.val());
        });
        chats.sort(function (a, b) { return a.timestamp - b.timestamp })
        this.setState({ chats });

        if (chatArea != null){
            chatArea.scrollBy(0, chatArea.scrollHeight);
        }

        this.setState({ loadingChats: false });
      });
    } catch (error) {
        console.log("error", error)
        this.setState({ readError: error.message, loadingChats: false });
    }

  }

  handleChange(event) {
    this.setState({
      content: event.target.value
    });
  }

  handleDealChange = (event) => {
    this.setState({
      dealValue: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ writeError: null });
    const chatArea = this.myRef.current;
    
    if (this.state.content.length > 0){
      Firebase.postChats(this.state.item.sellerId, this.buyerToUse, this.state.content, this.props.match.params.id, this.state.user.uid).
      then(val => {
          this.setState({ content: '' });
          chatArea.scrollBy(0, chatArea.scrollHeight);
      }).
      catch(error => {
          this.setState({ writeError: error.message });
      })
    }
    
  }

  handleDealClick = (event) => {
    event.preventDefault()
    if( !isNaN(this.state.dealValue)){
      Firebase.sendNewDeal(this.state.item.sellerId, this.buyerToUse, this.props.match.params.id, this.state.dealValue).
      then(val =>{
        Firebase.getNewDeal(this.state.item.sellerId, this.buyerToUse, this.props.match.params.id).
        then((val) =>{
          this.setState({dealAmount: val.deal})
        })
      })
    }else{
      this.setState({dealError: 'Ivalid Deal Number'})
    }
  }

  getSellerName = () => {
    if (this.state.item.sellerId != this.state.user.uid){
      Firebase.getUserNameFromID(this.state.item.sellerId).
      then((val) => {
        this.setState({sellerName: val})
      })
    }else{
      this.setState({sellerName: this.state.user.name})
    }
  }

  formatTime(timestamp) {
    const d = new Date(timestamp);
    const time = `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    return time;
  }

  render() {

    if (!this.state.item) {
        return null;
    }

    return (
      <div className="chat-area-container">
        <div 
            className="chat-area-header"
            style={{
                marginTop: 20,
                marginBottom: 20,
                fontSize: 22,
            }} 
        >
            <span>Negotiations about {this.state.item.name}</span>
            <p>{this.props.loggedInUser.name} ::: {this.props.location.state != null ? this.props.location.state.clickedBuyerName : this.state.sellerName} </p>
            {this.state.dealAmount != '' ? (
              <p>Seller made a deal of {this.state.dealAmount} </p>
            ):(
              <div  style={{ display: "none" }}></div>
            )}
        </div>
        <div className="chat-area" ref={this.myRef}>
          {/* loading indicator */}
          {this.state.loadingChats ? <div className="spinner-border text-success" role="status">
            <CircularProgress className="circular" />;
          </div> : ""}
          {/* chat area */}
          {this.state.chats.map(chat => {
            return <p key={chat.timestamp} className={"chat-bubble " + (this.state.user.uid === chat.uid ? "current-user" : "")}>
              {chat.content}
              <br />
              <span className="chat-time float-right">{this.formatTime(chat.timestamp)}</span>
            </p>
          })}
        </div>
        <div className="chat-area-sendmsg">
          <form onSubmit={this.handleSubmit} className="mx-3">
            <textarea 
              className="form-control" 
              name="content"
              onChange={this.handleChange} 
              value={this.state.content}>
            </textarea>
            {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
            <Button 
              variant="outlined"
              color="primary" 
              type="submit" 
              className="btn btn-submit px-5 mt-4"
            >
                Send
            </Button>
          </form>
          {this.state.user.uid == this.state.item.sellerId ? (
            <form onSubmit={this.handleDealClick} className="chat-area-deal">
              <textarea className="deal-control" 
                name="content" 
                onChange={this.handleDealChange} 
                value={this.state.dealValue}>
              </textarea>
              <Button 
                variant="outlined"
                color="primary" 
                type="submit" 
                className=""
              >
                  Deal!
              </Button>
            </form>
          ): (
            <div  style={{ display: "none" }}></div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
    return {
      loggedInUser: state.loggedInUser,
    };
};

let NegotiatePrice = withRouter(connect(mapStateToProps)(ConnectedNegotiatePrice));
export default NegotiatePrice;
