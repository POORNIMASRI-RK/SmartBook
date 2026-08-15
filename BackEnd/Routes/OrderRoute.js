const express = require("express");
const router = express.Router();
const UserAuth = require("../Middleware/authMiddleware");
const AdminAuth = require("../Middleware/adminMiddleware");
const { addOrder, getAllOrders, getOrderById, updateOrderStatus, updateOrder, deleteOrder } = require("../Controller/OrderController");

router.post("/addOrder",UserAuth, addOrder);
router.get("/getAllOrders", AdminAuth, getAllOrders);
router.get("/getOrderById", UserAuth, getOrderById);
router.put("/updateOrderStatus/:id", AdminAuth, updateOrderStatus);
router.put("/updateOrder/:id", UserAuth, updateOrder);
router.delete("/deleteOrder/:id",UserAuth,deleteOrder)

module.exports = router;