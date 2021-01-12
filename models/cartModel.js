const fs = require("fs");
const path = require("path");
const thePath = require("../util/path");

const p = path.join(thePath, "data", "cart.json");

module.exports = class Product {
  static async fetchAllCartProducts() {
    const fileExist = fs.existsSync(p);

    if (fileExist) {
      const fileInfo = await fs.promises.readFile(p);

      const data = JSON.parse(fileInfo);

      return data;
    } else {
      return null;
    }
  }

  static addProduct(id, productPrice) {
    //Fetching the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      let updatedProduct;

      if (!err) {
        cart = JSON.parse(fileContent);
      }

      //Analyzing the cart --> Find existing product
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];

      //Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice += Number(productPrice);

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProductFromCart(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }

      const cart = JSON.parse(fileContent);

      const updatedCart = { ...cart };

      const productToDelete = updatedCart.products.find(
        (prod) => prod.id === id
      );

      if (!productToDelete) {
        return;
      }

      const productQtyToDelete = productToDelete.qty;

      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );

      updatedCart.totalPrice -= productQtyToDelete * productPrice;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }
};
