import React, { useEffect, useState, useMemo } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addToCart } from "../features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";
import axios from "axios";
import {
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  Heart,
  ShoppingCart,
  Star,
  Globe,
  User,
  RotateCcw,
  SearchX,
  ArrowUpDown,
} from "lucide-react";

const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-Time Filters
  const [searchTerm, setSearchTerm] = useState(location.state?.search || "");
  const [selectedCategory, setSelectedCategory] = useState(location.state?.category || "All");
  const [sortBy, setSortBy] = useState("featured"); // "featured", "price-asc", "price-desc", "rating-desc"

  // Real-Time Toast Notification State
  const [toast, setToast] = useState(null);

  // Redux Data
  const cart = useSelector((state) => state.cart.items);
  const wishlist = useSelector((state) => state.wishlist.items);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(`${import.meta.env.VITE_BACKEND_URL}products`);
        const list = resp.data.product || resp.data.products || [];
        setProducts(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Update filters if passed via navigation state
  useEffect(() => {
    if (location.state?.search !== undefined) {
      setSearchTerm(location.state.search);
    }
    if (location.state?.category !== undefined) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

  // Real-Time Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Live Category Filter
    if (selectedCategory && selectedCategory !== "All") {
      list = list.filter((p) => {
        const categoryMatch =
          p.Category?.toLowerCase() === selectedCategory.toLowerCase() ||
          p.Language?.toLowerCase() === selectedCategory.toLowerCase() ||
          p.BookName?.toLowerCase().includes(selectedCategory.toLowerCase());
        return categoryMatch;
      });
    }

    // 2. Live Search Filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.BookName?.toLowerCase().includes(q) ||
          p.Language?.toLowerCase().includes(q) ||
          String(p.Age || "").toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    if (sortBy === "price-asc") {
      list.sort((a, b) => (Number(a.Price) || 0) - (Number(b.Price) || 0));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => (Number(b.Price) || 0) - (Number(a.Price) || 0));
    } else if (sortBy === "rating-desc") {
      list.sort((a, b) => (Number(b.Rating) || 0) - (Number(a.Rating) || 0));
    }

    return list;
  }, [products, selectedCategory, searchTerm, sortBy]);

  const handleAddToCart = (prod) => {
    dispatch(addToCart(prod));
    showToast(`Added "${prod.BookName}" to your cart! 🛒`);
  };

  const handleToggleWishlist = (prod) => {
    const targetId = prod._id || prod.id;
    const isWishlisted = wishlist.some((w) => (w._id || w.id) === targetId);

    if (isWishlisted) {
      dispatch(removeFromWishlist(targetId));
      showToast(`Removed "${prod.BookName}" from wishlist.`, "info");
    } else {
      dispatch(addToWishlist(prod));
      showToast(`Added "${prod.BookName}" to wishlist! ❤️`);
    }
  };

  return (
    <>
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-toast">
          <div
            className={`px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 text-sm font-bold ${
              toast.type === "info"
                ? "bg-slate-900 text-white border-slate-700"
                : "bg-[#5C3A21] text-[#FFF8E7] border-[#D4A017]"
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-[#D4A017] flex-shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <section className="bg-[#FAF8F5] text-[#2C1810] px-4 sm:px-6 py-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          {/* Header & Filter Controls Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E8DCCB]">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold font-serif text-[#2C1810] tracking-tight">
                {selectedCategory === "All" ? "Featured Literary Collection" : selectedCategory}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Displaying{" "}
                <span className="font-bold text-[#5C3A21]">{filteredProducts.length}</span> of{" "}
                <span className="font-bold">{products.length}</span> books in store
              </p>
            </div>

            {/* Sorting & Filter Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#D6C6B8] shadow-sm text-xs font-semibold">
                <ArrowUpDown className="w-4 h-4 text-[#8C6D53]" />
                <span className="text-gray-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold outline-none cursor-pointer text-[#5C3A21]"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated ⭐</option>
                </select>
              </div>

              {(searchTerm || selectedCategory !== "All") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSortBy("featured");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Skeleton Shimmer Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4"
                >
                  <div className="h-60 rounded-xl animate-shimmer" />
                  <div className="h-5 w-3/4 rounded animate-shimmer" />
                  <div className="h-4 w-1/2 rounded animate-shimmer" />
                  <div className="h-8 rounded-xl animate-shimmer" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Empty Filter State */
            <div className="bg-white rounded-3xl border border-[#E8DCCB] p-12 text-center max-w-lg mx-auto my-12 shadow-sm">
              <div className="w-20 h-20 bg-[#FFF8E7] rounded-full flex items-center justify-center mx-auto mb-4 text-[#5C3A21]">
                <SearchX className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold font-serif text-[#2C1810] mb-2">
                No matching books found
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                Try clearing your search term <span className="font-bold">"{searchTerm}"</span> or selecting a different category tab.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="inline-flex items-center gap-2 bg-[#5C3A21] hover:bg-[#3E2615] text-[#FFF8E7] font-bold px-6 py-2.5 rounded-xl shadow-lg transition transform hover:scale-[1.02]"
              >
                Show All Books
              </button>
            </div>
          ) : (
            /* Product Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((prod) => {
                const prodId = prod._id || prod.id;
                const isWishlisted = wishlist.some((w) => (w._id || w.id) === prodId);

                return (
                  <div
                    key={prodId}
                    className="group relative bg-white rounded-2xl border border-[#E8DCCB] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    {/* Wishlist Floating Heart Button */}
                    <button
                      onClick={() => handleToggleWishlist(prod)}
                      className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full shadow-md flex items-center justify-center transition transform hover:scale-110 ${
                        isWishlisted
                          ? "bg-red-50 text-red-500 border border-red-200"
                          : "bg-white/90 text-gray-400 hover:text-red-500"
                      }`}
                      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                    </button>

                    {/* Book Cover Container */}
                    <div className="bg-[#FFF8E7] p-5 flex items-center justify-center relative overflow-hidden h-64 border-b border-[#F3EFEA]">
                      <img
                        src={prod.Image}
                        alt={prod.BookName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400";
                        }}
                        className="h-full max-h-[220px] w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title */}
                        <h2 className="font-bold text-base font-serif text-[#2C1810] line-clamp-2 min-h-[44px] group-hover:text-[#5C3A21] transition">
                          {prod.BookName}
                        </h2>

                        {/* Rating & Language Pills */}
                        <div className="flex items-center justify-between gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-200">
                            <Star className="w-3 h-3 fill-current text-amber-500" />
                            {prod.Rating || "4.5"}
                          </span>

                          {prod.Language && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 font-medium truncate">
                              <Globe className="w-3 h-3" />
                              {prod.Language}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        {/* Price */}
                        <div>
                          <span className="text-xs text-gray-400 block font-medium">Price</span>
                          <span className="text-xl font-black text-[#5C3A21]">
                            ₹{prod.Price}
                          </span>
                        </div>

                        {/* Add To Cart Button */}
                        <button
                          onClick={() => handleAddToCart(prod)}
                          className="bg-[#D4A017] hover:bg-[#B8860B] text-[#2C1810] font-bold px-3.5 py-2 rounded-xl text-xs transition duration-200 hover:scale-105 flex items-center gap-1.5 shadow-md shadow-[#D4A017]/20"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Product;