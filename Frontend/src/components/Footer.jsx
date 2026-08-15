import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#5C3A21] text-[#FFF8E7]">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-3">
            PaperHaven
          </h2>

          <p className="text-sm leading-6 text-[#F5E6C8]">
            Discover your next great read with PaperHaven.
            Explore books from every genre and bring stories
            into your life.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-3">
            Quick Links
          </h3>

          <ul className="space-y-2 text-sm">
            <li className="hover:text-yellow-300 cursor-pointer">
              Home
            </li>

            <li className="hover:text-yellow-300 cursor-pointer">
              Products
            </li>

            <li className="hover:text-yellow-300 cursor-pointer">
              About Us
            </li>

            <li className="hover:text-yellow-300 cursor-pointer">
              Contact
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-bold mb-3">
            Categories
          </h3>

          <ul className="space-y-2 text-sm">
            <li>📘 Fiction</li>
            <li>📚 Non Fiction</li>
            <li>📖 Academics</li>
            <li>🧒 Children</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-bold mb-3">
            Contact Us
          </h3>

          <p className="text-sm mb-2">
            📧 support@paperhaven.com
          </p>

          <p className="text-sm mb-2">
            📞 +91 98765 43210
          </p>

          <p className="text-sm">
            📍 Tamil Nadu, India
          </p>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#806040] text-center py-4">

        <p className="text-sm">
          © 2026 PaperHaven. All Rights Reserved.
        </p>

        <p className="text-xs mt-1 text-[#F5E6C8]">
          Made with ❤️ for Book Lovers
        </p>

      </div>

    </footer>
  );
};

export default Footer;