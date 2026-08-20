import React, { useEffect, useState, useMemo } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Sparkles,
  Star,
  Globe,
  Image as ImageIcon,
  IndianRupee,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  TrendingUp,
  Package,
  Filter,
} from "lucide-react";

const INLINE_SVG_COVER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'><rect width='100%' height='100%' fill='%235C3A21'/><rect x='12' y='12' width='276' height='376' fill='%23FFF8E7' rx='10'/><path d='M40 80 h220 M40 120 h220 M40 160 h180' stroke='%23D4A017' stroke-width='4' stroke-linecap='round'/><text x='150' y='240' font-family='serif' font-size='22' font-weight='bold' fill='%232C1810' text-anchor='middle'>PaperHaven</text><text x='150' y='270' font-family='sans-serif' font-size='14' fill='%235C3A21' text-anchor='middle'>Classic Edition</text><circle cx='150' cy='330' r='20' fill='%23D4A017'/></svg>";

const AdminProducts = () => {
  // Form State
  const [BookName, setBookName] = useState("");
  const [Price, setPrice] = useState("");
  const [Rating, setRating] = useState("");
  const [Age, setAge] = useState("");
  const [Language, setLanguage] = useState("");
  const [Image, setImage] = useState("");

  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false); // Controlled Form Visibility
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Show Toast Feedback
  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${import.meta.env.VITE_BACKEND_URL}products`);
      const list = resp.data.product || resp.data.products || [];
      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Fetch products error:", err);
      triggerToast("Failed to fetch products from server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Form Submission (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const token = localStorage.getItem("token");

    const payload = {
      BookName: BookName.trim(),
      Price: Number(Price),
      Rating: Number(Rating),
      Age: Number(Age),
      Language: Language.trim(),
      Image: Image.trim() || INLINE_SVG_COVER,
    };

    try {
      if (editId) {
        // Edit product
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}products/${editId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 || response.data.success) {
          triggerToast("Book updated successfully ✨", "success");
          handleCancelEdit();
        }
      } else {
        // Add product
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}create`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201 || response.data.success) {
          triggerToast("New book created successfully 📚", "success");
          handleCancelEdit();
        }
      }
      fetchProducts();
    } catch (err) {
      console.error("Submit product error:", err);
      triggerToast(err.response?.data?.message || "Operation failed", "error");
    } finally {
      setSaving(false);
    }
  };

  // Click Edit
  const handleEditClick = (prod) => {
    setEditId(prod._id || prod.id);
    setBookName(prod.BookName || "");
    setPrice(prod.Price || "");
    setRating(prod.Rating || "");
    setAge(prod.Age || "");
    setLanguage(prod.Language || "");
    setImage(prod.Image || prod.image || prod.imageUrl || "");
    setShowForm(true);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  // Click Delete
  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book record?")) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      triggerToast("Book record deleted successfully", "success");
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      console.error("Delete product error:", err);
      triggerToast(err.response?.data?.message || "Failed to delete product", "error");
    }
  };

  // Reset form & Hide
  const handleCancelEdit = () => {
    setEditId(null);
    setBookName("");
    setPrice("");
    setRating("");
    setAge("");
    setLanguage("");
    setImage("");
    setShowForm(false);
  };

  // Open fresh Add Product form
  const handleOpenAddForm = () => {
    handleCancelEdit();
    setShowForm(true);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  // Filtered Products for Admin Search & Filter
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.BookName?.toLowerCase().includes(q) ||
          p.Language?.toLowerCase().includes(q) ||
          String(p.Price || "").includes(q)
      );
    }

    if (activeFilter === "top-rated") {
      list = list.filter((p) => Number(p.Rating || 0) >= 4.5);
    } else if (activeFilter === "under-500") {
      list = list.filter((p) => Number(p.Price || 0) <= 500);
    }

    return list;
  }, [products, searchTerm, activeFilter]);

  // Calculated Admin Metrics
  const metrics = useMemo(() => {
    const total = products.length;
    if (total === 0) return { avgPrice: 0, totalValuation: 0, avgRating: 0, languagesCount: 0 };
    const sumPrice = products.reduce((acc, p) => acc + (Number(p.Price) || 0), 0);
    const sumRating = products.reduce((acc, p) => acc + (Number(p.Rating) || 0), 0);
    const uniqueLangs = new Set(products.map((p) => p.Language).filter(Boolean));
    return {
      avgPrice: Math.round(sumPrice / total),
      totalValuation: sumPrice,
      avgRating: (sumRating / total).toFixed(1),
      languagesCount: uniqueLangs.size,
    };
  }, [products]);

  return (
    <div className="min-h-screen bg-[#F5F2EC] flex flex-col font-sans text-[#2C1810]">
      <Navbar />

      {/* Floating Toast Notification */}
      {toast.show && (
        <div className="fixed top-20 right-5 z-50 animate-bounce">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border text-sm font-bold backdrop-blur-md ${
              toast.type === "success"
                ? "bg-[#1E1B18]/95 text-emerald-300 border-emerald-500/40"
                : "bg-[#1E1B18]/95 text-rose-300 border-rose-500/40"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Executive Admin Header Banner */}
        <div className="bg-gradient-to-br from-[#1E1B18] via-[#2D2520] to-[#42342B] text-[#FFF8E7] p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#D4A017]/30 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 bg-[#D4A017]/20 border border-[#D4A017]/40 text-[#FDF6E2] text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-[#D4A017]" /> Executive Suite
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> System Active
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white">
              Inventory & Catalog Command
            </h1>
            <p className="text-[#D6C6B8] text-sm max-w-2xl font-medium">
              Manage live store listings, modify book prices, add new releases, and track catalog statistics.
            </p>
          </div>

          {/* Add New Product Button Format */}
          <div className="relative z-10 flex items-center gap-3">
            <button
              onClick={() => {
                if (showForm && !editId) {
                  setShowForm(false);
                } else {
                  handleOpenAddForm();
                }
              }}
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#D4A017] to-[#B8860B] hover:from-[#B8860B] hover:to-[#966D08] text-[#1E1B18] font-black px-7 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 cursor-pointer text-sm tracking-wide"
            >
              {showForm && !editId ? (
                <>
                  <X className="w-5 h-5" /> Close Form
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" /> Add New Product
                </>
              )}
            </button>
          </div>

          {/* Subtle Ambient Light Gradients */}
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#D4A017]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-[#5C3A21]/30 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Executive Metrics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-[#E2D8CC] shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Catalog</span>
              <div className="p-2.5 bg-[#FFF8E7] text-[#5C3A21] rounded-xl border border-[#E8DCCB]">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#1E1B18]">{products.length}</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Active Store Listings
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E2D8CC] shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Catalog Value</span>
              <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#1E1B18]">₹{metrics.totalValuation.toLocaleString()}</h3>
            <p className="text-xs text-gray-500 font-medium mt-1">Avg ₹{metrics.avgPrice} per title</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E2D8CC] shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Rating</span>
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
                <Star className="w-5 h-5 fill-current text-amber-500" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#1E1B18]">{metrics.avgRating} <span className="text-xs font-medium text-gray-400">/ 5.0</span></h3>
            <p className="text-xs text-amber-700 font-semibold mt-1">Store Satisfaction</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E2D8CC] shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Languages</span>
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
                <Globe className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#1E1B18]">{metrics.languagesCount}</h3>
            <p className="text-xs text-emerald-700 font-semibold mt-1">Global Diversity</p>
          </div>
        </div>

        {/* Form Panel (Toggled by Add New Product Button) */}
        {showForm && (
          <div className="bg-white rounded-3xl border-2 border-[#D4A017] shadow-2xl p-6 sm:p-8 transition-all duration-300">
            <div className="flex items-center justify-between pb-6 border-b border-[#E8DCCB] mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#1E1B18] text-[#D4A017] rounded-2xl">
                  {editId ? <Edit3 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-serif text-[#1E1B18]">
                    {editId ? "Edit Product Specifications" : "Add New Product to Store"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {editId
                      ? "Updating book record specifications in the PaperHaven catalog."
                      : "Fill in book specifications below to publish a new title."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                <X className="w-4 h-4" /> Close Form
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Input Fields */}
              <div className="lg:col-span-8 space-y-5">
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                    Book Name / Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Atomic Habits"
                    className="w-full bg-[#FAF8F5] border border-[#D6C6B8] focus:border-[#5C3A21] focus:bg-white rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none transition shadow-sm"
                    value={BookName}
                    onChange={(e) => setBookName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                      Price (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-gray-400 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        placeholder="299"
                        className="w-full bg-[#FAF8F5] border border-[#D6C6B8] focus:border-[#5C3A21] focus:bg-white rounded-2xl pl-8 pr-4 py-3.5 text-sm font-semibold outline-none transition shadow-sm"
                        value={Price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                      Rating (0.0 - 5.0) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      placeholder="4.5"
                      className="w-full bg-[#FAF8F5] border border-[#D6C6B8] focus:border-[#5C3A21] focus:bg-white rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none transition shadow-sm"
                      value={Rating}
                      onChange={(e) => setRating(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                      Target Age *
                    </label>
                    <input
                      type="number"
                      placeholder="12"
                      className="w-full bg-[#FAF8F5] border border-[#D6C6B8] focus:border-[#5C3A21] focus:bg-white rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none transition shadow-sm"
                      value={Age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                      Language *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. English, French"
                      className="w-full bg-[#FAF8F5] border border-[#D6C6B8] focus:border-[#5C3A21] focus:bg-white rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none transition shadow-sm"
                      value={Language}
                      onChange={(e) => setLanguage(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                      Book Cover Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#FAF8F5] border border-[#D6C6B8] focus:border-[#5C3A21] focus:bg-white rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none transition shadow-sm"
                      value={Image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1E1B18] hover:bg-[#3D322C] text-[#FFF8E7] font-bold px-7 py-4 rounded-2xl shadow-xl transition transform hover:scale-[1.01] active:scale-95 cursor-pointer disabled:opacity-50 text-sm"
                  >
                    {saving ? (
                      <span>Processing...</span>
                    ) : editId ? (
                      <>
                        <Edit3 className="w-4 h-4 text-[#D4A017]" /> Update Book Record
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-[#D4A017]" /> Save Product to Store
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-4 rounded-2xl text-sm transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Live Book Cover Preview Box */}
              <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#E2D8CC] rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <span className="text-xs font-extrabold text-[#5C3A21] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#D4A017]" /> Live Cover Preview
                </span>

                <div className="w-40 h-52 bg-white rounded-2xl border border-[#E2D8CC] shadow-xl p-2.5 flex items-center justify-center overflow-hidden mb-4 relative group">
                  <img
                    src={Image || INLINE_SVG_COVER}
                    alt="Live Cover Preview"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = INLINE_SVG_COVER;
                    }}
                    className="h-full w-auto object-contain drop-shadow-md"
                  />
                </div>

                <h4 className="font-bold font-serif text-base text-[#1E1B18] line-clamp-1 max-w-[220px]">
                  {BookName || "Book Title Preview"}
                </h4>
                <p className="text-xs font-extrabold text-[#5C3A21] mt-1">
                  ₹{Price || "0"} • {Language || "Language"}
                </p>
              </div>
            </form>
          </div>
        )}

        {/* Existing Products Catalog Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold font-serif text-[#1E1B18] flex items-center gap-2">
                <Layers className="w-6 h-6 text-[#5C3A21]" /> Manage Products ({filteredProducts.length})
              </h2>

              {!showForm && (
                <button
                  onClick={handleOpenAddForm}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5C3A21] bg-[#FFF8E7] hover:bg-[#F5EFE4] border border-[#E8DCCB] px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#D4A017]" /> Add Product
                </button>
              )}
            </div>

            {/* Quick Filter Tags & Search */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-[#E2D8CC] shadow-sm text-xs font-bold">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    activeFilter === "all"
                      ? "bg-[#1E1B18] text-[#FFF8E7]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All ({products.length})
                </button>
                <button
                  onClick={() => setActiveFilter("top-rated")}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    activeFilter === "top-rated"
                      ? "bg-[#1E1B18] text-[#FFF8E7]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Top Rated
                </button>
                <button
                  onClick={() => setActiveFilter("under-500")}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    activeFilter === "under-500"
                      ? "bg-[#1E1B18] text-[#FFF8E7]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Under ₹500
                </button>
              </div>

              {/* Admin Search Bar */}
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-[#E2D8CC] focus:border-[#5C3A21] rounded-2xl pl-9 pr-8 py-2.5 text-xs font-semibold outline-none shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Loading Shimmer */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-4 border border-[#E2D8CC] space-y-3">
                  <div className="h-48 rounded-2xl bg-slate-200 animate-pulse" />
                  <div className="h-4 w-3/4 rounded bg-slate-200 animate-pulse" />
                  <div className="h-4 w-1/2 rounded bg-slate-200 animate-pulse" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E2D8CC] p-12 text-center max-w-md mx-auto my-6 shadow-sm">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold font-serif text-[#1E1B18]">No products matched</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">Try clearing search filters or add a new book.</p>
              <button
                onClick={handleOpenAddForm}
                className="inline-flex items-center gap-2 bg-[#1E1B18] hover:bg-[#3D322C] text-[#FFF8E7] font-bold px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#D4A017]" /> Add New Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => {
                const id = prod._id || prod.id;
                const isCurrentlyEditing = editId === id;
                const imgUrl = prod.Image || prod.image || prod.imageUrl || INLINE_SVG_COVER;

                return (
                  <div
                    key={id}
                    className={`bg-white rounded-3xl border shadow-sm hover:shadow-2xl transition duration-300 overflow-hidden flex flex-col justify-between ${
                      isCurrentlyEditing
                        ? "border-[#D4A017] ring-4 ring-[#D4A017]/20"
                        : "border-[#E2D8CC]"
                    }`}
                  >
                    {/* Book Cover Image */}
                    <div className="bg-[#FFF8E7] p-5 flex items-center justify-center h-56 border-b border-[#F3EFEA] relative group">
                      <img
                        src={imgUrl}
                        alt={prod.BookName || "Book"}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = INLINE_SVG_COVER;
                        }}
                        className="h-full max-h-[200px] w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                      />

                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-gray-200">
                        In Stock
                      </span>
                    </div>

                    {/* Book Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-bold text-base font-serif text-[#1E1B18] line-clamp-2 min-h-[44px]">
                          {prod.BookName}
                        </h3>

                        <div className="flex items-center justify-between gap-2 mt-2">
                          <span className="text-xl font-black text-[#5C3A21]">
                            ₹{prod.Price}
                          </span>

                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-xs font-extrabold px-2.5 py-1 rounded-full border border-amber-200">
                            <Star className="w-3 h-3 fill-current text-amber-500" />
                            {prod.Rating || "4.5"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 text-xs text-gray-500 font-medium mt-3 pt-2 border-t border-slate-100">
                          <span>Age: {prod.Age || "Any"}+</span>
                          {prod.Language && (
                            <span className="inline-flex items-center gap-1">
                              <Globe className="w-3.5 h-3.5 text-[#5C3A21]" /> {prod.Language}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-3">
                        <button
                          onClick={() => handleEditClick(prod)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#FFF8E7] hover:bg-[#F5EFE4] text-[#5C3A21] font-bold py-2.5 rounded-xl text-xs border border-[#E8DCCB] transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#D4A017]" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(id)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminProducts;