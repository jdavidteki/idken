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
    };
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
    });

    //if sellerId == userId that means user is seller and should see all the negotiations when he clicks the negotiation icon
    try {
      Firebase.db().ref("chats/" + this.state.item.sellerId + "vs" + this.state.user.uid + "/" + this.props.match.params.id).on("value", snapshot => {
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

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ writeError: null });
    const chatArea = this.myRef.current;
    Firebase.postChats(this.state.item.sellerId, this.state.user.uid, this.state.content, this.props.match.params.id).
    then(val => {
        this.setState({ content: '' });
        chatArea.scrollBy(0, chatArea.scrollHeight);
    }).
    catch(error => {
        this.setState({ writeError: error.message });
    })
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
        <form onSubmit={this.handleSubmit} className="mx-3">
          <textarea className="form-control" name="content" onChange={this.handleChange} value={this.state.content}></textarea>
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
