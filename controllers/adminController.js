const Product = require("../models/productModel");

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/addAndEditProduct", {
    pageTitle: "Add Product",
    path: "/admin/addProduct",
    productCSS: true,
    formCSS: true,
    editing: false,
  });
};
exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const p = new Product(null, title, imageUrl, price, description);

  p.save();
  res.redirect("/");
};

exports.getAdminProductsList = async (req, res, next) => {
  const products = await Product.fetchAllProducts();

  res.render("admin/adminProductsList", {
    prods: products,
    pageTitle: "Admin Products List",
    path: "/admin/adminProductsList",
    hasProducts: products.length > 0,
    productCSS: true,
    formCSS: false,
  });
};

exports.getEditProductPage = async (req, res, next) => {
  const editMode = req.query.edit;
  const prodId = req.params.productId;
  const foundProduct = await Product.findProductById(prodId);

  if (!editMode) {
    return res.redirect("/");
  }

  res.render("admin/addAndEditProduct", {
    pageTitle: "Edit Product",
    path: "/admin/editProduct",
    productCSS: true,
    formCSS: true,
    editing: editMode,
    theProduct: foundProduct,
  });
};

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId; //productId is the name we gave in addAndEditProduct.ejs
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedPrice,
    updatedDescription
  );

  updatedProduct.save();
  res.redirect("/admin/adminProductsList");
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);

  res.redirect("/admin/adminProductsList");
};
