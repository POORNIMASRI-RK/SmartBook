require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const connectTodb = require("./Config/db");
const productRoutes = require("./Routes/ProductRoute");
const UserRoutes = require("./Routes/UserRoute");
const OrderRoutes = require("./Routes/OrderRoute");
const { connectRedis } = require("./Config/redis");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/", productRoutes);
app.use("/", UserRoutes);
app.use("/", OrderRoutes);

connectTodb();
connectRedis();
app.get("/",(req,res) => {
    res.send("welcome to the backend");
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});