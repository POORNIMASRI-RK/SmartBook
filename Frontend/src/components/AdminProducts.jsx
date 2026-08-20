import React, { useEffect, useState, useMemo } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Star,
  Globe,
  Image as ImageIcon,
  IndianRupee,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
} from "lucide-react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400";

const AdminProducts = () => {
  // Form State
  const [BookName, setBookName] = useState("");
  const [Price, setPrice] = useState("");
  const [Rating, setRating] = useState("");
  const [Age, setAge] = useState("");
  const [Language, setLanguage] = useState("");
  const [Image, setImage] = useState("");

  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal popup state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
      Image: Image.trim() || FALLBACK_IMAGE,
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
          handleCloseModal();
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
          handleCloseModal();
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

  // Open Modal for Editing
  const handleEditClick = (prod) => {
    setEditId(prod._id || prod.id);
    setBookName(prod.BookName || "");
    setPrice(prod.Price || "");
    setRating(prod.Rating || "");
    setAge(prod.Age || "");
    setLanguage(prod.Language || "");
    setImage(prod.Image || "");
    setIsModalOpen(true);
  };

  // Open Modal for Adding New Product
  const handleOpenAddModal = () => {
    setEditId(null);
    setBookName("");
    setPrice("");
    setRating("");
    setAge("");
    setLanguage("");
    setImage("");
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setBookName("");
    setPrice("");
    setRating("");
    setAge("");
    setLanguage("");
    setImage("");
  };

  // Delete product API call
  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

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

  // Filtered Products for Admin Search
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const q = searchTerm.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.BookName?.toLowerCase().includes(q) ||
        p.Language?.toLowerCase().includes(q) ||
        String(p.Price || "").includes(q)
    );
  }, [products, searchTerm]);

  return (
    <div className="min-h-screen bg-[#FBF8F3] flex flex-col font-sans text-[#2C1810]">
      <Navbar />

      {/* Floating Toast Notification */}
      {toast.show && (
        <div className="fixed top-20 right-5 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold backdrop-blur-md ${
              toast.type === "success"
                ? "bg-emerald-950/90 text-emerald-100 border-emerald-800"
                : "bg-red-950/90 text-red-100 border-red-800"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8DCCB] shadow-sm">
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#2C1810]">
              Admin Product Management
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage your book inventory, edit details, and add new titles to PaperHaven.
            </p>
          </div>

          {/* Add New Product Button */}
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 bg-[#5C3A21] hover:bg-[#3E2615] text-[#FFF8E7] font-bold px-6 py-3 rounded-2xl shadow-md transition transform hover:scale-105"
          >
            <Plus className="w-5 h-5 text-[#D4A017]" /> Add New Product
          </button>
        </div>

        {/* Existing Products List Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold font-serif text-[#2C1810] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#5C3A21]" /> All Products ({filteredProducts.length})
            </h2>

            {/* Admin Live Search Filter */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#E8DCCB] focus:border-[#5C3A21] rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold outline-none shadow-sm"
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

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-[#E8DCCB] space-y-3">
                  <div className="h-44 rounded-xl bg-slate-200 animate-pulse" />
                  <div className="h-4 w-3/4 rounded bg-slate-200 animate-pulse" />
                  <div className="h-4 w-1/2 rounded bg-slate-200 animate-pulse" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E8DCCB] p-12 text-center max-w-md mx-auto my-6 shadow-sm">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold font-serif text-[#2C1810]">No products found</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">Try searching another title or add a new product.</p>
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-2 bg-[#5C3A21] hover:bg-[#3E2615] text-[#FFF8E7] font-bold px-5 py-2.5 rounded-xl shadow-md transition"
              >
                <Plus className="w-4 h-4 text-[#D4A017]" /> Add New Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => {
                const id = prod._id || prod.id;

                return (
                  <div
                    key={id}
                    className="bg-white rounded-2xl border border-[#E8DCCB] shadow-sm hover:shadow-xl transition duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    {/* Book Cover Image */}
                    <div className="bg-[#FFF8E7] p-4 flex items-center justify-center h-52 border-b border-[#F3EFEA] relative">
                      <img
                        src={prod.Image}
                        alt={prod.BookName}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = FALLBACK_IMAGE;
                        }}
                        className="h-full max-h-[190px] w-auto object-contain drop-shadow-md"
                      />
                    </div>

                    {/* Book Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-bold text-base font-serif text-[#2C1810] line-clamp-2 min-h-[44px]">
                          {prod.BookName}
                        </h3>

                        <div className="flex items-center justify-between gap-2 mt-2">
                          <span className="text-lg font-black text-[#5C3A21]">
                            Price : ₹{prod.Price}
                          </span>

                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-200">
                            <Star className="w-3 h-3 fill-current text-amber-500" />
                            {prod.Rating || "4.5"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 text-xs text-gray-500 mt-2">
                          <span>Age : {prod.Age || "Any"}</span>
                          {prod.Language && (
                            <span className="inline-flex items-center gap-1">
                              <Globe className="w-3 h-3" /> Language : {prod.Language}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => handleEditClick(prod)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#FFF8E7] hover:bg-[#F3EFEA] text-[#5C3A21] font-bold py-2 rounded-xl text-xs border border-[#E8DCCB] transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(id)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 rounded-xl text-xs transition"
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

      {/* POPUP MODAL DIALOG FOR ADD / EDIT PRODUCT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E8DCCB] shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F3EFEA] mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#FFF8E7] text-[#5C3A21] rounded-2xl border border-[#E8DCCB]">
                  {editId ? <Edit3 className="w-6 h-6" /> : <Plus className="w-6 h-6 text-[#D4A017]" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif text-[#2C1810]">
                    {editId ? "Edit Product" : "Add New Product"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {editId
                      ? "Update the details of the selected product."
                      : "Fill in the details below to add a new product."}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                  BookName
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Book Name"
                  className="w-full bg-[#FAF7F2] border border-[#E8DCCB] focus:border-[#5C3A21] focus:bg-white rounded-xl p-3 text-sm font-semibold outline-none transition"
                  value={BookName}
                  onChange={(e) => setBookName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="Rating" className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                  Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  id="Rating"
                  placeholder="Product Rating (e.g. 4.5)"
                  className="w-full bg-[#FAF7F2] border border-[#E8DCCB] focus:border-[#5C3A21] focus:bg-white rounded-xl p-3 text-sm font-semibold outline-none transition"
                  value={Rating}
                  onChange={(e) => setRating(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="Price" className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    id="Price"
                    placeholder="Price"
                    className="w-full bg-[#FAF7F2] border border-[#E8DCCB] focus:border-[#5C3A21] focus:bg-white rounded-xl p-3 text-sm font-semibold outline-none transition"
                    value={Price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="Age" className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    id="Age"
                    placeholder="Age"
                    className="w-full bg-[#FAF7F2] border border-[#E8DCCB] focus:border-[#5C3A21] focus:bg-white rounded-xl p-3 text-sm font-semibold outline-none transition"
                    value={Age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="Language" className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                    Language
                  </label>
                  <input
                    type="text"
                    id="Language"
                    placeholder="Language"
                    className="w-full bg-[#FAF7F2] border border-[#E8DCCB] focus:border-[#5C3A21] focus:bg-white rounded-xl p-3 text-sm font-semibold outline-none transition"
                    value={Language}
                    onChange={(e) => setLanguage(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="Image" className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  id="Image"
                  placeholder="Image URL"
                  className="w-full bg-[#FAF7F2] border border-[#E8DCCB] focus:border-[#5C3A21] focus:bg-white rounded-xl p-3 text-sm font-semibold outline-none transition"
                  value={Image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              {/* Cover Preview inside Modal */}
              {Image && (
                <div className="p-3 bg-[#FFF8E7] rounded-xl border border-[#E8DCCB] flex items-center gap-4">
                  <div className="w-12 h-16 bg-white rounded border border-[#E8DCCB] p-1 flex items-center justify-center overflow-hidden">
                    <img
                      src={Image}
                      alt="Preview"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#5C3A21]">Live Image Preview Attached</span>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#F3EFEA]">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#5C3A21] hover:bg-[#3E2615] text-[#FFF8E7] font-bold py-3.5 rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : editId ? "Update Product" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3.5 rounded-xl transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminProducts;