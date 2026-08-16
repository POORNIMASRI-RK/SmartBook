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
  Sparkles,
  Clock,
  Check,
} from "lucide-react";

function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const order = state?.order;

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl border border-[#E8DCCB] shadow-sm p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 text-red-500">
              <Package className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-[#2C1810] mb-3">
              No Order Details Found
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              We couldn't find your recent order receipt. Please check your order history.
            </p>
            <button
              onClick={() => navigate("/orders")}
              className="bg-[#5C3A21] hover:bg-[#3E2615] text-[#FFF8E7] px-6 py-3 rounded-xl font-bold transition shadow-md"
            >
              View My Orders
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const orderId =
    order._id ||
    order.orderId ||
    order.id ||
    "N/A";

  const orderIdShort = orderId.length > 8 ? `#ORD-${orderId.substring(orderId.length - 6).toUpperCase()}` : orderId;

  const userName =
    order.UserName ||
    order.userName ||
    order.name ||
    "Customer";

  const phone = order.phone || "N/A";
  const address = order.address || "N/A";
  const payment = order.paymentMethod || order.payment || "Cash on Delivery";
  const totalPrice = Number(order.totalPrice || 0);
  const products = order.products || [];

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

      <div className="min-h-screen bg-[#FAF8F5] text-[#2C1810] py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Success Banner Card */}
          <div className="bg-white rounded-3xl border border-[#E8DCCB] shadow-xl p-8 sm:p-10 text-center mb-8 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#D4A017]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Order Confirmed
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#2C1810]">
              Thank You for Your Order!
            </h1>

            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              Your order has been received and is being prepared with care by our PaperHaven literary team.
            </p>

            {/* Order Progress Tracker */}
            <div className="mt-8 pt-6 border-t border-slate-100 max-w-2xl mx-auto">
              <div className="flex items-center justify-between text-xs font-bold text-[#5C3A21] mb-2">
                <span>Order Placed</span>
                <span>Processing</span>
                <span className="text-gray-400">Shipped</span>
                <span className="text-gray-400">Delivered</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="w-1/2 bg-gradient-to-r from-[#5C3A21] to-[#D4A017] rounded-full animate-pulse" />
              </div>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                Estimated Delivery: <strong className="text-emerald-700">{formatDate(deliveryDate)}</strong>
              </p>
            </div>
          </div>

          {/* Receipt Info Bar */}
          <div className="bg-[#5C3A21] text-[#FFF8E7] rounded-2xl p-6 mb-6 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <p className="text-[#D8C2B0] text-xs font-bold uppercase tracking-wider">Order Reference</p>
                <p className="text-lg font-mono font-extrabold mt-0.5">{orderIdShort}</p>
              </div>

              <div>
                <p className="text-[#D8C2B0] text-xs font-bold uppercase tracking-wider">Status</p>
                <p className="text-lg font-bold text-emerald-400 mt-0.5">Confirmed & Paid</p>
              </div>

              <div>
                <p className="text-[#D8C2B0] text-xs font-bold uppercase tracking-wider">Payment Method</p>
                <p className="text-lg font-bold mt-0.5">{payment}</p>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl border border-[#E8DCCB] shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-bold font-serif text-[#2C1810] flex items-center gap-2 pb-3 border-b border-[#F3EFEA]">
                <User className="w-5 h-5 text-[#5C3A21]" /> Customer Details
              </h2>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs text-gray-400 font-medium block">Full Name</span>
                  <span className="font-bold text-[#2C1810]">{userName}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium block">Phone Number</span>
                  <span className="font-bold text-[#2C1810]">{phone}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium block">Shipping Address</span>
                  <span className="font-semibold text-slate-700">{address}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8DCCB] shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-bold font-serif text-[#2C1810] flex items-center gap-2 pb-3 border-b border-[#F3EFEA]">
                <Truck className="w-5 h-5 text-[#5C3A21]" /> Shipping & Delivery
              </h2>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs text-gray-400 font-medium block">Delivery Method</span>
                  <span className="font-bold text-emerald-600">Standard Express Delivery (Free)</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium block">Expected Arrival</span>
                  <span className="font-bold text-[#5C3A21]">{formatDate(deliveryDate)}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium block">Updates</span>
                  <span className="text-xs text-gray-500 font-medium">Tracking notifications will be sent live.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Products Breakdown */}
          <div className="bg-white rounded-2xl border border-[#E8DCCB] shadow-sm p-6 mb-8">
            <h2 className="text-lg font-bold font-serif text-[#2C1810] flex items-center gap-2 pb-4 border-b border-[#F3EFEA]">
              <ShoppingBag className="w-5 h-5 text-[#5C3A21]" /> Ordered Books ({products.length})
            </h2>

            <div className="divide-y divide-[#F3EFEA] py-2">
              {products.map((item, index) => {
                const productName = item.productName || item.BookName || item.name || "Book";
                const quantity = Number(item.quantity || 1);
                const price = Number(item.price || item.Price || 0);
                const itemTotal = price * quantity;
                const imgUrl = item.Image || item.image || item.product?.Image || item.product?.image;

                return (
                  <div key={index} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-16 bg-[#FFF8E7] rounded-xl border border-slate-200 overflow-hidden p-1 flex items-center justify-center flex-shrink-0">
                        {imgUrl ? (
                          <img src={imgUrl} alt={productName} className="w-full h-full object-contain" />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold font-serif text-[#2C1810] text-sm sm:text-base">{productName}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          ₹{price.toFixed(2)} × {quantity}
                        </p>
                      </div>
                    </div>

                    <span className="font-black text-[#5C3A21] text-base">
                      ₹{itemTotal.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[#F3EFEA] pt-4 mt-2 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold">Free</span>
              </div>
              <div className="flex justify-between text-xl font-black text-[#2C1810] pt-3 border-t">
                <span>Total Amount Paid</span>
                <span className="text-[#5C3A21]">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/orders")}
              className="flex items-center justify-center gap-2 bg-[#5C3A21] hover:bg-[#3E2615] text-[#FFF8E7] px-8 py-3.5 rounded-xl font-bold transition shadow-lg"
            >
              <Package className="w-5 h-5" />
              View All My Orders
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-[#5C3A21] border border-[#E8DCCB] px-8 py-3.5 rounded-xl font-bold transition shadow-sm"
            >
              <Printer className="w-5 h-5" />
              Print Receipt
            </button>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default OrderSuccess;