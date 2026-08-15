import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../features/cart/cartSlice";
import { addToWishlist } from "../features/wishlist/wishlistSlice";
import axios from "axios";


const Product = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const [products, setProducts] = useState([]);

// Cart data
const cart = useSelector((state) => state.cart.items);

// Wishlist data
const wishlist = useSelector((state) => state.wishlist.items);

// Cart count
const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Wishlist count
  const wishlistCount = wishlist.length;

  // const products = [
  //   {
  //     id: 1,
  //     name: "The Psychology of Money",
  //     price: 269,
  //     rating: "4.6 ★★★★☆",
  //     age: "18 Years and Up",
  //     language: "English",
  //     image:
  //       "https://m.media-amazon.com/images/I/71XEsXS5RlL._SY342_.jpg",
  //   },
  //   {
  //     id: 2,
  //     name: "Don't Believe Everything You Think",
  //     price: 164,
  //     rating: "4.5 ★★★★☆",
  //     age: "12 Years and Up",
  //     language: "English",
  //     image:
  //       "https://m.media-amazon.com/images/I/71l4V5QookL._SY342_.jpg",
  //   },
  //   {
  //     id: 3,
  //     name: "The Power of Your Subconscious Mind",
  //     price: 119,
  //     rating: "4.4 ★★★★☆",
  //     age: "16 Years and Up",
  //     language: "English",
  //     image:
  //       "https://m.media-amazon.com/images/I/71sBtM3Yi5L._SY342_.jpg",
  //   },
  //   {
  //     id: 4,
  //     name: "Read People Like a Book",
  //     price: 169,
  //     rating: "4.5 ★★★★☆",
  //     age: "20 Years and Up",
  //     language: "English",
  //     image:
  //       "https://m.media-amazon.com/images/I/51eysN903mL._SY342_.jpg",
  //   },
  //   {
  //     id: 5,
  //     name: "Stop Letting Everything Affect You",
  //     price: 190,
  //     rating: "4.6 ★★★★☆",
  //     age: "18 Years and Up",
  //     language: "English",
  //     image:
  //       "https://m.media-amazon.com/images/I/71sXWkc3YsL._SY342_.jpg",
  //   },
  //   {
  //     id: 6,
  //     name: "The Mountain Is You",
  //     price: 221,
  //     rating: "4.5 ★★★★☆",
  //     age: "12 Years and Up",
  //     language: "English",
  //     image:
  //       "https://m.media-amazon.com/images/I/61xivWmExiL._SY342_.jpg",
  //   },
  //   {
  //     id: 7,
  //     name: "The Alchemist",
  //     price: 239,
  //     rating: "4.6 ★★★★☆",
  //     age: "12 Years and Up",
  //     language: "English",
  //     image:
  //       "https://m.media-amazon.com/images/I/617lxveUjYL._SY342_.jpg",
  //   },
  //   {
  //     id: 8,
  //     name: "A Nation of Idiots",
  //     price: 399,
  //     rating: "3.0 ★★★☆☆",
  //     age: "12 Years and Up",
  //     language: "English",
  //     image:
  //       "https://m.media-amazon.com/images/I/81KeOD++BBL._SY342_.jpg",
  //   },
  //   {
  //     id: 9,
  //     name: "Why I Am an Atheist",
  //     price: 104,
  //     rating: "4.6 ★★★★☆",
  //     age: "16 Years and Up",
  //     language: "English",
  //     image:
  //       "https://m.media-amazon.com/images/I/61MCDl9XbqL._SY342_.jpg",
  //   },
  //   {
  //     id: 10,
  //     name: "The Richest Man in Babylon",
  //     price: 88,
  //     rating: "3.5 ★★★☆☆",
  //     age: "12 Years and Up",
  //     language: "English",
  //     image:
  //       "https://m.media-amazon.com/images/I/71HX66uNvfL._SY342_.jpg",
  //   },
  //   {
  //     id: 11,
  //     name: "You Can",
  //     price: 93,
  //     rating: "4.4 ★★★★☆",
  //     age: "12 Years and Up",
  //     language: "English",
  //     image:
  //       "https://m.media-amazon.com/images/I/81T05w0B3lL._SY342_.jpg",
  //   },
  // ];
  useEffect(() => {
    console.log("Fetching product from backend...");
    const fetchProducts = async() =>{
      try{
        console.log("set the product backend to frontend");
        const resp = await axios.get("http://localhost:3000/products");
        console.log("products: ", resp.data);
        setProducts(resp.data.products);
      }catch(err){
        console.log(err);
      }
    };
    fetchProducts();
  },[])

  return (
    <>
      {/* Navbar */}
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />

      {/* Products Section */}
      <section className="bg-gray text-[#2B2118] px-5 py-8 min-h-screen">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

  {products.map((prod) => (

    <div key={prod._id} className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">

      {/* Wishlist Button */}
      <button onClick={() => dispatch(addToWishlist(prod)) } className="absolute top-3 right-3 z-10 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center text-xl hover:scale-110 transition">
          ♡
      </button>

      {/* Product Image */}
      <div className="bg-[#FFF8E7] p-5 flex justify-center">
        <img src={prod.Image} alt={prod.name} className="h-[280px] w-full object-contain group-hover:scale-105 transition-transform duration-300" />

      </div>

      {/* Product Details */}
      <div className="p-4">

        {/* Product Name */}
        <h2 className="font-bold text-lg text-[#5C3A21] line-clamp-2 min-h-[56px]">
          {prod.BookName}
        </h2>

        {/* Rating */}
        <p className="text-yellow-600 text-sm mt-2">
          ⭐ {prod.Rating}
        </p>

        {/* Price */}
        <p className="text-2xl font-bold text-[#5C3A21] mt-2">
          ₹{prod.Price}
        </p>

        {/* Extra Details */}
        <div className="text-sm text-gray-500 mt-2 space-y-1">
          <p>👤 {prod.Age}</p>
          <p>🌐 {prod.Language}</p>
        </div>

        {/* Add to Cart */}
        <button
          onClick={() => dispatch(addToCart(prod))}
          className="w-full mt-5 bg-[#D4A017] hover:bg-[#B8860B] text-white font-semibold py-2.5 rounded-lg transition duration-200 hover:scale-[1.02]"
        >
          🛒 Add to Cart
        </button>

      </div>

    </div>

  ))}

</div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Product;