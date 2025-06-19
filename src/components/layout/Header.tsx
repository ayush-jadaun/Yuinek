// src/components/layout/Header.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

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

  return (
    <>
      <AuthInitializer />
      <header className="bg-white shadow-sm">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-xl font-bold tracking-tight">
                ShoeStore
              </span>
            </Link>
          </div>
          {/* Other nav links like Products, Categories can go here */}
          <div className="flex items-center gap-x-6">
            <Link
              href="/cart"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cart
            </Link>
            <Link
              href="/wishlist"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Wishlist
            </Link>
          </div>
          <div className="flex flex-1 justify-end items-center gap-x-4">
            {isLoading ? (
              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-md"></div>
            ) : isAuthenticated && user ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {user.first_name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
