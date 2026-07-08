import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function BuyNow() {
const navigate = useNavigate();
const { state } = useLocation();

const product = state?.product;
const cart = state?.cart;

const [formData, setFormData] = useState({
name: "",
phone: "",
address: "",
payment: "Cash on Delivery",
});

if (!product) {
return (
    <div className="min-h-screen flex items-center justify-center">
    <h2 className="text-2xl font-bold">No Product Selected</h2>
    </div>
);
}

const handleChange = (e) => {
setFormData({
    ...formData,
    [e.target.name]: e.target.value,
});
};

const placeOrder = () => {
if (
    !formData.name ||
    !formData.phone ||
    !formData.address 
) {
    alert("Please fill all required fields.");
    return;
}

navigate("/success", {
    state: {
    product,
    customer: formData,
    },
});
};

return (
<>
    <Navbar cartCount={0} />

    <div className="bg-gray-100 min-h-screen p-8">

    <div className="grid md:grid-cols-2 gap-10">

        {/* Order Summary  and Customer Detail*/}

        <div className="bg-white rounded-lg shadow-lg p-6 items-center">

        <h2 className="text-2xl font-semibold mb-5">
            Order Summary
        </h2>

        <img
            src={product.image}
            alt={product.name}
            className="h-72 mx-auto"
        />

        <h2 className="text-xl font-bold mt-5">
            {product.name}
        </h2>

        <p className="mt-2">
            ⭐ {product.rating}
        </p>

        <p className="mt-2">
            Language : {product.language}
        </p>

        <p className="mt-2">
            Age : {product.age}
        </p>

        <h3 className="text-2xl font-bold text-green-700 mt-5">
            Price: {product.price}
        </h3>

        {/* <hr className="my-6" /> */}

        <div className="flex gap-2">
            
            <button onClick={() => removeItem(item.id)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer">
                -
            </button>

            <button onClick={() => increaseItem(item.id)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer">
                +
            </button>
        </div>
                

        <div >
        <h3 className="text-2xl font-semibold mb-6">
            Customer Details
        </h3>

        <input
            type="text"
            placeholder="Full Name"
            name="name"
            onChange={handleChange}
            className="border p-3 rounded w-full mb-4"
        />

        <input
            type="text"
            placeholder="Mobile Number"
            name="phone"
            onChange={handleChange}
            className="border p-3 rounded w-full mb-4"
        />

        <textarea
            placeholder="Shipping Address"
            name="address"
            onChange={handleChange}
            className="border p-3 rounded w-full mb-4"
        />
        </div>

        <h2 className="font-semibold mb-3">
            Payment Method
        </h2>

        <select
            name="payment"
            onChange={handleChange}
            className="border p-3 rounded w-full"
        >
            <option>Cash on Delivery</option>
            <option>UPI</option>
            <option>Credit Card</option>
            <option>Debit Card</option>
        </select>

        <button onClick={placeOrder} className="mt-8 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
            Place Order
        </button>

        </div>

    </div>

    </div>

    <Footer />
</>
);
}

export default BuyNow;