import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";

const INLINE_SVG_COVER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'><rect width='100%' height='100%' fill='%235C3A21'/><rect x='12' y='12' width='276' height='376' fill='%23FFF8E7' rx='10'/><path d='M40 80 h220 M40 120 h220 M40 160 h180' stroke='%23D4A017' stroke-width='4' stroke-linecap='round'/><text x='150' y='240' font-family='serif' font-size='22' font-weight='bold' fill='%232C1810' text-anchor='middle'>PaperHaven</text><text x='150' y='270' font-family='sans-serif' font-size='14' fill='%235C3A21' text-anchor='middle'>Classic Edition</text><circle cx='150' cy='330' r='20' fill='%23D4A017'/></svg>";

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

  // Fetch all products from backend
  const fetchProducts = async () => {
    try {
      const resp = await axios.get(`${import.meta.env.VITE_BACKEND_URL}products`);
      setProducts(resp.data.product || resp.data.products || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Add or Edit Product Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      if (editId) {
        // Edit existing product
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}products/${editId}`,
          {
            BookName,
            Price: Number(Price),
            Rating: Number(Rating),
            Age: Number(Age),
            Language,
            Image,
          },
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
          {
            BookName,
            Price: Number(Price),
            Rating: Number(Rating),
            Age: Number(Age),
            Language,
            Image,
          },
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
      console.log(err);
      window.alert(err.response?.data?.message || "Operation failed");
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
    setImage(prod.Image || "");
    setShowForm(true);
    window.scrollTo({ top: 100, behavior: "smooth" });
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
      console.log(err);
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
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center my-4">Admin Product Management</h1>

        {/* Add New Product Button */}
        <div className="flex justify-center mb-6">
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
            className="bg-[#5C3A21] hover:bg-[#3E2615] text-[#FFF8E7] font-bold py-3 px-8 rounded-xl shadow-md transition transform hover:scale-105 flex items-center gap-2 cursor-pointer text-base"
          >
            {showForm && !editId ? "✕ Close Form" : "+ Add New Product"}
          </button>
        </div>

        {/* Form to Add or Edit Product (Shown only when showForm is true) */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md max-w-xl mx-auto mb-8 border border-[#E8DCCB]"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-center flex-1 text-[#2C1810]">
                {editId ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600 font-bold px-2 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <label htmlFor="title" className="block font-medium mb-1">
              BookName
            </label>
            <input
              type="text"
              id="title"
              placeholder="Book Name"
              className="w-full border p-2 mb-3 rounded"
              value={BookName}
              onChange={(e) => setBookName(e.target.value)}
              required
            />

            <label htmlFor="Rating" className="block font-medium mb-1">
              Rating
            </label>
            <input
              type="number"
              step="0.1"
              id="Rating"
              placeholder="Product Rating (e.g. 4.5)"
              className="w-full border p-2 mb-3 rounded"
              value={Rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />

            <div className="flex gap-4">
              <div className="w-1/3">
                <label htmlFor="Price" className="block font-medium mb-1">
                  Price
                </label>
                <input
                  type="number"
                  id="Price"
                  placeholder="Price"
                  className="w-full border p-2 mb-3 rounded"
                  value={Price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="w-1/3">
                <label htmlFor="Age" className="block font-medium mb-1">
                  Age
                </label>
                <input
                  type="number"
                  id="Age"
                  placeholder="Age"
                  className="w-full border p-2 mb-3 rounded"
                  value={Age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>

              <div className="w-1/3">
                <label htmlFor="Language" className="block font-medium mb-1">
                  Language
                </label>
                <input
                  type="text"
                  id="Language"
                  placeholder="Language"
                  className="w-full border p-2 mb-3 rounded"
                  value={Language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                />
              </div>
            </div>

            <label htmlFor="Image" className="block font-medium mb-1">
              Image URL
            </label>
            <input
              type="text"
              id="Image"
              placeholder="Image URL"
              className="w-full border p-2 mb-3 rounded"
              value={Image}
              onChange={(e) => setImage(e.target.value)}
            />

            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="w-full bg-[#5C3A21] hover:bg-[#3E2615] text-[#FFF8E7] p-2.5 rounded font-semibold transition cursor-pointer"
              >
                {editId ? "Update Product" : "Add Product"}
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full bg-gray-500 text-white p-2.5 rounded font-semibold hover:bg-gray-600 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* View All Products List */}
        <h2 className="text-xl font-bold mb-4">All Products ({products.length})</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((prod) => {
            const id = prod._id || prod.id;
            return (
              <div
                key={id}
                className="bg-white p-4 rounded-lg shadow-md border flex flex-col justify-between"
              >
                <div>
                  <img
                    src={prod.Image || prod.image || prod.imageUrl || INLINE_SVG_COVER}
                    alt={prod.BookName || "Book"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = INLINE_SVG_COVER;
                    }}
                    className="h-44 w-full object-cover rounded mb-2"
                  />
                  <h3 className="font-bold text-lg">{prod.BookName}</h3>
                  <p className="text-gray-600 text-sm mb-2">{prod.Rating}</p>
                  <p className="font-semibold text-blue-600">Price : ₹{prod.Price}</p>
                  <p className="text-sm text-gray-500">Age : {prod.Age}</p>
                  <p className="text-sm text-gray-500">Language : {prod.Language}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEditClick(prod)}
                    className="flex-1 bg-yellow-500 text-white py-1 rounded font-semibold hover:bg-yellow-600 transition cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(id)}
                    className="flex-1 bg-red-600 text-white py-1 rounded font-semibold hover:bg-red-700 transition cursor-pointer"
                  >
                    Delete
                  </button>
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