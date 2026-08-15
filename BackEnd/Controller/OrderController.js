const Order = require("../Model/OrderModel");

const addOrder = async (req, res) => {
    try{
        const { 
            user, 
            products, 
            totalPrice, 
            userName, 
            phone, 
            address, 
            paymentMethod 
        } = req.body;

        const userId = req.body.user || req.user?._id || req.user?.id;

        const order = await Order.create({
            ...req.body,
            user: userId,
        });

        res.status(201).json({
            success: true,
            message: "Order Placed successfully",
            order,
        });

    }catch(error){
        res.status(500).json({
            success: false,
            message: "Failed to Order",
            error: error.message,
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user")
            .populate("products.product");

        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Order not fetched",
            error: error.message,
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id || req.body?.userId || req.query?.userId;

        const orders = await Order.find({ user: userId })
            .populate("user")
            .populate("products.product");

        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders,
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Order not fetched by id",
            error: err.message,
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        console.log("Order ID:", orderId);
        console.log("New Status:", status);

        const validStatus = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        if (!validStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed values: ${validStatus.join(", ")}`
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        console.log("Old Status:", order.status);

        order.status = status;

        const updatedOrder = await order.save();

        console.log("Updated Order:", updatedOrder);

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.error("UPDATE ORDER STATUS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: error.message
        });
    }
};
const updateOrder = async (req, res) => {
    try{
        const product = await Order.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "order update successfull",
            product,
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message:"Internal Server Error"
        })
    }
};

const deleteOrder = async (req, res) => {
    try {
        console.log("Deleting Order ID:", req.params.id);

        const order = await Order.findByIdAndDelete(req.params.id);

        console.log("Deleted Order:", order);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
            order,
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

module.exports = { addOrder, getAllOrders, getOrderById, updateOrderStatus, updateOrder, deleteOrder };