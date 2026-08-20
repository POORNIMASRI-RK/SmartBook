import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import {
  Plus,
  Edit3,
  Trash2,
  Sparkles,
  Star,
  Globe,
  Image as ImageIcon,
  IndianRupee,
  X,
  BookOpen,
} from "lucide-react";

const INLINE_SVG_COVER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'><rect width='100%' height='100%' fill='%235C3A21'/><rect x='12' y='12' width='276' height='376' fill='%23FFF8E7' rx='10'/><path d='M40 80 h220 M40 120 h220 M40 160 h180' stroke='%23D4A017' stroke-width='4' stroke-linecap='round'/><text x='150' y='240' font-family='serif' font-size='22' font-weight='bold' fill='%232C1810' text-anchor='middle'>PaperHaven</text><text x='150' y='270' font-family='sans-serif' font-size='14' fill='%235C3A21' text-anchor='middle'>Classic Edition</text><circle cx='150' cy='330' r='20' fill='%23D4A017'/></svg>";

const AdminProducts = () => {
  // State variables for inputs, form visibility, and products list
  const [BookName, setBookName] = useState("");
  const [Price, setPrice] = useState("");
  const [Rating, setRating] = useState("");
  const [Age, setAge] = useState("");
  const [Language, setLanguage] = useState("");
  const [Image, setImage] = useState("");

  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false); // Toggle form visibility
  const [products, setProducts] = useState([]);
  const [saving, setSaving] = useState(false);

  // Fetch all products from backend
  const fetchProducts = async () => {
    try {
      const resp = await axios.get(`${import.meta.env.VITE_BACKEND_URL}products`);
      setProducts(resp.data.product || resp.data.products || []);
    } catch (err) {
      console.log("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Add or Edit Product Submit
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
        // Edit existing product
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}products/${editId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Updated product response:", response.data);
        window.alert("Product updated successfully!");
        handleCancelEdit();
      } else {
        // Add new product
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}create`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Created product response:", response.data);
        window.alert("Product created successfully!");
        handleCancelEdit();
      }

      fetchProducts();
    } catch (err) {
      console.log("Submit error:", err);
      window.alert(err.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  // Populate state fields when clicking edit button
  const handleEditClick = (prod) => {
    setEditId(prod._id || prod.id);
    setBookName(prod.BookName || "");
    setPrice(prod.Price || "");
    setRating(prod.Rating || "");
    setAge(prod.Age || "");
    setLanguage(prod.Language || "");
    setImage(prod.Image || prod.image || prod.imageUrl || "");
    setShowForm(true);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  // Delete product API call
  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Delete response:", response.data);
      window.alert("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      console.log("Delete error:", err);
      window.alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  // Cancel edit mode / close form
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

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans text-[#2C1810]">
      <Navbar />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 flex-1">
        {/* Page Title Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold font-serif text-[#2C1810] tracking-tight">
            Admin Product Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage store catalog, edit book details, and add new titles to PaperHaven.
          </p>
        </div>

        {/* Add New Product Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => {
              if (showForm && !editId) {
                handleCancelEdit();
              } else {
                setEditId(null);
                setBookName("");
                setPrice("");
                setRating("");
                setAge("");
                setLanguage("");
                setImage("");
                setShowForm(true);
              }
            }}
            className="bg-[#5C3A21] hover:bg-[#3E2615] text-[#FFF8E7] font-extrabold py-3.5 px-8 rounded-2xl shadow-lg transition transform hover:scale-105 flex items-center gap-2 cursor-pointer text-sm"
          >
            {showForm && !editId ? (
              <>
                <X className="w-5 h-5" /> Close Form
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-[#D4A017]" /> Add New Product
              </>
            )}
          </button>
        </div>

        {/* Form to Add or Edit Product (Shown only when showForm is true) */}
        {showForm && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl max-w-3xl mx-auto mb-10 border border-[#E8DCCB] animate-fadeIn">
            <div className="flex justify-between items-center pb-4 border-b border-[#F3EFEA] mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#FFF8E7] text-[#5C3A21] rounded-xl border border-[#E8DCCB]">
                  {editId ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5 text-[#D4A017]" />}
                </div>
                <h2 className="text-xl font-bold font-serif text-[#2C1810]">
                  {editId ? "Edit Product Details" : "Add New Product"}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600 font-bold p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Form Input Fields */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <label htmlFor="title" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    BookName *
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="Price" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Price (₹) *
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
                    <label htmlFor="Rating" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Rating *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      id="Rating"
                      placeholder="4.5"
                      className="w-full bg-[#FAF7F2] border border-[#E8DCCB] focus:border-[#5C3A21] focus:bg-white rounded-xl p-3 text-sm font-semibold outline-none transition"
                      value={Rating}
                      onChange={(e) => setRating(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="Age" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Age *
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="Language" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Language *
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

                  <div>
                    <label htmlFor="Image" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
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
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-[#5C3A21] hover:bg-[#3E2615] text-[#FFF8E7] p-3 rounded-xl font-bold transition shadow cursor-pointer text-sm"
                  >
                    {saving ? "Saving..." : editId ? "Update Product" : "Add Product"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 p-3 rounded-xl font-bold transition text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Live Cover Preview Box */}
              <div className="md:col-span-4 bg-[#FFF8E7]/70 border border-[#E8DCCB] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-[#5C3A21] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" /> Cover Preview
                </span>

                <div className="w-32 h-44 bg-white rounded-xl border border-[#E8DCCB] shadow-md p-2 flex items-center justify-center overflow-hidden mb-2">
                  <img
                    src={Image || INLINE_SVG_COVER}
                    alt="Live Cover Preview"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = INLINE_SVG_COVER;
                    }}
                    className="h-full w-auto object-contain"
                  />
                </div>

                <h4 className="font-bold text-xs text-[#2C1810] line-clamp-1 font-serif">
                  {BookName || "Book Title"}
                </h4>
                <p className="text-xs text-[#5C3A21] font-semibold mt-0.5">
                  ₹{Price || "0"} • {Language || "Language"}
                </p>
              </div>
            </form>
          </div>
        )}

        {/* View All Products List */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold font-serif text-[#2C1810] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#5C3A21]" /> All Products ({products.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((prod) => {
            const id = prod._id || prod.id;
            const isCurrentlyEditing = editId === id;
            const imgUrl = prod.Image || prod.image || prod.imageUrl || INLINE_SVG_COVER;

            return (
              <div
                key={id}
                className={`bg-white rounded-2xl border shadow-sm hover:shadow-lg transition duration-300 overflow-hidden flex flex-col justify-between ${
                  isCurrentlyEditing
                    ? "border-[#D4A017] ring-2 ring-[#D4A017]/30"
                    : "border-[#E8DCCB]"
                }`}
              >
                {/* Book Cover Image */}
                <div className="bg-[#FFF8E7] p-4 flex items-center justify-center h-52 border-b border-[#F3EFEA] relative">
                  <img
                    src={imgUrl}
                    alt={prod.BookName || "Book"}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = INLINE_SVG_COVER;
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
                          <Globe className="w-3 h-3 text-[#5C3A21]" /> {prod.Language}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleEditClick(prod)}
                      className="flex-1 inline-flex items-center justify-center gap-1 bg-[#FFF8E7] hover:bg-[#F3EFEA] text-[#5C3A21] font-bold py-2 rounded-xl text-xs border border-[#E8DCCB] transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#D4A017]" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(id)}
                      className="flex-1 inline-flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 rounded-xl text-xs transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminProducts;