import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Package,
  Clock,
  User,
  Phone,
  MapPin,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Truck,
  XCircle,
  RefreshCw,
  Trash2,
  Boxes,
  Loader2,
  Calendar,
  Sparkles,
  Check,
} from "lucide-react";

const OrderPage = () => {
  const token = localStorage.getItem("token");
  const { user } = useSelector((state) => state.user);
  const isAdmin = user?.role === "admin" || user?.role === "Admin";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const endpoint = isAdmin
        ? `${import.meta.env.VITE_BACKEND_URL}getAllOrders`
        : `${import.meta.env.VITE_BACKEND_URL}getOrderById`;

      const res = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedList = res.data.orders || res.data.order || [];
      setOrders(Array.isArray(fetchedList) ? fetchedList : [fetchedList]);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders. Please make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isAdmin]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatusId(orderId);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}updateOrderStatus/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: res.data.order?.status || newStatus,
                }
              : order
          )
        );
      }
    } catch (err) {
      console.error("UPDATE STATUS ERROR:", err);
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order record?")) return;
    setDeletingOrderId(orderId);
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}deleteOrder/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders((prev) => prev.filter((ord) => ord._id !== orderId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete order");
    } finally {
      setDeletingOrderId(null);
    }
  };

  // Calculate Metrics
  const totalSpent = orders.reduce(
    (sum, ord) => sum + (parseFloat(ord.totalPrice) || 0),
    0
  );
  const pendingCount = orders.filter(
    (o) => (o.status || "Pending").toLowerCase() === "pending"
  ).length;
  const processingCount = orders.filter(
    (o) => (o.status || "").toLowerCase() === "processing"
  ).length;
  const shippedCount = orders.filter(
    (o) => (o.status || "").toLowerCase() === "shipped"
  ).length;
  const deliveredCount = orders.filter(
    (o) => (o.status || "").toLowerCase() === "delivered"
  ).length;

  const pipelineSteps = [
    { key: "pending", label: "Order Placed", icon: Clock },
    { key: "processing", label: "Processing", icon: RefreshCw },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle2 },
  ];

  const getStepIndex = (statusStr = "Pending") => {
    const s = statusStr.toLowerCase();
    if (s === "delivered") return 3;
    if (s === "shipped") return 2;
    if (s === "processing") return 1;
    if (s === "cancelled") return -1;
    return 0; // Default Pending
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2C1810]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E8DCCB]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4A017] uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAdmin ? "Admin Order Control" : "Live Order Dashboard"}</span>
            </div>
            <h1 className="text-3xl font-extrabold font-serif text-[#2C1810] tracking-tight flex items-center gap-3">
              <span>{isAdmin ? "All Customer Orders" : "My Order History"}</span>
              <span className="bg-[#5C3A21] text-[#FFF8E7] text-xs px-3 py-1 rounded-full font-bold">
                {orders.length} Total
              </span>
            </h1>
          </div>

          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 text-xs font-bold bg-white hover:bg-slate-100 text-[#5C3A21] px-4 py-2.5 rounded-xl border border-[#E8DCCB] shadow-sm transition self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Real-Time Status
          </button>
        </div>

        {/* Real-Time Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-[#E8DCCB] shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-[#5C3A21] rounded-xl border border-amber-100">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Orders</p>
              <h3 className="text-2xl font-black text-[#2C1810]">{orders.length}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8DCCB] shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Pending & In-Progress</p>
              <h3 className="text-2xl font-black text-[#2C1810]">
                {pendingCount + processingCount + shippedCount}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8DCCB] shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Delivered Orders</p>
              <h3 className="text-2xl font-black text-[#2C1810]">{deliveredCount}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8DCCB] shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">
                {isAdmin ? "Total Revenue" : "Total Spent"}
              </p>
              <h3 className="text-2xl font-black text-[#5C3A21]">
                ₹{totalSpent.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-[#5C3A21] animate-spin mb-3" />
            <p className="text-gray-500 text-sm font-medium">Loading live order status...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center max-w-lg mx-auto">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="font-semibold">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E8DCCB] p-12 text-center max-w-md mx-auto my-8 shadow-sm">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-xl font-bold font-serif text-[#2C1810] mb-1">No orders found</h3>
            <p className="text-gray-500 text-xs mb-4">
              You haven't placed any orders yet. Explore our literary collection and pick your favorite books!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStepIdx = getStepIndex(order.status);
              const isCancelled = (order.status || "").toLowerCase() === "cancelled";
              const orderIdShort = order._id
                ? `#ORD-${order._id.substring(order._id.length - 6).toUpperCase()}`
                : "#ORDER";

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-[#E8DCCB] shadow-md overflow-hidden transition duration-300 hover:shadow-xl"
                >
                  {/* Card Header */}
                  <div className="p-4 sm:p-6 bg-[#FFF8E7] border-b border-[#E8DCCB] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#5C3A21] text-[#FFF8E7] rounded-xl shadow-sm">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-[#2C1810] text-lg">
                            {orderIdShort}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold ${
                              isCancelled
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : currentStepIdx === 3
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-amber-100 text-amber-900 border border-amber-300"
                            }`}
                          >
                            {order.status || "Pending"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {order.timeStamp
                            ? new Date(order.timeStamp).toLocaleString("en-IN")
                            : "Recent Order"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right ml-auto sm:ml-0">
                      <span className="text-xs text-gray-500 block font-medium">Order Total</span>
                      <span className="text-2xl font-black text-[#5C3A21]">
                        ₹{parseFloat(order.totalPrice || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Real-Time Status Progress Tracker Line */}
                  <div className="p-6 bg-slate-50/70 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                      Real-Time Order Tracking Pipeline
                    </h4>

                    {isCancelled ? (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 text-xs font-bold">
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span>This order was cancelled. Please contact support or place a new order.</span>
                      </div>
                    ) : (
                      <div className="relative flex items-center justify-between">
                        {/* Progress Connecting Bar */}
                        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1.5 bg-slate-200 rounded-full z-0">
                          <div
                            className="h-full bg-gradient-to-r from-[#5C3A21] to-[#D4A017] rounded-full transition-all duration-500"
                            style={{
                              width: `${(currentStepIdx / (pipelineSteps.length - 1)) * 100}%`,
                            }}
                          />
                        </div>

                        {/* Step Nodes */}
                        {pipelineSteps.map((step, idx) => {
                          const StepIcon = step.icon;
                          const isCompleted = idx < currentStepIdx;
                          const isCurrent = idx === currentStepIdx;

                          return (
                            <div
                              key={step.key}
                              className="relative z-10 flex flex-col items-center gap-2"
                            >
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all duration-300 ${
                                  isCompleted
                                    ? "bg-[#5C3A21] text-[#FFF8E7]"
                                    : isCurrent
                                    ? "bg-[#D4A017] text-[#2C1810] ring-4 ring-[#D4A017]/30 scale-110"
                                    : "bg-white text-slate-400 border-2 border-slate-300"
                                }`}
                              >
                                {isCompleted ? (
                                  <Check className="w-5 h-5 stroke-[3]" />
                                ) : (
                                  <StepIcon
                                    className={`w-4 h-4 ${
                                      isCurrent ? "animate-bounce" : ""
                                    }`}
                                  />
                                )}
                              </div>
                              <span
                                className={`text-[11px] font-bold text-center max-w-[80px] ${
                                  isCurrent
                                    ? "text-[#5C3A21] font-extrabold"
                                    : isCompleted
                                    ? "text-slate-800"
                                    : "text-slate-400"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Customer Details & Items Purchased */}
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-[#FFF8E7]/60 rounded-xl border border-[#E8DCCB] text-xs">
                      <div>
                        <span className="text-gray-500 font-medium flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#5C3A21]" /> Customer Name
                        </span>
                        <p className="font-bold text-[#2C1810] text-sm mt-0.5">
                          {order.userName || order.user?.name || "Customer"}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-500 font-medium flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-[#5C3A21]" /> Phone
                        </span>
                        <p className="font-bold text-[#2C1810] text-sm mt-0.5">
                          {order.phone || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-500 font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#5C3A21]" /> Shipping Address
                        </span>
                        <p className="font-semibold text-slate-800 truncate mt-0.5" title={order.address}>
                          {order.address || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-500 font-medium flex items-center gap-1">
                          {order.paymentMethod === "Online" ? (
                            <CreditCard className="w-3.5 h-3.5 text-[#5C3A21]" />
                          ) : (
                            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          Payment Method
                        </span>
                        <p className="font-bold text-[#5C3A21] text-sm mt-0.5">
                          {order.paymentMethod || "Cash on Delivery"}
                        </p>
                      </div>
                    </div>

                    {/* Products List */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                        Purchased Items ({order.products?.length || 0})
                      </h4>
                      <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white">
                        {order.products?.map((prodItem, idx) => {
                          const pObj = prodItem.product || {};
                          const pName = prodItem.productName || pObj.BookName || pObj.title || "Book";
                          const pImg = pObj.Image || pObj.image;
                          const pPrice = prodItem.price || pObj.Price || 0;
                          const qty = prodItem.quantity || 1;

                          return (
                            <div
                              key={prodItem._id || pObj._id || idx}
                              className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-14 bg-[#FFF8E7] rounded-lg border border-slate-200 overflow-hidden flex-shrink-0 p-1 flex items-center justify-center">
                                  {pImg ? (
                                    <img
                                      src={pImg}
                                      alt={pName}
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <Package className="w-6 h-6 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <h5 className="text-sm font-bold text-[#2C1810] line-clamp-1 font-serif">
                                    {pName}
                                  </h5>
                                  <span className="text-xs text-gray-500 font-medium">
                                    ₹{parseFloat(pPrice).toFixed(2)} × {qty}
                                  </span>
                                </div>
                              </div>

                              <span className="font-black text-[#5C3A21] text-sm">
                                ₹{(parseFloat(pPrice) * qty).toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer Controls / Admin Status Switcher */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                      {isAdmin ? (
                        <div className="flex items-center gap-3 bg-amber-50 p-2 rounded-xl border border-amber-200">
                          <span className="text-xs font-bold text-[#5C3A21] whitespace-nowrap">
                            ⚡ Update Status:
                          </span>
                          <select
                            value={order.status || "Pending"}
                            disabled={updatingStatusId === order._id}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            className="text-xs font-extrabold bg-white border border-amber-300 text-[#5C3A21] rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#D4A017] outline-none cursor-pointer shadow-sm"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 font-medium">
                          Status updates live in real-time as your order is fulfilled.
                        </div>
                      )}

                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        disabled={deletingOrderId === order._id}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Order Record
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderPage;