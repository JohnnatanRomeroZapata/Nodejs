const Product = require("../models/productModel");

exports.getIndexPage = async (req, res, next) => {
  try {
    const allProducts = await Product.findAll();

    await res.render("shop/index", {
      prods: allProducts,
      pageTitle: "Shop",
      path: "/",
      hasProducts: allProducts.length > 0,
      productCSS: true,
      formCSS: false,
      cartCSS: false,
    });
  } catch (err) {
    console.error(err);
  }
};

exports.getProductsPage = async (req, res, next) => {
  try {
    const allProducts = await Product.findAll();

    await res.render("shop/productsList", {
      prods: allProducts,
      pageTitle: "All Products",
      path: "/productsList",
      hasProducts: allProducts.length > 0,
      productCSS: true,
      formCSS: false,
      cartCSS: false,
    });
  } catch (err) {
    console.error(err);
  }
};

exports.getProductDetailPage = async (req, res, next) => {
  const prodId = req.params.productId; //productId is the name we gave in shopRouter.js after :

  try {
    const theProd = await Product.findByPk(prodId);

    await res.render("shop/productDetail", {
      theProduct: theProd,
      pageTitle: theProd.title,
      path: "/productDetail",
      productCSS: true,
      formCSS: false,
      cartCSS: false,
    });
  } catch (err) {
    console.error(err);
  }
};

exports.getCartPage = async (req, res, next) => {
  try {
    const userCart = await req.user.getCart();
    const userCartProducts = await userCart.getProducts();

    await res.render("shop/cart", {
      pageTitle: "Cart",
      path: "/cart",
      productCSS: true,
      formCSS: false,
      cartCSS: true,
      products: userCartProducts,
      hasProducts: userCartProducts.length > 0,
    });
  } catch (err) {
    console.error(err);
  }
};
exports.postCart = async (req, res, next) => {
  const prodId = req.body.pId; //pId is the name we gave to the hidden input in addToCart.ejs

  try {
    const userCart = await req.user.getCart();

    const userCartProducts = await userCart.getProducts({
      where: { id: prodId },
    });

    let productInCart;

    if (userCartProducts.length > 0) {
      productInCart = userCartProducts[0];
    }

    let newQuantity = 1;

    if (productInCart) {
      const oldQuantity = productInCart.cartItem.quantity; //cartItem (extra field that gets edited by sequelize to give us access to between table) and quantity is find inside the model

      newQuantity += oldQuantity;

      await userCart.addProduct(productInCart, {
        through: { quantity: newQuantity },
      });
    } else {
      const prodToAddToCart = await Product.findByPk(prodId);

      await userCart.addProduct(prodToAddToCart, {
        through: { quantity: newQuantity },
      });
    }

    await res.redirect("/cart");
  } catch (err) {
    console.error(err);
  }
};

exports.postCartDeleteItem = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const userCart = await req.user.getCart();

    const userCartProducts = await userCart.getProducts({
      where: { id: prodId },
    });

    const productToDeleteFromCart = userCartProducts[0];

    await productToDeleteFromCart.cartItem.destroy(); //cartItem (extra field that gets edited by sequelize to give us access to between table) and quantity is find inside the model

    await res.redirect("/cart");
  } catch (err) {
    console.error(err);
  }
};

exports.getOrdersPage = async (req, res, next) => {
  try {
    const userOrders = await req.user.getOrders({ include: ["products"] });

    res.render("shop/orders", {
      pageTitle: "Orders",
      path: "/orders",
      productCSS: true,
      formCSS: false,
      cartCSS: false,
      hasOrders: userOrders.length > 0,
      orders: userOrders,
    });
  } catch (err) {
    console.error(err);
  }
};
exports.postOrder = async (req, res, next) => {
  try {
    const userCart = await req.user.getCart();
    const userCartProducts = await userCart.getProducts();
    const userOrder = await req.user.createOrder();
    const arrayOfProducts = await Promise.all(
      userCartProducts.map(async (p) => {
        p.orderItem = { quantity: await p.cartItem.quantity };
        return p;
      })
    );

    await userOrder.addProducts(arrayOfProducts);

    await userCart.setProducts(null);

    await res.redirect("/orders");
  } catch (err) {
    console.error(err);
  }
};

exports.getCheckoutPage = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
    productCSS: true,
    formCSS: false,
    cartCSS: false,
  });
};
