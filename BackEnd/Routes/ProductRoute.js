const express = require("express");
const router = express.Router();
const { createProduct, getAllProducts, getProductsById, updateProduct, deleteProduct } = require("../Controller/ProductController");
const UserAuth = require("../Middleware/authMiddleware");
const AdminAuth = require("../Middleware/adminMiddleware");

router.post("/create", UserAuth, AdminAuth,createProduct);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductsById);
router.put("/products/:id",UserAuth, AdminAuth, updateProduct);
router.delete("/products/:id",UserAuth, AdminAuth, deleteProduct);

module.exports = router;