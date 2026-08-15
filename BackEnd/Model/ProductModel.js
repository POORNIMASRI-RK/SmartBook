const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    
    BookName: {
        type: String,
        required: true,
        unique: true,
    },

    Price:{
        type: Number,
        required: true,
    },

    Rating:{
        type: Number,
        required: true,
    },
    Age:{
        type: Number,
        required: true,
    },
    Language:{
        type: String,
        required: true,
    },
    Image:{
        type: String,
        required: true,
    }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;