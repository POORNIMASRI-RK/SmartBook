const { redisClient } = require("../Config/redis");
const Product = require("../Model/ProductModel");

const createProduct = async(req, res) => {
    try{
        const product = await Product.create(req.body);
        
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "faild to create Product",
            error: error.message,
        });
    }
};

const getAllProducts = async(req, res) => {
    try{
        const cachedProducts = await redisClient.get("products");

        if(cachedProducts){
            return res.status(200).json({
                success: true,
                message: " Products fetched successfully",
                products: JSON.parse(cachedProducts),
                source:"redis Cache"
            });
        }
        const products = await Product.find();
        await redisClient.setEx("products", 60 * 5, JSON.stringify(products));

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products,
            source:"MongoDB",
        })
    }catch (error){
        res.status(500).json({
            success: false,
            message: "Failed to fetch product ",
            error: error.message,
        });
    }
};

const getProductsById = async(req, res) =>{
    try{
        const products = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({
                success:false,
                message: "No Product found"
            });
        }
        res.status(200).json({
            success: true,
            message: "product fetched by ID",
            product,
        });
    }catch(error){
        res.status(500).json({
            success: false, 
            message: "Failed to fetch product By ID",
            error: error.message,
        });
    }
};

const updateProduct = async(req, res) =>{
    try{
        const product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,});
        res.status(200).json({
            status: true,
            message: "Product update successfully",
            product,
        });  
    }catch(error){
        res.status(500).json({
            status: false,
            message:" Failed for update by ID",
            error: error.message,
        });
    } 
};

const deleteProduct = async(req,res) => {
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product){
            return res.status(404).json({
                status: false,
                message: "product not found",
            });
        }
        res.status(200).json({
            status: true,
            message:"Product Deleted Successfully",
            product,
        });

    }catch(error){
        res.status(500).json({
            status: false,
            message: "Failed to delete",
            error: error.message,
        });
    }
};

module.exports = { createProduct, getAllProducts, getProductsById, updateProduct, deleteProduct};