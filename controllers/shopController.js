const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

exports.getIndexPage = async (req, res, next) => {
  const products = await Product.fetchAllProducts();

  res.render("shop/index", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    productCSS: true,
    formCSS: false,
  });
};

exports.getProductsPage = async (req, res, next) => {
  const products = await Product.fetchAllProducts();

  res.render("shop/productsList", {
    prods: products,
    pageTitle: "All Products",
    path: "/productsList",
    hasProducts: products.length > 0,
    productCSS: true,
    formCSS: false,
  });
};

exports.getProductDetailPage = async (req, res, next) => {
  const prodId = req.params.productId; //productId is the name we gave in shopRouter.js after :

  const foundProduct = await Product.findProductById(prodId);

  res.render("shop/productDetail", {
    theProduct: foundProduct,
    pageTitle: "Product Detail",
    path: "/productDetail",
    productCSS: true,
    formCSS: false,
  });
};

exports.getCartPage = async (req, res, next) => {
  const cartProducts = await Cart.fetchAllCartProducts();

  const products = await Product.fetchAllProducts();

  const arrayOfCartProducts = [];

  for (product of products) {
    const cartProductData = cartProducts.products.find(
      (prod) => prod.id === product.id
    );
    if (cartProductData) {
      arrayOfCartProducts.push({
        productData: product,
        qty: cartProductData.qty,
      });
    }
  }

  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
    productCSS: true,
    formCSS: false,
    products: arrayOfCartProducts,
    hasProducts: arrayOfCartProducts.length > 0,
  });
};
exports.postCart = async (req, res, next) => {
  const prodId = req.body.pId; //pId is the name we gave to the hidden input in addToCart.ejs
  const foundProduct = await Product.findProductById(prodId);
  Cart.addProduct(prodId, foundProduct.price);
  res.redirect("/cart");
};

exports.postCartDeleteItem = async (req, res, next) => {
  const prodId = req.body.productId;
  const foundProduct = await Product.findProductById(prodId);
  Cart.deleteProductFromCart(prodId, foundProduct.price);

  res.redirect("/cart");
};

exports.getOrdersPage = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
    productCSS: true,
    formCSS: false,
  });
};

exports.getCheckoutPage = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
    productCSS: true,
    formCSS: false,
  });
};
