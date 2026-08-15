const  mongoose  = require("mongoose");
require("dotenv").config();

const dns = require("dns");
    dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectTodb = async() => {
    try{
        const connection = await mongoose.connect(

            process.env.MONGODB_URI
        );
        console.log("connect to MongoDB");
        return connection;
    }catch (error){
        console.log(error);
    }
}

module.exports = connectTodb;
