import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { Heart, ShoppingCart, Trash2, ArrowLeft, Star, Sparkles } from "lucide-react";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist.items);

  const moveToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(removeFromWishlist(product._id || product.id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2C1810]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 pb-4 border-b border-[#E8DCCB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Saved Favorites</span>
            </div>
            <h1 className="text-3xl font-extrabold font-serif text-[#2C1810] tracking-tight flex items-center gap-3">
              <span>My Literary Wishlist</span>
              {wishlist.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                  {wishlist.length} Items
                </span>
              )}
            </h1>
          </div>
        </div>

        {wishlist.length === 0 ? (
          /* Empty Wishlist State */
          <div className="bg-white rounded-3xl border border-[#E8DCCB] p-12 text-center max-w-lg mx-auto my-12 flex flex-col items-center shadow-sm">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
              <Heart className="w-10 h-10 fill-current" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-[#2C1810] mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-500 text-sm max-w-sm mb-8 leading-relaxed">
              Explore our books and tap the heart icon on any book to save it to your wishlist for later!
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 bg-[#5C3A21] hover:bg-[#3E2615] text-[#FFF8E7] font-bold px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse Books
            </button>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              const itemId = item._id || item.id;
              const name = item.BookName || item.name || "Book";
              const price = item.Price || item.price || 0;
              const rating = item.Rating || item.rating;

              return (
                <div
                  key={itemId}
                  className="bg-white rounded-2xl border border-[#E8DCCB] shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div className="bg-[#FFF8E7] p-5 flex items-center justify-center h-64 border-b border-[#F3EFEA] relative">
                    <img
                      src={item.Image}
                      alt={name}
                      className="h-full max-h-[220px] w-auto object-contain drop-shadow-md"
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="font-bold font-serif text-[#2C1810] text-base line-clamp-2 min-h-[44px]">
                        {name}
                      </h2>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xl font-black text-[#5C3A21]">
                          ₹{price}
                        </span>

                        {rating && (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-200">
                            <Star className="w-3 h-3 fill-current text-amber-500" />
                            {rating}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-5 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => moveToCart(item)}
                        className="w-full bg-[#5C3A21] hover:bg-[#3E2615] text-[#FFF8E7] font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md shadow-[#5C3A21]/20"
                      >
                        <ShoppingCart className="w-4 h-4" /> Move to Cart
                      </button>

                      <button
                        onClick={() => dispatch(removeFromWishlist(itemId))}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
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

export default Wishlist;