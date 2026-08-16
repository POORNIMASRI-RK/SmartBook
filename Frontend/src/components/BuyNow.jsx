import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Navbar from "./Navbar";
import Footer from "./Footer";

import { clearCart } from "../features/cart/cartSlice";

import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ShoppingBag,
  Loader2,
  Package,
  Truck,
} from "lucide-react";

const BuyNow = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // REDUX

  const cart = useSelector((state) => state.cart.items || []);
  const user = useSelector((state) => state.user.user);

  const token = localStorage.getItem("token");

  // FORM STATE  

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    payment: "Cash on Delivery",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const [orderSuccess, setOrderSuccess] = useState(false);

  const [orderData, setOrderData] = useState(null);

  // USER DETAILS

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      }));
    }
  }, [user]);

  // PRICE PARSER

  const parsePrice = (priceValue) => {
    if (typeof priceValue === "number") {
      return priceValue;
    }

    if (typeof priceValue === "string") {
      const cleanedPrice = priceValue.replace(/[^0-9.]/g, "");

      return parseFloat(cleanedPrice) || 0;
    }

    return 0;
  };

  // PRODUCT PRICE

  const getItemPrice = (item) => {
    return parsePrice(item.Price);
  };

  // PRODUCT NAME

  const getItemName = (item) => {
    return (
      item.BookName ||
      item.bookName ||
      item.title ||
      item.name ||
      "Book"
    );
  };

  // PRODUCT IMAGE

  const getItemImage = (item) => {
    return item.Image || item.image || "";
  };

  // TOTAL QUANTITY

  const totalQuantity = cart.reduce((total, item) => {
    return total + Number(item.quantity || 1);
  }, 0);

  // TOTAL PRICE

  const totalPrice = cart.reduce((total, item) => {
    const price = getItemPrice(item);

    const quantity = Number(item.quantity || 1);

    return total + price * quantity;
  }, 0);

  // INPUT CHANGE

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // PLACE ORDER

  const placeOrder = async (e) => {
    e.preventDefault();

    setErrorMsg("");

    // Check login
    if (!token) {
      setErrorMsg("Please login before placing your order.");
      return;
    }

    // Check cart
    if (cart.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    // Validate name
    if (!formData.name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    // Validate phone
    if (!formData.phone.trim()) {
      setErrorMsg("Please enter your mobile number.");
      return;
    }

    // Validate address
    if (!formData.address.trim()) {
      setErrorMsg("Please enter your shipping address.");
      return;
    }

    setIsSubmitting(true);

    try {
      // ORDER PRODUCTS

      const products = cart.map((item) => ({
        product: item._id || item.id,

        productName: getItemName(item),

        quantity: Number(item.quantity || 1),

        price: getItemPrice(item),
      }));

      // ORDER PAYLOAD

      const payload = {
        user: user?._id || user?.id,

        products: products,

        totalPrice: totalPrice,

        userName: formData.name,

        phone: formData.phone,

        address: formData.address,

        paymentMethod: formData.payment,
      };

      console.log("Sending Order:", payload);

      // API REQUEST

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}addOrder`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Order Response:", response.data);

      // SUCCESS

      if (
        response.data.success === true ||
        response.status === 200 ||
        response.status === 201
      ) {
        const createdOrder = response.data.order || payload;
        dispatch(clearCart());
        navigate("/Success", { state: { order: createdOrder } });
      } else {
        setErrorMsg(
          response.data.message || "Unable to place order."
        );
      }
    } catch (error) {
      console.error("Place Order Error:", error);

      console.log("Status:", error.response?.status);

      console.log("Response:", error.response?.data);

      setErrorMsg(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // EMPTY CART
  if (cart.length === 0 && !orderSuccess) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">

            <div className="w-20 h-20 bg-[#f5eee8] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-[#5C3A21]" />
            </div>

            <h1 className="text-2xl font-bold text-[#2B2118] mb-3">
              Your Cart is Empty
            </h1>

            <p className="text-gray-500 mb-7">
              Please add a book to your cart before proceeding
              to checkout.
            </p>

            <button
              onClick={() => navigate("/")}
              className="bg-[#5C3A21] hover:bg-[#432a18] text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Continue Shopping
            </button>

          </div>
        </div>

        <Footer />
      </>
    );
  }

  // ORDER SUCCESS

  if (orderSuccess) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

          <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">

            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-14 h-14 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-[#2B2118] mb-3">
              Order Placed Successfully!
            </h1>

            <p className="text-gray-500 mb-6">
              Thank you for shopping with us. Your order has been
              successfully placed.
            </p>

            <div className="bg-gray-50 rounded-xl p-5 text-left mb-6">

              <div className="flex justify-between mb-3">
                <span className="text-gray-500">
                  Total Items
                </span>

                <span className="font-semibold">
                  {totalQuantity}
                </span>
              </div>

              <div className="flex justify-between mb-3">
                <span className="text-gray-500">
                  Payment
                </span>

                <span className="font-semibold">
                  {formData.payment}
                </span>
              </div>

              <div className="flex justify-between text-lg">
                <span className="font-bold">
                  Total
                </span>

                <span className="font-bold text-[#5C3A21]">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>

            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full bg-[#5C3A21] hover:bg-[#432a18] text-white py-3 rounded-xl font-semibold transition"
            >
              Continue Shopping
            </button>

          </div>

        </div>

        <Footer />
      </>
    );
  }

  // MAIN CHECKOUT PAGE                 

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-8 px-4">

        <div className="max-w-7xl mx-auto">

          {/*      HEADER      */}

          <div className="flex items-center gap-4 mb-8">

            <button
              onClick={() => navigate("/cart")}
              className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-3xl font-bold text-[#2B2118]">
                Checkout
              </h1>

              <p className="text-gray-500 mt-1">
                Complete your order
              </p>
            </div>

          </div>

          {/*      ERROR      */}

          {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">

              <p className="font-medium">
                {errorMsg}
              </p>

            </div>
          )}

          {/*      GRID      */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/*             
                LEFT SIDE
                         */}

            <div className="lg:col-span-7">

              {/*      ORDER SUMMARY      */}

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                <div className="flex items-center gap-3 mb-6">

                  <div className="w-10 h-10 bg-[#f5eee8] rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-[#5C3A21]" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#2B2118]">
                      Order Summary
                    </h2>

                    <p className="text-sm text-gray-500">
                      {totalQuantity} item
                      {totalQuantity > 1 ? "s" : ""}
                    </p>
                  </div>

                </div>

                {/*      BOOK LIST      */}

                <div className="space-y-5">

                  {cart.map((item, index) => {

                    const itemId =
                      item._id || item.id || index;

                    const price = getItemPrice(item);

                    const quantity =
                      Number(item.quantity || 1);

                    const itemTotal =
                      price * quantity;

                    return (
                      <div
                        key={itemId}
                        className="flex gap-4 pb-5 border-b border-gray-100 last:border-b-0"
                      >

                        {/* BOOK IMAGE */}

                        <div className="w-24 h-28 sm:w-28 sm:h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">

                          {getItemImage(item) ? (
                            <img
                              src={getItemImage(item)}
                              alt={getItemName(item)}
                              className="w-full h-full object-contain p-2"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="text-gray-400" />
                            </div>
                          )}

                        </div>

                        {/* BOOK DETAILS */}

                        <div className="flex-1 min-w-0">

                          <h3 className="font-bold text-[#2B2118] text-lg line-clamp-2">
                            {getItemName(item)}
                          </h3>

                          {item.Rating && (
                            <p className="text-sm mt-1">
                              ⭐ {item.Rating}
                            </p>
                          )}

                          {item.Language && (
                            <p className="text-sm text-gray-500 mt-1">
                              Language: {item.Language}
                            </p>
                          )}

                          {item.Age && (
                            <p className="text-sm text-gray-500">
                              Age: {item.Age}
                            </p>
                          )}

                          <div className="flex justify-between items-center mt-3">

                            <div>
                              <p className="text-sm text-gray-500">
                                ₹{price.toFixed(2)} ×{" "}
                                {quantity}
                              </p>
                            </div>

                            <p className="font-bold text-[#5C3A21]">
                              ₹{itemTotal.toFixed(2)}
                            </p>

                          </div>

                        </div>

                      </div>
                    );
                  })}

                </div>

                {/*      TOTAL      */}

                <div className="border-t border-gray-200 mt-6 pt-6">

                  <div className="flex justify-between text-gray-600 mb-3">
                    <span>
                      Subtotal
                    </span>

                    <span>
                      ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600 mb-3">
                    <span>
                      Delivery
                    </span>

                    <span className="text-green-600 font-medium">
                      Free
                    </span>
                  </div>

                  <div className="flex justify-between text-xl font-bold text-[#2B2118] pt-3 border-t">

                    <span>
                      Total
                    </span>

                    <span className="text-[#5C3A21]">
                      ₹{totalPrice.toFixed(2)}
                    </span>

                  </div>

                </div>

              </div>

              {/*      TRUST      */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">

                <div className="bg-white rounded-xl p-4 text-center border">

                  <ShieldCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />

                  <p className="text-sm font-semibold">
                    Secure Payment
                  </p>

                </div>

                <div className="bg-white rounded-xl p-4 text-center border">

                  <Truck className="w-6 h-6 text-[#5C3A21] mx-auto mb-2" />

                  <p className="text-sm font-semibold">
                    Fast Delivery
                  </p>

                </div>

                <div className="bg-white rounded-xl p-4 text-center border">

                  <Package className="w-6 h-6 text-[#5C3A21] mx-auto mb-2" />

                  <p className="text-sm font-semibold">
                    Safe Packaging
                  </p>

                </div>

              </div>

            </div>

            {/*             
                RIGHT SIDE
                         */}

            <div className="lg:col-span-5">

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">

                <h2 className="text-xl font-bold text-[#2B2118] mb-6">
                  Customer Details
                </h2>

                <form onSubmit={placeOrder}>

                  {/* NAME */}

                  <label className="block font-medium text-[#2B2118] mb-2">

                    <User className="inline w-4 h-4 mr-1" />

                    Full Name

                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full border border-gray-300 rounded-lg p-3 mb-5 outline-none focus:ring-2 focus:ring-[#5C3A21]"
                  />

                  {/* PHONE  */}

                  <label className="block font-medium text-[#2B2118] mb-2">

                    <Phone className="inline w-4 h-4 mr-1" />

                    Mobile Number

                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your mobile number"
                    className="w-full border border-gray-300 rounded-lg p-3 mb-5 outline-none focus:ring-2 focus:ring-[#5C3A21]"
                  />

                  {/*      ADDRESS      */}

                  <label className="block font-medium text-[#2B2118] mb-2">

                    <MapPin className="inline w-4 h-4 mr-1" />

                    Shipping Address

                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your complete shipping address"
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg p-3 mb-5 outline-none focus:ring-2 focus:ring-[#5C3A21]"
                  />

                  {/*      PAYMENT      */}

                  <label className="block font-medium text-[#2B2118] mb-2">

                    <CreditCard className="inline w-4 h-4 mr-1" />

                    Payment Method

                  </label>

                  <select
                    name="payment"
                    value={formData.payment}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 mb-6 outline-none focus:ring-2 focus:ring-[#5C3A21]"
                  >

                    <option value="Cash on Delivery">
                      Cash on Delivery
                    </option>

                    <option value="UPI">
                      UPI
                    </option>

                    <option value="Credit Card">
                      Credit Card
                    </option>

                    <option value="Debit Card">
                      Debit Card
                    </option>

                  </select>

                  {/*      SECURITY      */}

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">

                    <div className="flex gap-3">

                      <Lock className="w-5 h-5 text-green-600 flex-shrink-0" />

                      <div>

                        <p className="font-semibold text-sm">
                          Secure Checkout
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Your personal information is protected
                          and securely processed.
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* FINAL TOTAL  */}

                  <div className="flex justify-between items-center mb-5">

                    <span className="font-semibold text-gray-600">
                      Order Total
                    </span>

                    <span className="text-2xl font-bold text-[#5C3A21]">
                      ₹{totalPrice.toFixed(2)}
                    </span>

                  </div>

                  {/*  PLACE ORDER  */}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#5C3A21] hover:bg-[#432a18] disabled:bg-gray-400 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                  >

                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />

                        Placing Order...
                      </>
                    ) : (
                      <>
                        <Banknote className="w-5 h-5" />

                        Place Order - ₹
                        {totalPrice.toFixed(2)}
                      </>
                    )}

                  </button>

                  <p className="text-center text-xs text-gray-400 mt-4">
                    By placing your order, you agree to our
                    terms and conditions.
                  </p>

                </form>

              </div>

            </div>

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
};

export default BuyNow;