import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";

const AdminProducts = () => {
  // 1. Create a state variable for each input field and products list
  const [BookName, setBookName] = useState("");
  const [Price, setPrice] = useState("");
  const [Rating, setRating] = useState("");
  const [Age, setAge] = useState("");
  const [Language, setLanguage] = useState("");
  const [Image, setImage] = useState("");

  const [editId, setEditId] = useState(null);
  const [products, setProducts] = useState([]);

  // Fetch all products from backend
  const fetchProducts = async () => {
    try {
      const resp = await axios.get(`${import.meta.env.VITE_BACKEND_URL}products`);
      console.log("Products fetched: ", resp);
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
        setEditId(null);
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
      }

      // Reset form fields
      setBookName("");
      setPrice("");
      setRating("");
      setAge("");
      setLanguage("");
      setImage("");

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

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditId(null);
    setBookName("");
    setPrice("");
    setRating("");
    setAge("");
    setLanguage("");
    setImage("");
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center my-4">Admin Product Management</h1>

        {/* Form to Add or Edit Product */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md max-w-xl mx-auto mb-8 border"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            {editId ? "Edit Product" : "Add New Product"}
          </h2>

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
            <div className="w-1/2">
              <label htmlFor="Price" className="block font-medium mb-1">
                Price
              </label>
              <input
                type="number"
                id="price"
                placeholder="Price"
                className="w-full border p-2 mb-3 rounded"
                value={Price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="w-1/2">
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
            <div>
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

          <div className="flex gap-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700 transition-colors"
            >
              {editId ? "Update Product" : "Add Product"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full bg-gray-500 text-white p-2 rounded font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

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
                    src={prod.Image}
                    alt={prod.BookName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400";
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
                    className="flex-1 bg-yellow-500 text-white py-1 rounded font-semibold hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(id)}
                    className="flex-1 bg-red-600 text-white py-1 rounded font-semibold hover:bg-red-700 transition"
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