import Firebase from "./Firebase/firebase.js";

class Api {
  constructor(props) {
    Firebase.initializeApp()
  }

  getItemUsingID(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Firebase.getAllProducts().
        then(val => {
          var allProducts = []
          for (var i = 0; i < val.length; i++) {
            allProducts.push(Object.values(val[i])[0])
          }

          let res = allProducts.filter(x => x.id === parseInt(id, 10));
          resolve(res.length === 0 ? null : res[0]);
        })
      }, 500);
    });
  }

  sortByPrice(data, sortval) {
    if (sortval !== "lh" && sortval !== "hl") return data;

    let items = [...data];

    if (sortval === "lh") {
      items.sort((a, b) => a.price - b.price);
    } else {
      items.sort((a, b) => b.price - a.price);
    }

    return items;
  }

  searchItems({
    category = "popular",
    term = "",
    sortValue = "lh",
    itemsPerPage = 10,
    usePriceFilter = "false",
    minPrice = 0,
    maxPrice = 1000,
    page = 1
  }) {
    
    // Turn this into a boolean
    usePriceFilter = usePriceFilter === "true" && true;
    
    return new Promise((resolve, reject) => {

      setTimeout(() => {
        Firebase.getAllProducts().
        then(val => {
          var allProducts = []
          for (var i = 0; i < val.length; i++) {
            allProducts.push(Object.values(val[i])[0])
          }

          let data = allProducts.filter(item => {
            if (
              usePriceFilter &&
              (item.price < minPrice || item.price > maxPrice)
            ) {
              return false;
            }
  
            if (category === "popular") {
              return item.popular;
            }
  
            if (category !== "All categories" && category !== item.category)
              return false;
  
            if (term && !item.name.toLowerCase().includes(term.toLowerCase()))
              return false;
  
            return true;
          });
  
          let totalLength = data.length;
  
          data = this.sortByPrice(data, sortValue);
  
          data = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  
          resolve({ data, totalLength });
        })
      }, 500);
    });
  }
}

export default new Api();
