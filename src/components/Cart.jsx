import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BuyNow from "./BuyNow";

const Cart = ({ cart, setCart }) => {
console.log("cart in cart.jsx :", cart);
const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

const removeItem = (id) => {
setCart((prev) =>
    prev
    .map((item) =>
        item.id === id
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
    .filter((item) => item.quantity > 0)
);
};

const increaseItem = (id) => {
setCart((prev) =>
    prev.map((item) => {
    if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
    }
    return item;
    })
);
};

const clearItem = (id) => {
setCart((prev) => prev.filter((item) => item.id !== id));
};

return (
<div className="min-h-dvh">
    <Navbar cartCount={cartCount} />

    <h1 className="text-2xl text-center"> Shopping Cart </h1>

    <div className="flex items-center gap-3 mt-5 m-4">
    {cart.length === 0 ? (
        <p> Your cart is empty. </p>
    ) : (
        <div className="grid grid-cols-4 gap-4">
        {cart.map((item, index) => {
            const unitPrice = Number(String(item.price).replace("Rs.", ""));
            const totalPrice = unitPrice * item.quantity;

            return (
            <div
                key={index}
                className="bg-white p-2 rounded-lg shadow-md flex flex-col items-center gap-3 cursor-pointer "
            >
                <img src={item.image} alt={item.name} className = "h-[250px]" />
                <h2> {item.name} </h2>
                <p> {item.price} </p>

                <div>
                <p> Quantity: {item.quantity} </p>
                </div>

                <div> 
                <p> Total Price: ${totalPrice.toFixed(2)} </p>
                </div>
                <div className="flex gap-2">
                <button onClick={() => removeItem(item.id)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer">
                    -
                </button>

                <button onClick={() => increaseItem(item.id)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer">
                    +
                </button>
                </div>

                <div>
                <button onClick={() => Navigate("/BuyNow",{state:{buyNow:false, cart,},})} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 transition-colors">
                    Buy Book Now
                </button>
                </div>

                <div>
                <button onClick={() => clearItem(item.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                    Remove from Cart
                </button>
                </div>
                
            </div>
            );
        })}
        </div>
    )}
    </div>
    <div className="fixed bottom-0 w-full">
    </div>
    <Footer />
</div>
);
};

export default Cart;