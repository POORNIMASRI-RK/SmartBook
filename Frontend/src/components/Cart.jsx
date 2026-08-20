import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { increaseQuantity, decreaseQuantity, clearItem, clearCart } from "../features/cart/cartSlice";
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
  Sparkles,
} from "lucide-react";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart.items);

  const parsePrice = (priceVal) => {
    if (typeof priceVal === "number") return priceVal;
    if (typeof priceVal === "string") {
      const cleaned = priceVal.replace(/[^0-9.]/g, "");
      return parseFloat(cleaned) || 0;
    }
    return 0;
  };

  const totalPrice = cart.reduce((sum, item) => {
    return sum + parsePrice(item.Price) * item.quantity;
  }, 0);

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2C1810]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8DCCB]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4A017] uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Checkout Drawer</span>
            </div>
            <h1 className="text-3xl font-extrabold font-serif text-[#2C1810] tracking-tight flex items-center gap-3">
              <span>Your Shopping Cart</span>
              {cart.length > 0 && (
                <span className="bg-[#5C3A21] text-[#FFF8E7] text-xs px-3 py-1 rounded-full font-bold">
                  {totalItemCount} Items
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl border border-[#E8DCCB] shadow-sm p-12 text-center max-w-lg mx-auto my-12 flex flex-col items-center">
            <div className="w-20 h-20 bg-[#FFF8E7] text-[#5C3A21] rounded-full flex items-center justify-center mb-5 shadow-inner">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-[#2C1810] mb-2">
              Your cart is currently empty
            </h2>
            <p className="text-gray-500 text-sm max-w-sm mb-8 leading-relaxed">
              Looks like you haven't added any books to your cart yet. Explore our awesome collection and find your next favorite read!
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 bg-[#5C3A21] hover:bg-[#3E2615] text-[#FFF8E7] font-bold px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" />
              Start Shopping
            </button>
          </div>
        ) : (
          /* Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-[#E8DCCB] shadow-sm overflow-hidden divide-y divide-[#F3EFEA]">
                {cart.map((item, index) => {
                  const itemId = item._id || item.id;
                  const unitPrice = parsePrice(item.Price);
                  const itemTotalPrice = unitPrice * item.quantity;
                  const itemName = item.BookName || item.name || "Book";

                  return (
                    <div
                      key={itemId || index}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover:bg-[#FFF8E7]/40 transition duration-200"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-28 sm:w-28 sm:h-32 bg-[#FFF8E7] rounded-xl overflow-hidden flex-shrink-0 border border-[#E8DCCB] p-2 flex items-center justify-center relative group">
                        <img
                          src={item.Image}
                          alt={itemName}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400";
                          }}
                          className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 text-center sm:text-left min-w-0">
                        <h3 className="font-bold font-serif text-[#2C1810] text-base sm:text-lg line-clamp-1 mb-1">
                          {itemName}
                        </h3>
                        <p className="text-sm font-bold text-[#5C3A21] mb-3">
                          ₹{unitPrice.toFixed(2)}{" "}
                          <span className="text-gray-400 font-normal text-xs">/ each</span>
                        </p>

                        {/* Stepper + Remove */}
                        <div className="flex items-center justify-between sm:justify-start gap-4">
                          <div className="inline-flex items-center border border-[#D6C6B8] rounded-xl bg-white shadow-sm overflow-hidden">
                            <button
                              onClick={() => dispatch(decreaseQuantity(itemId))}
                              className="p-2 text-gray-600 hover:bg-[#FFF8E7] hover:text-[#5C3A21] transition border-r border-[#E8DCCB]"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3.5 py-1 font-bold text-sm text-[#2C1810] min-w-[36px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => dispatch(increaseQuantity(itemId))}
                              className="p-2 text-gray-600 hover:bg-[#FFF8E7] hover:text-[#5C3A21] transition border-l border-[#E8DCCB]"
                              title="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => dispatch(clearItem(itemId))}
                            className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right sm:self-center flex sm:flex-col items-center justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F3EFEA]">
                        <span className="text-xs text-gray-400 sm:hidden font-medium">Subtotal:</span>
                        <span className="font-black text-[#5C3A21] text-lg sm:text-xl">
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
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#5C3A21] hover:text-[#3E2615] transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-[#E8DCCB] shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold font-serif text-[#2C1810] mb-6 pb-3 border-b border-[#F3EFEA]">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-gray-800">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-emerald-600">Free</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 border-t border-[#F3EFEA]">
                    <span className="text-base font-bold text-[#2C1810]">Total Payable</span>
                    <span className="text-2xl font-black text-[#5C3A21]">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-[#5C3A21] hover:bg-[#3E2615] text-[#FFF8E7] font-bold py-3.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-base group"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>

                <div className="mt-6 pt-4 border-t border-[#F3EFEA] grid grid-cols-3 gap-2 text-center text-[11px] text-gray-500 font-medium">
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#D4A017]" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-[#D4A017]" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RotateCcw className="w-4 h-4 text-[#D4A017]" />
                    <span>Easy Returns</span>
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