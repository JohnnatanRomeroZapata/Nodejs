const express = require("express");
const router = express.Router(); //Router(): Creates a new router object

const shopController = require("../controllers/shopController");

router.get("/", shopController.getIndexPage);

router.get("/productsList", shopController.getProductsPage);

router.get("/productDetails/:productId", shopController.getProductDetailPage);

router.get("/cart", shopController.getCartPage);
router.post("/cart", shopController.postCart);
router.post("/cartDeleteItem", shopController.postCartDeleteItem);

router.get("/orders", shopController.getOrdersPage);

router.get("/checkout", shopController.getCheckoutPage);

module.exports = router;
