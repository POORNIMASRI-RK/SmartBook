const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            productName:{
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type:Number,
                required: true,
            },
        },
    ],
    totalPrice:{
        type: Number,
        required: true,
    },
    userName:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true
    },
    paymentMethod:{
        type: String,
        enum: ['Cash on Delivery', 'UPI', 'Credit Card', 'Debit Card'],
        required: true,
        default: "Cash on Delivery"
    },
    status:{
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending"
    },
    timeStamp:{
        type: Date,
        default: Date.now,
    },

});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;