const Product = require("../models/productModel");

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/addAndEditProduct", {
    pageTitle: "Add Product",
    path: "/admin/addProduct",
    productCSS: true,
    formCSS: true,
    cartCSS: false,
    editing: false,
  });
};
exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  try {
    /*
      Here req.user is a sequelize object with the values registered in the db and all 
      its helper methods.

      When an association is defined between two models, the instances of those models 
      gain special methods to interact with their associated counterparts.

      for example createProduct() --> is a special methods from sequelize 
      due to the association between both models

    */
    await req.user.createProduct({
      title: title,
      imageUrl: imageUrl,
      price: price,
      description: description,
    });

    await res.redirect("/admin/adminProductsList");
  } catch (err) {
    console.log(err);
  }
};

exports.getAdminProductsList = async (req, res, next) => {
  try {
    const allProducts = await req.user.getProducts();

    await res.render("admin/adminProductsList", {
      prods: allProducts,
      pageTitle: "Admin Products List",
      path: "/admin/adminProductsList",
      hasProducts: allProducts.length > 0,
      productCSS: true,
      formCSS: false,
      cartCSS: false,
    });
  } catch (err) {
    console.error(err);
  }
};

exports.getEditProductPage = async (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  try {
    const prodId = req.params.productId;
    const theProd = await req.user.getProducts({ where: { id: prodId } }); //getProducts returns an array
    //const theProd = await Product.findByPk(prodId);

    await res.render("admin/addAndEditProduct", {
      pageTitle: "Edit Product",
      path: "/admin/editProduct",
      productCSS: true,
      formCSS: true,
      cartCSS: false,
      editing: editMode,
      theProduct: theProd[0],
    });
  } catch (err) {
    console.error(err);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId; //productId is the name we gave in addAndEditProduct.ejs
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  try {
    const theProdToUpdate = await Product.findByPk(prodId);

    theProdToUpdate.title = updatedTitle;
    theProdToUpdate.imageUrl = updatedImageUrl;
    theProdToUpdate.price = updatedPrice;
    theProdToUpdate.description = updatedDescription;

    await theProdToUpdate.save();

    await res.redirect("/admin/adminProductsList");
  } catch (err) {
    console.error(err);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const theProdToDelete = await Product.findByPk(prodId);

    await theProdToDelete.destroy();

    await res.redirect("/admin/adminProductsList");
  } catch (err) {
    console.error(err);
  }
};
