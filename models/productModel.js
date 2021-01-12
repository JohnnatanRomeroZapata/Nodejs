const fs = require("fs");
const path = require("path");
const thePath = require("../util/path");
const Cart = require("./cartModel");

const p = path.join(thePath, "data", "fileOfProducts.json");

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    (this.id = id), (this.title = title);
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  static async fetchAllProducts() {
    const fileExist = fs.existsSync(p);

    if (fileExist) {
      const fileInfo = await fs.promises.readFile(p);

      const data = JSON.parse(fileInfo);

      return data;
    } else {
      fs.writeFile(p, "[]", (err) => {
        console.log(err);
      });
    }
  }

  async save() {
    if (this.id) {
      //const allProducts = await this.fetchAllProducts();

      const fileInfo = await fs.promises.readFile(p);

      const allProducts = JSON.parse(fileInfo);

      const existingProductIndex = allProducts.findIndex(
        (prod) => prod.id === this.id
      );
      const updatedProducts = [...allProducts];
      updatedProducts[existingProductIndex] = this;
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        console.log(err);
      });
    } else {
      this.id = Math.random().toString();
      let arrayOfProducts = [];
      const fileData = await fs.promises.readFile(p);
      arrayOfProducts = JSON.parse(fileData);
      arrayOfProducts.push(this);
      fs.writeFile(p, JSON.stringify(arrayOfProducts), (err) => {
        console.log(err);
      });
    }
  }

  static async findProductById(id) {
    const allProducts = await this.fetchAllProducts();

    const theSpecificProduct = allProducts.find((p) => p.id === id);

    return theSpecificProduct;
  }

  static async deleteById(id) {
    const allProducts = await this.fetchAllProducts();

    const product = allProducts.find((prod) => prod.id === id);

    const productPrice = product.price;

    const updatedArrayOfProduct = allProducts.filter((prod) => prod.id !== id);

    fs.writeFile(p, JSON.stringify(updatedArrayOfProduct), (err) => {
      if (!err) {
        Cart.deleteProductFromCart(id, productPrice);
      }
    });
  }
};
