import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { removeFromWishlist } from "../features/wishlist/wishlistSlice";


const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist.items);
  const cart = useSelector((state) => state.cart.items);
  const cartCount = cart.reduce((total, item) => total + item.quantity,0);
  const wishlistCount = wishlist.length;
  
    const moveToCart = (product) => {
      dispatch(addToCart(product));
      dispatch(removeFromWishlist(product._id || product.id));
    };

  return (
    <>
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlist.length}
      />

      <div className="bg-gray-100 min-h-screen p-6">

        <h1 className="text-3xl font-bold text-center mb-8 text-[#5C3A21]">
          ❤️ My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center mt-20">
            <h2 className="text-2xl text-gray-600">
              Your Wishlist is Empty
            </h2>

            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-[#5C3A21] text-white px-6 py-3 rounded-lg hover:bg-[#432a18]"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6 max-w-7xl mx-auto">

            {wishlist.map((item) => {
              const itemId = item._id || item.id;
              const name = item.BookName || item.name || "Book";
              const price = item.Price || item.price || 0;
              const rating = item.Rating || item.rating;

              return (
                <div
                  key={itemId}
                  className="bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl transition"
                >
                  <img
                    src={item.Image}
                    alt={name}
                    className="h-64 w-full object-contain"
                  />

                  <h2 className="font-bold mt-4 line-clamp-2 text-[#5C3A21]">
                    {name}
                  </h2>

                  <p className="text-[#5C3A21] font-bold mt-2">
                    ₹{price}
                  </p>

                  {rating && <p className="text-yellow-600 text-sm mt-1">⭐ {rating}</p>}

                  <div className="flex flex-col gap-3 mt-5">

                    <button
                      onClick={() => moveToCart(item)}
                      className="bg-[#5C3A21] text-white py-2 rounded hover:bg-[#3E2615] transition"
                    >
                      🛒 Move to Cart
                    </button>

                    <button
                      onClick={() => dispatch(removeFromWishlist(itemId))}
                      className="bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                    >
                      🗑 Remove
                    </button>

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </div>

      <Footer />
    </>
  );
};

export default Wishlist;