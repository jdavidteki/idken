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

  sealDeal = (sellerId, productId, action) => {
    return new Promise((resolve, reject) => {
      this.db().
      ref('/deals/' + sellerId + '/' + productId + '/dealSealed/').
      set({
          dealSealed: action,
       }).
      then((val) => {
        resolve(val)
      }).catch(error =>{
        reject(error)
      })
    })
  }


  ceateNewProduct = (productInfo) =>{
    return new Promise((resolve, reject) => {
      this.db().
      ref('/products/' + productInfo.id + '/').
      push({
          id: productInfo.id,
          name: productInfo.name,
          category: productInfo.category,
          sellerId: productInfo.sellerId,
          price: productInfo.price,
          description: productInfo.description,
          popular: productInfo.popular,
          imageUrls: productInfo.imageUrls
       }).
      then(() => {
        resolve(true)
      }).catch(error =>{
        reject(error)
      })
    })
  }

  getAllProducts = () => {
    return new Promise((resolve, reject) => {
      this.db().
      ref('/products/').
      once('value').
      then(snapshot => {
        if (snapshot.val()){
            resolve(Object.values(snapshot.val()))
          }else{
            resolve({})
        }
      }).
      catch(error => {
        reject(error)
      })
    })
  }

  getItemsInUserCart = (uid) => {
    return new Promise((resolve, reject) => {
      this.db().
      ref('/carts/' + uid).
      once('value').
      then(snapshot => {
        resolve(snapshot.val())
      }).
      catch(error => {
        reject(error)
      })
    })
  }

  addItemToCart = (obj) => {
    this.db().
    ref('/carts/' + obj.uid).
    once('value', snapshot => {
      let val = [];
      let allItems = [];
      
      if (snapshot.val()) {
        val = Object.values(snapshot.val())
        for (var i = 0; i < val.length; i++) {
          allItems.push({...val[i].item})
        }
      }

      let index = allItems.findIndex(x => x.id === obj.item.id);
      // Is the item user wants to add already in the cart?
      if (index !== -1) {
        this.db().
        ref('/carts/').
        child(obj.uid + '/' + obj.item.id + '/item/').
        update({
          quantity: allItems[index].quantity + obj.quantity,
        })

      }else{
        this.db().
        ref('/carts/').
        child(obj.uid + '/' + obj.item.id).
        set({
          item: {...obj.item, quantity: obj.quantity,},
        })
      }
    })
  }

  updateCartItemQnt = (obj) => {
    this.db().
    ref('/carts/' + obj.uid).
    once('value', snapshot => {
      let val = [];
      let allItems = [];
      
      if (snapshot.val()) {
        val = Object.values(snapshot.val())
        for (var i = 0; i < val.length; i++) {
          allItems.push({...val[i].item})
        }
      }

      let index = allItems.findIndex(x => x.id === obj.id);

      if (index !== -1) {
        this.db().
        ref('/carts/').
        child(obj.uid + '/' + obj.id + '/item/').
        update({
          quantity: obj.quantity,
        })
      }
    })
  }

  deleteDeal = (product) => {
    return new Promise(resolve => {
      this.db().
      ref('/deals/' + product.sellerId).
      child(product.id).
      remove().
      then(() => {
        resolve(true)
      })
    })
  }

  deleteItemFromCart = (obj) => {
    return new Promise(resolve => {
      this.db().
      ref('/carts/' + obj.uid).
      child(obj.product.id).
      remove().
      then(() => {
        this.deleteDeal(obj.product)
        resolve(true)
      })
    })
  }
}

export default new Firebase();