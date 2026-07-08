import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function OrderSuccess() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const product = state?.product;
    const customer = state?.customer;

    if (!product || !customer) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4">
            No Order Found
        </h2>

        <button
          onClick={() => navigate("/")}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const orderId =
    "SB" + Math.floor(100000 + Math.random() * 900000);

  const today = new Date();

  const delivery = new Date(today);
  delivery.setDate(today.getDate() + 5);

  return (
    <>
      <Navbar cartCount={0} />

      <div className="bg-gray-100 min-h-screen py-10">

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

          <div className="text-center">

            <h1 className="text-5xl">🎉</h1>

            <h2 className="text-4xl font-bold text-green-600 mt-4">
              Order Placed Successfully!
            </h2>

            <p className="text-gray-600 mt-3">
              Thank you for shopping with SmartBook.
            </p>

          </div>

          <hr className="my-8" />

          <div className="grid md:grid-cols-2 gap-8">

            {/* Customer Details */}

            <div>

              <h3 className="text-2xl font-bold mb-4">
                Customer Details
              </h3>

              <p><strong>Name:</strong> {customer.name}</p>

              <p><strong>Phone:</strong> {customer.phone}</p>

              <p><strong>Email:</strong> {customer.email}</p>

              <p><strong>Address:</strong></p>

              <p>{customer.address}</p>

              <p>
                {customer.city}, {customer.state}
              </p>

              <p>{customer.pincode}</p>

            </div>

            {/* Book Details */}

            <div className="text-center">

              <img
                src={product.image}
                alt={product.name}
                className="h-64 mx-auto"
              />

              <h2 className="text-2xl font-bold mt-5">
                {product.name}
              </h2>

              <p className="mt-2">
                ⭐ {product.rating}
              </p>

              <p className="mt-2">
                {product.price}
              </p>

            </div>

          </div>

          <hr className="my-8" />

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <h3 className="font-bold text-xl">
                Order Information
              </h3>

              <p className="mt-3">
                <strong>Order ID:</strong> {orderId}
              </p>

              <p className="mt-2">
                <strong>Payment:</strong> {customer.payment}
              </p>

              <p className="mt-2">
                <strong>Status:</strong>
                <span className="text-green-600 font-semibold">
                  {" "}Confirmed
                </span>
              </p>

            </div>

            <div>

              <h3 className="font-bold text-xl">
                Delivery Details
              </h3>

              <p className="mt-3">
                Estimated Delivery:
              </p>

              <p className="font-semibold text-blue-600">
                {delivery.toDateString()}
              </p>

              <p className="mt-2">
                🚚 Free Delivery
              </p>

            </div>

          </div>

          <div className="mt-10 flex justify-center gap-5">

            <button
              onClick={() => navigate("/")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Continue Shopping
            </button>

            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Print Invoice
            </button>

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default OrderSuccess;