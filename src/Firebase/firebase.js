import firebase from "firebase";
import config from "./config.js";

class Firebase {

  initializeApp = () =>{
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
  };

  db = () => {
    return firebase.database()
  }
    
  userLogin = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(error => {
          switch (error.code) {
            case 'auth/invalid-email':
              console.warn('Invalid email address format.');
              break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
              console.warn('Invalid email address or password');
              break;
            default:
              console.warn('Check your internet connection');
          }
          reject(error);
        }).then(user => {
          resolve(user);
      });
    })
  };

  createFirebaseAccount = (name, email, password) => {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(error => {
        let err =''
        switch (error.code) {
          case 'auth/email-already-in-use':
          err = 'This email address is already taken';
            break;
          case 'auth/invalid-email':
          err = 'Invalid e-mail address format';
            break;
          case 'auth/weak-password':
          err = 'Password is too weak';
            break;
          default:
          err = 'Check your internet connection';
        }
        reject(err);
      }).then(info => {
        if (info) {
          firebase.auth().currentUser.updateProfile({
            displayName: name
          });
          resolve(info);
        }
      });
    });
  };

  sendEmailWithPassword = (email) => {
    return new Promise(resolve => {
      firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          console.warn('Email with new password has been sent');
          resolve(true);
        }).catch(error => {
          switch (error.code) {
            case 'auth/invalid-email':
              console.warn('Invalid email address format');
              break;
            case 'auth/user-not-found':
              console.warn('User with this email does not exist');
              break;
            default:
              console.warn('Check your internet connection');
          }
          resolve(false);
        });
    })
  };
  
  postChats = (seller, buyer, message, productId, senderID) =>{
    return new Promise((resolve, reject) => {
      this.db().
      ref('/chats/' + seller + '/' + productId + '/' + buyer + '/').
      push({
          content: message,
          timestamp: Date.now(),
          uid: senderID,
       }).
      then(() => {
        resolve(true)
      }).catch(error =>{
        reject(error)
      })
    })
  }

  getAllNegotiations = (sellerID, productId) =>{
    return new Promise((resolve, reject) => {
      this.db().
      ref('/chats/' + sellerID + '/' + productId + '/').
      once('value').
      then(snapshot => {
        resolve(snapshot.val())
      }).
      catch(error => {
        reject(error)
      })
    })
  }

  getUserNameFromID = (uid) => {
    return new Promise((resolve, reject) => {
      this.db().
      ref('/users/' + uid).
      once('value').
      then(snapshot => {
        resolve(snapshot.val())
      }).
      catch(error => {
        reject(error)
      })
    })
  }

  sendNewDeal = (sellerId, buyerId, productId, amount) =>{
    return new Promise((resolve, reject) => {
      this.db().
      ref('/deals/' + sellerId + '/' + productId + '/' + buyerId + '/').
      set({
          deal: amount,
          timestamp: Date.now(),
       }).
      then((val) => {
        resolve(val)
      }).catch(error =>{
        reject(error)
      })
    })
  }

  getNewDeal = (sellerId, buyerId, productId) =>{
    return new Promise((resolve, reject) => {
      this.db().
      ref('/deals/' + sellerId + '/' + productId + '/' + buyerId + '/').
      once('value').
      then((snapshot) => {
        resolve(snapshot.val())
      }).catch(error =>{
        reject(error)
      })
    })
  }

}

export default new Firebase();