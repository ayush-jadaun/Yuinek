"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import CartItem from "../cart/CartItem";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

// This component will run on the client and attempt to re-authenticate the user
// if they have a valid refresh token. This keeps the user logged in across sessions.
const AuthInitializer = () => {
  const { user, setUser, setLoading } = useAuthStore();


  useEffect(() => {
    const initializeAuth = async () => {
      // If user is already set, or we've already tried, do nothing.
      if (user) {
        setLoading(false);
        return;
      }

      try {
        // Attempt to get a new access token using the refresh token
        const res = await fetch("/api/auth/refresh-token", {
          method: "POST",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // If refresh fails, ensure user is logged out
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
    };

    initializeAuth();
  }, [user, setUser, setLoading]);

  return null; // This component doesn't render anything
};

export default function Header() {
  const { isAuthenticated, user, logout, isLoading } = useAuthStore();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      logout(); // Clear state from Zustand store
      router.push("/");
      router.refresh();
    }
  };

  const isAdmin = user?.user_type === "admin";

  return (
    <>
      <AuthInitializer />
      <header className="border-b border-white/10 sticky top-0 z-50 backdrop-blur-sm bg-white/5">
        <nav
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  ShoeStore
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/products"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Categories
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                About
              </Link>
            </div>

            {/* Search Bar (Desktop) */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex items-center flex-1 max-w-lg mx-8"
            >
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-white/20 rounded-full bg-white/10 backdrop-blur-sm focus:bg-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 text-gray-700 placeholder:text-gray-500"
                />
              </div>
            </form>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Cart & Wishlist */}
              <div className="flex items-center space-x-3">
                <Link
                  href="/wishlist"
                  className="p-2 text-gray-700 hover:text-red-500 transition-colors duration-200 relative"
                >
                  <HeartIcon className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                </Link>
                <Link
                  href="/cart"
                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 relative"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                </Link>
              </div>

              {/* Auth Section */}
              <div className="flex items-center">
                {isLoading ? (
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                ) : isAuthenticated && user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.first_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden sm:block font-medium text-sm">
                        {user.first_name}
                      </span>
                      <ChevronDownIcon className="h-4 w-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 py-1 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          {isAdmin && (
                            <span className="inline-flex mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              Admin
                            </span>
                          )}
                        </div>

                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <UserIcon className="h-4 w-4 mr-3" />
                          My Profile
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <Cog6ToothIcon className="h-4 w-4 mr-3" />
                            Admin Dashboard
                          </Link>
                        )}

                        <div className="border-t border-gray-100 mt-1">
                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              handleLogout();
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                          >
                            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/login"
                      className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-md"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 py-4 bg-white/5 backdrop-blur-sm">
              <div className="space-y-3">
                <Link
                  href="/products"
                  className="block text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/categories"
                  className="block text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  href="/about"
                  className="block text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>

                {/* Mobile Search */}
                <div className="pt-3 border-t border-white/10">
                  <form
                    onSubmit={handleSearch}
                    className="pt-3 border-t border-white/10"
                  >
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-white/20 rounded-full bg-white/10 backdrop-blur-sm focus:bg-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 placeholder:text-gray-500"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
