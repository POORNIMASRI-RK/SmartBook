import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { increaseQuantity, decreaseQuantity, clearItem, clearCart} from "../features/cart/cartSlice";
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Minus,
  Plus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart.items);

  // Total quantity of all products
  const parsePrice = (priceVal) => {
    if (typeof priceVal === "number"){ 
      return priceVal;
    }
    if (typeof priceVal === "string") {
      const cleaned = priceVal.replace(/[^0-9.]/g, "");
      return parseFloat(cleaned) || 0;
    }
    return 0;
  };

  // Total price
  const totalPrice = cart.reduce((sum, item) => {
    return sum + parsePrice(item.Price) * item. quantity;
  },0);

  return (
    <div className="min-h-screen bg-gray text-[#2B2118]">

      {/* Navbar */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Page Breadcrumb & Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <span onClick={() => navigate("/")} className="hover:text-blue-600 cursor-pointer">Home</span>
              <span>/</span>
              <span className="text-slate-900 font-medium">Cart</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span>Shopping Cart</span>
              {cart.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                </span>
              )}
            </h1>
          </div>

          {cart.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to clear your cart?")) {
                  dispatch(clearCart());
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center max-w-xl mx-auto my-12 flex flex-col items-center">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-500 max-w-sm mb-8 text-sm leading-relaxed">
              Looks like you haven't added anything to your cart yet. Explore our awesome collection and find something you love!
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 bg-[#5C3A21] hover:bg-yellow-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-yellow-600/20 hover:shadow-yellow-600/30 transition transform hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Start Shopping
            </button>
          </div>
        ) : (
          /* Main Cart Content Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Items Card Stack */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                {cart.map((item, index) => {
                  const itemId = item._id || item.id;
                  const unitPrice = parsePrice(item.Price);
                  const itemTotalPrice = unitPrice * item.quantity;

                  return (
                    <div
                      key={itemId || index}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover:bg-slate-50/60 transition"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200 relative group">
                        <img
                          src={item.Image}
                          alt={item.BookName || item.name}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition duration-300"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 text-center sm:text-left min-w-0">
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg truncate line-clamp-1 mb-1">
                          {item.BookName || item.name}
                        </h3>
                        <p className="text-sm font-semibold text-blue-600 mb-3">
                          ₹{unitPrice.toFixed(2)}{" "}
                          <span className="text-slate-400 font-normal text-xs">/ each</span>
                        </p>

                        {/* Mobile Stepper + Price */}
                        <div className="flex items-center justify-between sm:justify-start gap-4">
                          {/* Quantity Selector */}
                          <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white shadow-sm overflow-hidden">
                            <button
                              onClick={() => dispatch(decreaseQuantity(itemId))}
                              className="p-1.5 sm:p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition border-r border-slate-200"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 py-1 font-semibold text-sm text-slate-800 min-w-[36px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => dispatch(increaseQuantity(itemId))}
                              className="p-1.5 sm:p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition border-l border-slate-200"
                              title="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => dispatch(clearItem(itemId))}
                            className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Line Price Total */}
                      <div className="text-right sm:self-center flex sm:flex-col items-center justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span className="text-xs text-slate-400 sm:hidden">Total:</span>
                        <span className="font-extrabold text-slate-900 text-lg sm:text-xl">
                          ₹{itemTotalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Link */}
              <div className="pt-2">
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
                  Order Summary
                </h2>

                {/* Total */}
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-lg font-bold text-slate-900">Total Price</span>
                  <span className="text-3xl font-black ">
                    ₹{totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-[#5C3A21] hover:bg-yellow-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition flex items-center justify-center gap-2 text-base group"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500 font-medium">
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RotateCcw className="w-4 h-4 text-blue-600" />
                    <span>30-Day Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

    </div>
  );
};

export default Cart;