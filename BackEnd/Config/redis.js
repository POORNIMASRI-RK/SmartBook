const { createClient } = require("redis");

const redisClient = createClient({
    url : process.env.REDIS_URL || "redis://localhost:6379"
})

redisClient.on("error", (err) =>{
    console.log("Redis Client Error", err);
})

const connectRedis = async() => {
    try{
        await redisClient.connect();
        console.log("connected to Redis");
    }catch(error){
        console.error("Error connection to Redis:",error);
    }
}

module.exports = { redisClient, connectRedis} 