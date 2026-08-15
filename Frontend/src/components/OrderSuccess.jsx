import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Phone,
  User,
  CreditCard,
  ArrowLeft,
  Printer,
  ShoppingBag,
} from "lucide-react";

function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Get order data sent from BuyNow
  const order = state?.order;

  // If no order data exists
  if (!order) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">

            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Package className="w-10 h-10 text-red-500" />
            </div>

            <h2 className="text-2xl font-bold text-[#2B2118] mb-3">
              No Order Found
            </h2>

            <p className="text-gray-500 mb-6">
              We couldn't find your order details.
            </p>

            <button
              onClick={() => navigate("/")}
              className="bg-[#5C3A21] hover:bg-[#432a18] text-white px-6 py-3 rounded-xl font-semibold"
            >
              Go to Home
            </button>

          </div>
        </div>

        <Footer />
      </>
    );
  }

  // Support different backend field names
  const orderId =
    order._id ||
    order.orderId ||
    order.id ||
    "N/A";

  const userName =
    order.UserName ||
    order.userName ||
    order.name ||
    "Customer";

  const phone =
    order.phone ||
    "N/A";

  const address =
    order.address ||
    "N/A";

  const payment =
    order.paymentMethod ||
    order.payment ||
    "Cash on Delivery";

  const totalPrice = Number(order.totalPrice || 0);

  const products = order.products || [];

  // Delivery date
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-10 px-4">

        <div className="max-w-5xl mx-auto">

          {/* SUCCESS HEADER */}

          <div className="bg-white rounded-2xl shadow-sm p-8 text-center mb-6">

            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">

              <CheckCircle2 className="w-14 h-14 text-green-600" />

            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-green-600">
              Order Placed Successfully!
            </h1>

            <p className="text-gray-500 mt-3">
              Thank you for shopping with PaperHaven.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 bg-green-50 text-green-700 px-5 py-2 rounded-full font-semibold">

              <CheckCircle2 className="w-5 h-5" />

              Order Confirmed

            </div>

          </div>


          {/* ORDER ID */}

          <div className="bg-[#5C3A21] text-white rounded-2xl p-6 mb-6">

            <div className="flex flex-col md:flex-row justify-between gap-4">

              <div>

                <p className="text-[#D8C2B0] text-sm">
                  Order ID
                </p>

                <p className="text-xl font-bold mt-1 break-all">
                  {orderId}
                </p>

              </div>

              <div>

                <p className="text-[#D8C2B0] text-sm">
                  Order Status
                </p>

                <p className="text-xl font-bold text-green-300 mt-1">
                  Confirmed
                </p>

              </div>

              <div>

                <p className="text-[#D8C2B0] text-sm">
                  Payment
                </p>

                <p className="text-xl font-bold mt-1">
                  {payment}
                </p>

              </div>

            </div>

          </div>


          {/* CUSTOMER + DELIVERY */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* CUSTOMER */}

            <div className="bg-white rounded-2xl shadow-sm p-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-10 h-10 bg-[#f5eee8] rounded-lg flex items-center justify-center">

                  <User className="w-5 h-5 text-[#5C3A21]" />

                </div>

                <h2 className="text-xl font-bold text-[#2B2118]">
                  Customer Details
                </h2>

              </div>

              <div className="space-y-4">

                <div className="flex gap-3">

                  <User className="w-5 h-5 text-gray-400 mt-0.5" />

                  <div>

                    <p className="text-sm text-gray-500">
                      Name
                    </p>

                    <p className="font-semibold">
                      {userName}
                    </p>

                  </div>

                </div>


                <div className="flex gap-3">

                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />

                  <div>

                    <p className="text-sm text-gray-500">
                      Phone
                    </p>

                    <p className="font-semibold">
                      {phone}
                    </p>

                  </div>

                </div>


                <div className="flex gap-3">

                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />

                  <div>

                    <p className="text-sm text-gray-500">
                      Shipping Address
                    </p>

                    <p className="font-semibold">
                      {address}
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* DELIVERY */}

            <div className="bg-white rounded-2xl shadow-sm p-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-10 h-10 bg-[#f5eee8] rounded-lg flex items-center justify-center">

                  <Truck className="w-5 h-5 text-[#5C3A21]" />

                </div>

                <h2 className="text-xl font-bold text-[#2B2118]">
                  Delivery Details
                </h2>

              </div>

              <div className="space-y-4">

                <div>

                  <p className="text-sm text-gray-500">
                    Estimated Delivery
                  </p>

                  <p className="font-bold text-blue-600">
                    {formatDate(deliveryDate)}
                  </p>

                </div>


                <div>

                  <p className="text-sm text-gray-500">
                    Delivery Type
                  </p>

                  <p className="font-semibold">
                    Free Delivery
                  </p>

                </div>


                <div>

                  <p className="text-sm text-gray-500">
                    Order Status
                  </p>

                  <span className="inline-block mt-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Confirmed
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* PRODUCTS */}

          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 bg-[#f5eee8] rounded-lg flex items-center justify-center">

                <ShoppingBag className="w-5 h-5 text-[#5C3A21]" />

              </div>

              <h2 className="text-xl font-bold text-[#2B2118]">
                Ordered Books
              </h2>

            </div>


            <div className="space-y-5">

              {products.map((item, index) => {

                const productName =
                  item.productName ||
                  item.BookName ||
                  item.name ||
                  "Book";

                const quantity =
                  Number(item.quantity || 1);

                const price =
                  Number(item.price || 0);

                const itemTotal =
                  price * quantity;

                const imgUrl =
                  item.Image ||
                  item.image ||
                  item.product?.Image ||
                  item.product?.image;

                return (
                  <div
                    key={item._id || item.product || index}
                    className="flex items-center justify-between gap-4 border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
                  >

                    <div className="flex items-center gap-4">

                      <div className="w-16 h-20 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center p-1 flex-shrink-0">

                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={productName}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Package className="w-7 h-7 text-gray-400" />
                        )}

                      </div>

                      <div>

                        <h3 className="font-bold text-[#2B2118]">
                          {productName}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          ₹{price.toFixed(2)} × {quantity}
                        </p>

                      </div>

                    </div>


                    <p className="font-bold text-[#5C3A21]">
                      ₹{itemTotal.toFixed(2)}
                    </p>

                  </div>
                );
              })}

            </div>


            {/* TOTAL */}

            <div className="border-t mt-6 pt-5">

              <div className="flex justify-between text-lg">

                <span className="text-gray-600">
                  Subtotal
                </span>

                <span>
                  ₹{totalPrice.toFixed(2)}
                </span>

              </div>


              <div className="flex justify-between text-lg mt-2">

                <span className="text-gray-600">
                  Delivery
                </span>

                <span className="text-green-600 font-semibold">
                  Free
                </span>

              </div>


              <div className="flex justify-between text-2xl font-bold border-t mt-4 pt-4">

                <span>
                  Total
                </span>

                <span className="text-[#5C3A21]">
                  ₹{totalPrice.toFixed(2)}
                </span>

              </div>

            </div>

          </div>


          {/* PAYMENT */}

          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">

            <div className="flex items-center gap-3">

              <CreditCard className="w-6 h-6 text-[#5C3A21]" />

              <div>

                <p className="text-sm text-gray-500">
                  Payment Method
                </p>

                <p className="font-bold">
                  {payment}
                </p>

              </div>

            </div>

          </div>


          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 bg-[#5C3A21] hover:bg-[#432a18] text-white px-7 py-3 rounded-xl font-semibold transition"
            >

              <ArrowLeft className="w-5 h-5" />

              Continue Shopping

            </button>


            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold transition"
            >

              <Printer className="w-5 h-5" />

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