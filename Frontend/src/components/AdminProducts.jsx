import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import {
  Plus,
  X,
  Edit3,
  Trash2,
  Package,
  Star,
  Globe,
  Tag,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";

const AdminProducts = () => {
  // State variables for form fields and product list
  const [BookName, setBookName] = useState("");
  const [Price, setPrice] = useState("");
  const [Rating, setRating] = useState("");
  const [Age, setAge] = useState("");
  const [Language, setLanguage] = useState("");
  const [Image, setImage] = useState("");

  const [editId, setEditId] = useState(null);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all products from backend
  const fetchProducts = async () => {
    try {
      const resp = await axios.get(`${import.meta.env.VITE_BACKEND_URL}products`);
      const list = resp.data.product || resp.data.products || [];
      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Open modal for adding a new product
  const handleOpenAddModal = () => {
    handleResetForm();
    setIsModalOpen(true);
  };

  // Open modal for editing existing product
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

  // Reset form fields
  const handleResetForm = () => {
    setEditId(null);
    setBookName("");
    setPrice("");
    setRating("");
    setAge("");
    setLanguage("");
    setImage("");
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    handleResetForm();
  };

  // Handle Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setSubmitting(true);

    try {
      if (editId) {
        // Edit product
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}products/${editId}`,
          {
            BookName: BookName.trim(),
            Price: Number(Price),
            Rating: Number(Rating),
            Age: Number(Age),
            Language: Language.trim(),
            Image: Image.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          window.alert("Product updated successfully!");
        }
      } else {
        // Add product
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}create`,
          {
            BookName: BookName.trim(),
            Price: Number(Price),
            Rating: Number(Rating),
            Age: Number(Age),
            Language: Language.trim(),
            Image: Image.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          window.alert("Product created successfully!");
        }
      }

      handleCloseModal();
      fetchProducts();
    } catch (err) {
      console.error(err);
      window.alert(err.response?.data?.message || err.response?.data?.error || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete product
  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      window.alert("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      window.alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF7]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Action Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DCCB] shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8E7] border border-[#E8DCCB] text-[#5C3A21] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
              Admin Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#2C1810]">
              Product Inventory Management
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Manage inventory, add new books, edit pricing, or remove titles from PaperHaven store.
            </p>
          </div>

          {/* ADD NEW PRODUCT BUTTON */}
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-[#5C3A21] hover:bg-[#3E2615] text-[#FFF8E7] font-bold px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 text-sm"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            Add New Product
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-[#E8DCCB] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] text-[#5C3A21] flex items-center justify-center font-bold">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Books</p>
              <p className="text-2xl font-black text-[#2C1810]">{products.length}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8DCCB] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Avg Rating</p>
              <p className="text-2xl font-black text-[#2C1810]">4.7 ★</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8DCCB] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Status</p>
              <p className="text-base font-bold text-emerald-600">Active Catalog</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-serif text-[#2C1810] flex items-center gap-2">
            Catalog Products <span className="text-xs bg-[#FFF8E7] text-[#5C3A21] px-2.5 py-0.5 rounded-full border border-[#E8DCCB]">{products.length}</span>
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E8DCCB] p-12 text-center max-w-md mx-auto my-8">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-xl font-bold font-serif text-[#2C1810] mb-1">No products found</h3>
            <p className="text-gray-500 text-xs mb-6">Click the "Add New Product" button above to add your first book.</p>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 bg-[#5C3A21] text-[#FFF8E7] font-bold px-5 py-2.5 rounded-xl text-sm"
            >
              <Plus className="w-4 h-4" /> Add Product Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((prod) => {
              const id = prod._id || prod.id;
              return (
                <div
                  key={id}
                  className="bg-white rounded-2xl border border-[#E8DCCB] shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div className="bg-[#FFF8E7] p-5 flex items-center justify-center h-60 border-b border-[#F3EFEA] relative">
                    <img
                      src={prod.Image}
                      alt={prod.BookName}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400";
                      }}
                      className="h-full max-h-[200px] w-auto object-contain drop-shadow-md"
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold font-serif text-[#2C1810] text-base line-clamp-2 min-h-[44px]">
                        {prod.BookName}
                      </h3>

                      <div className="flex items-center justify-between gap-2 mt-2">
                        <span className="text-lg font-black text-[#5C3A21]">
                          ₹{prod.Price}
                        </span>

                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-200">
                          <Star className="w-3 h-3 fill-current text-amber-500" />
                          {prod.Rating || "4.5"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 font-medium">
                        {prod.Language && (
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" /> {prod.Language}
                          </span>
                        )}
                        {prod.Age && <span>Age: {prod.Age}+</span>}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-5 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleEditClick(prod)}
                        className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1 border border-amber-200"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>

                      <button
                        onClick={() => handleDeleteClick(id)}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1 border border-red-200"
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
      </main>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E8DCCB] shadow-2xl max-w-xl w-full p-6 sm:p-8 relative my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F3EFEA] mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#FFF8E7] text-[#5C3A21] rounded-2xl border border-[#E8DCCB]">
                  {editId ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif text-[#2C1810]">
                    {editId ? "Edit Product Details" : "Add New Book to Inventory"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {editId ? "Update pricing, title, or image URL." : "Enter book specifications below."}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1.5">
                  Book Name / Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Great Gatsby"
                  className="w-full bg-[#FFF8E7]/50 border border-[#E8DCCB] focus:border-[#5C3A21] rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition"
                  value={BookName}
                  onChange={(e) => setBookName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1.5">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 499"
                    className="w-full bg-[#FFF8E7]/50 border border-[#E8DCCB] focus:border-[#5C3A21] rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition"
                    value={Price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1.5">
                    Rating (1.0 - 5.0) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    placeholder="e.g. 4.8"
                    className="w-full bg-[#FFF8E7]/50 border border-[#E8DCCB] focus:border-[#5C3A21] rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition"
                    value={Rating}
                    onChange={(e) => setRating(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1.5">
                    Target Age Group *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 12"
                    className="w-full bg-[#FFF8E7]/50 border border-[#E8DCCB] focus:border-[#5C3A21] rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition"
                    value={Age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1.5">
                    Language *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. English"
                    className="w-full bg-[#FFF8E7]/50 border border-[#E8DCCB] focus:border-[#5C3A21] rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition"
                    value={Language}
                    onChange={(e) => setLanguage(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1.5">
                  Image Cover URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FFF8E7]/50 border border-[#E8DCCB] focus:border-[#5C3A21] rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition"
                  value={Image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              {/* Cover Preview */}
              {Image.trim() && (
                <div className="p-3 bg-[#FFF8E7] rounded-xl border border-[#E8DCCB] flex items-center gap-4">
                  <div className="w-12 h-16 bg-white rounded-lg overflow-hidden border border-[#E8DCCB] p-1 flex items-center justify-center">
                    <img
                      src={Image}
                      alt="Cover Preview"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400";
                      }}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#5C3A21] block">Cover Image Preview</span>
                    <span className="text-[11px] text-gray-500">Image loaded dynamically</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#F3EFEA]">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#5C3A21] hover:bg-[#3E2615] text-[#FFF8E7] font-bold py-3 rounded-xl text-sm shadow-lg transition transform hover:scale-[1.02] disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editId
                    ? "Update Product"
                    : "Add Product"}
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