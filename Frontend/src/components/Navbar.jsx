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
  Gift,
  LogOut,
  ShoppingCart,
  Search,
  ShieldCheck,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [loginOpen, setLoginOpen] = useState(false);

  // =========================
  // Redux State
  // =========================
  const { user } = useSelector((state) => state.user);

  const cart = useSelector(
    (state) => state.cart?.items || []
  );

  const wishlist = useSelector(
    (state) => state.wishlist?.items || []
  );

  // =========================
  // Counts
  // =========================
  const cartCount = cart.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const wishlistCount = wishlist.length;

  // =========================
  // Admin Check
  // =========================
  const isAdmin =
    user?.role === "admin" ||
    user?.role === "Admin";

  // =========================
  // Logout
  // =========================
  const handleLogout = () => {
    setLoginOpen(false);

    dispatch(logout());

    localStorage.removeItem("token");

    navigate("/signin");
  };

  // =========================
  // Navigation
  // =========================
  const goTo = (path) => {
    setLoginOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* =====================================================
          MAIN NAVBAR
      ====================================================== */}
      <nav className="bg-[#5C3A21] text-[#FFF8E7] shadow-lg">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="flex items-center justify-between h-20">

            {/* =================================================
                LOGO
            ================================================== */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="text-3xl">
                📚
              </span>

              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-extrabold tracking-wide">
                  PaperHaven
                </span>

                <span className="text-[10px] sm:text-xs text-[#D4A017] tracking-widest">
                  BOOK STORE
                </span>
              </div>

              {/* Admin Badge */}
              {isAdmin && (
                <span className="hidden sm:inline-block ml-2 bg-[#D4A017] text-[#5C3A21] text-[10px] px-2 py-1 rounded-full font-bold uppercase">
                  Admin
                </span>
              )}
            </div>

            {/* =================================================
                MENU
            ================================================== */}
            <ul className="hidden lg:flex items-center gap-8 font-semibold">

              <li
                onClick={() => navigate("/")}
                className={`cursor-pointer transition ${
                  location.pathname === "/"
                    ? "text-[#D4A017]"
                    : "hover:text-[#D4A017]"
                }`}
              >
                Home
              </li>

              <li
                onClick={() => navigate("/")}
                className="cursor-pointer hover:text-[#D4A017] transition"
              >
                Products
              </li>

              <li
                className="cursor-pointer hover:text-[#D4A017] transition"
              >
                About
              </li>

              <li
                className="cursor-pointer hover:text-[#D4A017] transition"
              >
                Contact
              </li>

            </ul>

            {/* =================================================
                RIGHT SIDE
            ================================================== */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* =================================================
                  CART
              ================================================== */}
              <button
                onClick={() => navigate("/cart")}
                className="relative flex items-center gap-1 hover:bg-[#6E472B] px-3 py-2 rounded-lg transition"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />

                <span className="hidden sm:inline">
                  Cart
                </span>

                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D4A017] text-[#5C3A21] text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* =================================================
                  USER LOGIN DROPDOWN
              ================================================== */}
              <div className="relative">

                {/* Login / User Button */}
                <button
                  onClick={() => setLoginOpen(!loginOpen)}
                  className="flex items-center gap-2 bg-white text-[#2B2118] px-3 sm:px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  <User className="w-5 h-5" />

                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {user ? user.name : "Login"}
                  </span>

                  {loginOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* DROPDOWN */}
                {loginOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white text-[#2B2118] rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">

                    {/* USER HEADER */}
                    <div className="px-5 py-4 bg-[#FFF8E7] border-b border-gray-200">

                      {user ? (
                        <div>
                          <p className="text-sm text-gray-500">
                            Welcome back
                          </p>

                          <p className="font-bold text-lg">
                            {user.name}
                          </p>

                          {isAdmin && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-[#D4A017] font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Administrator
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">

                          <div>
                            <p className="text-sm text-gray-500">
                              New customer?
                            </p>

                            <p className="font-semibold">
                              Create your account
                            </p>
                          </div>

                          <button
                            onClick={() => goTo("/signup")}
                            className="text-[#5C3A21] font-bold hover:text-[#D4A017]"
                          >
                            Sign Up
                          </button>

                        </div>
                      )}

                    </div>

                    {/* =================================================
                        MY PROFILE
                    ================================================== */}
                    <button
                      onClick={() => goTo("/profile")}
                      className="w-full flex items-center gap-4 px-5 py-3 hover:bg-gray-100 transition text-left"
                    >
                      <UserRound className="w-5 h-5 text-gray-600" />

                      <span>
                        My Profile
                      </span>
                    </button>

                    {/* =================================================
                        ORDERS
                    ================================================== */}
                    <button
                      onClick={() => goTo("/orders")}
                      className="w-full flex items-center gap-4 px-5 py-3 hover:bg-gray-100 transition text-left"
                    >
                      <Package className="w-5 h-5 text-gray-600" />

                      <span>
                        My Orders
                      </span>
                    </button>

                    {/* =================================================
                        WISHLIST
                    ================================================== */}
                    <button
                      onClick={() => goTo("/wishlist")}
                      className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-100 transition text-left"
                    >

                      <div className="flex items-center gap-4">

                        <Heart className="w-5 h-5 text-gray-600" />

                        <span>
                          Wishlist
                        </span>

                      </div>

                      {wishlistCount > 0 && (
                        <span className="bg-[#D4A017] text-[#5C3A21] text-xs font-bold px-2 py-1 rounded-full">
                          {wishlistCount}
                        </span>
                      )}

                    </button>
                    
                    {/* =================================================
                        ADMIN DASHBOARD
                        ONLY ADMIN
                    ================================================== */}
                    {isAdmin && (
                      <button
                        onClick={() =>
                          goTo("/admin/products")
                        }
                        className="w-full flex items-center gap-4 px-5 py-3 bg-amber-50 hover:bg-amber-100 transition text-left border-t border-amber-200"
                      >
                        <ShieldCheck className="w-5 h-5 text-[#D4A017]" />

                        <span className="font-semibold text-[#5C3A21]">
                          Admin Dashboard
                        </span>
                      </button>
                    )}

                    {/* =================================================
                        SIGN IN FOR GUEST
                    ================================================== */}
                    {!user && (
                      <button
                        onClick={() => goTo("/signin")}
                        className="w-full flex items-center gap-4 px-5 py-3 hover:bg-[#FFF8E7] transition text-left border-t"
                      >
                        <User className="w-5 h-5 text-[#5C3A21]" />

                        <span className="font-semibold">
                          Sign In
                        </span>
                      </button>
                    )}

                    {/* =================================================
                        LOGOUT
                    ================================================== */}
                    {user && (
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-5 py-3 hover:bg-red-50 text-red-600 transition text-left border-t"
                      >
                        <LogOut className="w-5 h-5" />

                        <span>
                          Logout
                        </span>
                      </button>
                    )}

                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      </nav>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}
      <div className="bg-[#6E472B] text-[#FFF8E7]">

        <div className="max-w-7xl mx-auto px-4">

          <div className="flex justify-center items-center gap-6 sm:gap-8 py-3 flex-wrap text-sm font-medium">

            <button className="hover:text-[#D4A017] transition">
              Academics
            </button>

            <button className="hover:text-[#D4A017] transition">
              Fiction
            </button>

            <button className="hover:text-[#D4A017] transition">
              Non Fiction
            </button>

            <button className="hover:text-[#D4A017] transition">
              Children
            </button>

            <button className="hover:text-[#D4A017] transition">
              Young Adults
            </button>

            <button className="hover:text-[#D4A017] transition">
              Comics & Graphic Novels
            </button>

          </div>

        </div>
      </div>

      {/* =====================================================
          SEARCH BAR
      ====================================================== */}
      <div className="bg-[#FFF8E7] py-5">

        <div className="max-w-7xl mx-auto px-4">

          <div className="flex justify-center">

            <div className="flex w-full max-w-2xl">

              <input
                type="text"
                placeholder="Search books..."
                className="flex-1 px-4 py-3 border border-[#D6C6B8] rounded-l-lg outline-none focus:ring-2 focus:ring-[#D4A017] bg-white"
              />

              <button
                className="bg-[#D4A017] hover:bg-[#B8860B] px-6 rounded-r-lg text-white transition flex items-center justify-center"
              >
                <Search className="w-5 h-5" />
              </button>

            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;