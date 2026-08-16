import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";

import {
  User,
  ChevronDown,
  ChevronUp,
  UserRound,
  Package,
  Heart,
  LogOut,
  ShoppingCart,
  Search,
  ShieldCheck,
  X,
  Sparkles,
} from "lucide-react";

const Navbar = ({
  searchTerm = "",
  setSearchTerm = null,
  selectedCategory = "All",
  setSelectedCategory = null,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [loginOpen, setLoginOpen] = useState(false);

  // Redux State
  const { user } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart?.items || []);
  const wishlist = useSelector((state) => state.wishlist?.items || []);

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const wishlistCount = wishlist.length;

  const isAdmin = user?.role === "admin" || user?.role === "Admin";

  const handleLogout = () => {
    setLoginOpen(false);
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const goTo = (path) => {
    setLoginOpen(false);
    navigate(path);
  };

  const handleCategoryClick = (catName) => {
    if (setSelectedCategory) {
      setSelectedCategory(catName);
    } else {
      navigate("/", { state: { category: catName } });
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (setSearchTerm) {
      setSearchTerm(val);
    } else {
      navigate("/", { state: { search: val } });
    }
  };

  const categories = [
    { name: "All", label: "✨ All Books" },
    { name: "Academics", label: "📖 Academics" },
    { name: "Fiction", label: "📘 Fiction" },
    { name: "Non Fiction", label: "📚 Non Fiction" },
    { name: "Children", label: "🧒 Children" },
    { name: "Young Adults", label: "🎨 Young Adults" },
    { name: "Comics & Graphic Novels", label: "💥 Comics" },
  ];

  return (
    <>
      {/* Top Banner Announcement */}
      <div className="bg-[#3E2615] text-[#F3EFEA] text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#D4A017] animate-pulse" />
        <span>Free Shipping on Orders Over ₹499 | Instant Delivery across India</span>
      </div>

      {/* Main Glass Navbar */}
      <nav className="glass-nav text-[#FFF8E7] sticky top-0 z-50 border-b border-[#7A4E2F]/40 shadow-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20 gap-4">

            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-11 h-11 bg-gradient-to-tr from-[#D4A017] to-[#B8860B] rounded-2xl flex items-center justify-center shadow-lg shadow-[#D4A017]/20 group-hover:scale-105 transition duration-300">
                <span className="text-2xl">📚</span>
              </div>

              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tight font-serif text-[#FFF8E7] group-hover:text-[#D4A017] transition duration-300">
                  PaperHaven
                </span>
                <span className="text-[10px] text-[#D4A017] font-bold tracking-widest uppercase">
                  LITERARY HEAVEN
                </span>
              </div>

              {isAdmin && (
                <span className="hidden sm:inline-block ml-1 bg-[#D4A017] text-[#3E2615] text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase shadow-sm">
                  Admin
                </span>
              )}
            </div>

            {/* Desktop Quick Nav */}
            <ul className="hidden md:flex items-center gap-8 font-semibold text-sm">
              <li
                onClick={() => navigate("/")}
                className={`cursor-pointer transition-colors duration-200 ${
                  location.pathname === "/"
                    ? "text-[#D4A017] font-bold"
                    : "hover:text-[#D4A017]"
                }`}
              >
                Home
              </li>

              <li
                onClick={() => navigate("/")}
                className="cursor-pointer hover:text-[#D4A017] transition-colors duration-200"
              >
                Explore Books
              </li>

              {user && (
                <li
                  onClick={() => navigate("/orders")}
                  className={`cursor-pointer transition-colors duration-200 ${
                    location.pathname === "/orders"
                      ? "text-[#D4A017] font-bold"
                      : "hover:text-[#D4A017]"
                  }`}
                >
                  My Orders
                </li>
              )}
            </ul>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Wishlist Icon */}
              <button
                onClick={() => navigate("/wishlist")}
                className="relative flex items-center gap-1.5 hover:bg-[#7A4E2F]/60 px-3 py-2 rounded-xl transition duration-200"
                title="My Wishlist"
              >
                <Heart className="w-5 h-5 text-[#F3EFEA] hover:text-red-400 transition" />
                <span className="hidden lg:inline text-sm font-semibold">
                  Wishlist
                </span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-md animate-bounce">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Shopping Cart Button */}
              <button
                onClick={() => navigate("/cart")}
                className="relative flex items-center gap-2 bg-[#D4A017] hover:bg-[#B8860B] text-[#2C1810] font-bold px-3.5 py-2 rounded-xl shadow-lg shadow-[#D4A017]/20 transition transform hover:scale-[1.03]"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">
                  Cart
                </span>
                {cartCount > 0 && (
                  <span className="bg-[#2C1810] text-[#D4A017] text-xs font-black min-w-[20px] h-[20px] px-1 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setLoginOpen(!loginOpen)}
                  className="flex items-center gap-2 bg-[#FFF8E7] text-[#2C1810] px-3 sm:px-4 py-2 rounded-xl font-bold hover:bg-white transition duration-200 shadow-sm"
                >
                  <User className="w-5 h-5 text-[#5C3A21]" />
                  <span className="hidden sm:inline max-w-[90px] truncate text-sm">
                    {user ? user.name : "Account"}
                  </span>
                  {loginOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {loginOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white text-[#2C1810] rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-toast">
                    {/* Header */}
                    <div className="px-5 py-4 bg-[#FFF8E7] border-b border-amber-100">
                      {user ? (
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Logged in as</p>
                          <p className="font-bold text-base text-[#5C3A21] truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          {isAdmin && (
                            <div className="flex items-center gap-1 mt-1 text-[11px] text-[#B8860B] font-extrabold uppercase">
                              <ShieldCheck className="w-3.5 h-3.5" /> Administrator
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Welcome to PaperHaven</p>
                            <p className="font-bold text-sm text-[#5C3A21]">Get Started</p>
                          </div>
                          <button
                            onClick={() => goTo("/signup")}
                            className="bg-[#5C3A21] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#3E2615] transition"
                          >
                            Sign Up
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Menu Links */}
                    {user && (
                      <button
                        onClick={() => goTo("/profile")}
                        className="w-full flex items-center gap-3.5 px-5 py-3 hover:bg-slate-50 transition text-left text-sm font-semibold"
                      >
                        <UserRound className="w-4 h-4 text-[#5C3A21]" /> My Profile
                      </button>
                    )}

                    <button
                      onClick={() => goTo("/orders")}
                      className="w-full flex items-center gap-3.5 px-5 py-3 hover:bg-slate-50 transition text-left text-sm font-semibold"
                    >
                      <Package className="w-4 h-4 text-[#5C3A21]" /> My Orders
                    </button>

                    <button
                      onClick={() => goTo("/wishlist")}
                      className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition text-left text-sm font-semibold"
                    >
                      <div className="flex items-center gap-3.5">
                        <Heart className="w-4 h-4 text-[#5C3A21]" /> Wishlist
                      </div>
                      {wishlistCount > 0 && (
                        <span className="bg-[#D4A017] text-[#2C1810] text-xs font-bold px-2 py-0.5 rounded-full">
                          {wishlistCount}
                        </span>
                      )}
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => goTo("/admin/products")}
                        className="w-full flex items-center gap-3.5 px-5 py-3 bg-amber-50 hover:bg-amber-100 transition text-left text-sm font-bold border-t border-amber-200 text-[#5C3A21]"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#D4A017]" /> Admin Product Dashboard
                      </button>
                    )}

                    {!user ? (
                      <button
                        onClick={() => goTo("/signin")}
                        className="w-full flex items-center gap-3.5 px-5 py-3 hover:bg-[#FFF8E7] transition text-left text-sm font-bold border-t text-[#5C3A21]"
                      >
                        <User className="w-4 h-4 text-[#5C3A21]" /> Sign In
                      </button>
                    ) : (
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3.5 px-5 py-3 hover:bg-red-50 text-red-600 transition text-left text-sm font-bold border-t border-slate-100"
                      >
                        <LogOut className="w-4 h-4" /> Log Out
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Live Search & Real-Time Filter Bar */}
      <div className="bg-[#FFF8E7] border-b border-[#E8DCCB] py-4 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Live Search Input */}
          <div className="flex justify-center mb-3">
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                placeholder="⚡ Live Search by book name, author, language..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-10 py-3 bg-white border-2 border-[#D6C6B8] focus:border-[#D4A017] rounded-2xl outline-none shadow-sm text-sm text-[#2C1810] font-medium transition duration-200 placeholder:text-gray-400"
              />
              <Search className="w-5 h-5 text-[#8C6D53] absolute left-4 top-3.5 pointer-events-none" />
              
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm && setSearchTerm("")}
                  className="absolute right-3.5 top-3.5 p-0.5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition"
                  title="Clear Search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Real-Time Interactive Category Tabs */}
          <div className="flex items-center justify-center gap-2 py-1 flex-wrap overflow-x-auto">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-[#5C3A21] text-[#FFF8E7] shadow-md shadow-[#5C3A21]/30 scale-105"
                      : "bg-white/80 hover:bg-white text-[#5C3A21] border border-[#E8DCCB] hover:border-[#5C3A21]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;