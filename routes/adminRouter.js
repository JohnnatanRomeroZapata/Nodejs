const express = require("express");
const router = express.Router(); //Router(): Creates a new router object

const adminController = require("../controllers/adminController");

router.get("/addProduct", adminController.getAddProductPage);
router.post("/addProduct", adminController.postAddProduct);

router.get("/adminProductsList", adminController.getAdminProductsList);

router.get("/editProduct/:productId", adminController.getEditProductPage);
router.post("/editProduct/", adminController.postEditProduct);

router.post("/deleteProduct", adminController.postDeleteProduct);

module.exports = router;
