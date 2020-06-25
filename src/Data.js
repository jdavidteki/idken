
// List of item categories.
const categories = [
  {
    name: "All categories",
    icon: "all_categories"
  },
  {
    name: "Phones",
    icon: "phones"
  },
  {
    name: "Tablets",
    icon: "tablets"
  },
  {
    name: "ITEC Equipment",
    icon: "itec_equipment"
  },
  {
    name: "Laptops",
    icon: "laptops"
  },
  {
    name: "Accessories",
    icon: "accessories"
  }
];

// Data for rendering menu.
const dataForTheMenu = [
  { name: "Home page", 
    url: "/", 
    icon: "home", 
    id: 0 
  },
  {
    name: "Product categories",
    id: 1,
    icon: "product_categories",
    children: categories.map((x, i) => {
      return {
        name: x.name,
        id: i,
        url: "/?category=" + x.name,
        icon: x.icon
      };
    })
  },
  {
    name: "ICT Academy",
    id: 2,
    url: "/ictacademy",
    icon: "ict_academy",
  },

];


export {categories, dataForTheMenu };
