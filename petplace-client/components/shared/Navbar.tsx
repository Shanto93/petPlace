"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Dog,
  LogOut,
  Menu,
  PackageSearch,
  PlusCircle,
  User,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 1. Define Public Routes (Visible to Everyone)
  const publicRoutes = [
    { name: "Home", path: "/" },
    { name: "Shop All", path: "/items" },
    { name: "Categories", path: "/categories" },
    { name: "About Us", path: "/about" },
  ];

  // 2. Define Protected Routes (Visible ONLY when Logged In)
  const protectedRoutes = [
    { name: "My Orders", path: "/orders" },
    // Add any other routes that only logged-in users should see here
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b-2 border-primary-sky/30 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary-sky rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Dog className="text-white" size={24} />
            </div>
            <span className="text-2xl font-extrabold text-text-charcoal tracking-tight">
              Pet<span className="text-primary-sky">Palace</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 font-semibold text-gray-600">
            {/* Always map through the 4 public routes */}
            {publicRoutes.map((route) => (
              <Link
                key={route.name}
                href={route.path}
                className="hover:text-primary-sky transition-colors"
              >
                {route.name}
              </Link>
            ))}

            {/* Conditionally map through protected routes if logged in */}
            {session &&
              protectedRoutes.map((route) => (
                <Link
                  key={route.name}
                  href={route.path}
                  className="text-primary-sky hover:text-text-charcoal transition-colors"
                >
                  {route.name}
                </Link>
              ))}

            {/* Auth Section / User Dropdown */}
            {!session ? (
              <Link
                href="/login"
                className="btn-primary ml-4 flex items-center gap-2 text-sm px-6 py-2.5"
              >
                <User size={18} />
                Login / Register
              </Link>
            ) : (
              <div className="relative ml-2">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-bg-cream border-2 border-primary-sky px-4 py-2 rounded-full text-text-charcoal hover:bg-primary-sky/10 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-secondary-sun flex items-center justify-center text-xs font-bold text-text-charcoal shadow-sm">
                    {session.user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[100px] truncate text-sm">
                    {session.user?.email?.split("@")[0] || "User"}
                  </span>
                </button>

                {/* Dropdown Menu with Add/Manage/Logout */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-56 bg-white border-2 border-primary-sky/30 rounded-2xl shadow-xl overflow-hidden flex flex-col"
                    >
                      <Link
                        href="/items/add"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-bg-cream transition-colors border-b border-gray-100 font-medium"
                      >
                        <PlusCircle size={18} className="text-primary-sky" />{" "}
                        Add Product
                      </Link>
                      <Link
                        href="/items/manage"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-bg-cream transition-colors border-b border-gray-100 font-medium"
                      >
                        <PackageSearch size={18} className="text-primary-sky" />{" "}
                        Manage Products
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-500 text-left font-bold"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-charcoal focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-lg"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {publicRoutes.map((route) => (
                <Link
                  key={route.name}
                  href={route.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-semibold text-gray-600"
                >
                  {route.name}
                </Link>
              ))}

              {session ? (
                <>
                  {protectedRoutes.map((route) => (
                    <Link
                      key={route.name}
                      href={route.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="font-semibold text-primary-sky"
                    >
                      {route.name}
                    </Link>
                  ))}
                  <hr className="border-gray-100" />
                  <Link
                    href="/items/add"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 font-semibold text-text-charcoal"
                  >
                    <PlusCircle size={18} className="text-primary-sky" /> Add
                    Product
                  </Link>
                  <Link
                    href="/items/manage"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 font-semibold text-text-charcoal"
                  >
                    <PackageSearch size={18} className="text-primary-sky" />{" "}
                    Manage Products
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex items-center gap-2 font-bold text-red-500 mt-2"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary text-center w-full mt-2"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
