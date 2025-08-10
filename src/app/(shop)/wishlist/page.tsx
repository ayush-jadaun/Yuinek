// src/app/(shop)/wishlist/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlistStore";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/product/ProductCard";
import { IProduct } from "@/models/Product";
import mongoose from "mongoose";

// Empty heart SVG component for wishlist
const EmptyHeartIcon = () => (
  <svg
    className="mx-auto h-32 w-32 text-gray-300"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.3" />
  </svg>
);

// Wishlist stats component
const WishlistStats = ({ itemCount }: { itemCount: number }) => (
  <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-6 mb-8">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Your Wishlist Collection
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {itemCount} {itemCount === 1 ? "item" : "items"} saved for later
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-2xl font-bold text-pink-600">{itemCount}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Favorites
          </div>
        </div>
        <svg
          className="h-10 w-10 text-pink-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  </div>
);

// Quick actions component
const QuickActions = () => (
  <div className="bg-gray-50 rounded-lg p-4 mb-8">
    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
      <Link href="/products?sort=newest">
        <Button variant="outline" size="sm">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          New Arrivals
        </Button>
      </Link>
      <Link href="/products?discount=true">
        <Button variant="outline" size="sm">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          On Sale
        </Button>
      </Link>
      <Link href="/categories">
        <Button variant="outline" size="sm">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Browse Categories
        </Button>
      </Link>
    </div>
  </div>
);

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();
  const [isClient, setIsClient] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClearWishlist = () => {
    clearWishlist();
    setShowClearConfirm(false);
  };

  if (!isClient) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Loading Wishlist...
        </h1>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-80 w-full animate-pulse rounded-lg bg-gray-200"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="text-center">
          {/* Empty heart illustration */}
          <div className="mb-8">
            <EmptyHeartIcon />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Your wishlist is waiting!
          </h1>

          <p className="text-lg text-gray-600 mb-2">
            Save your favorite items and never lose track of what you love.
          </p>

          <p className="text-base text-gray-500 mb-8">
            Tap the heart icon on any product to add it to your wishlist.
          </p>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center mb-12">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Discover Products
              </Button>
            </Link>

            <Link href="/collections/trending">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                Trending Now
              </Button>
            </Link>
          </div>

          <QuickActions />

          {/* How it works section */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-8 mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              How to use your wishlist
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-pink-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Browse &amp; Heart
                </h4>
                <p className="text-gray-600">
                  Tap the heart icon on products you love
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Save &amp; Track
                </h4>
                <p className="text-gray-600">
                  Items are saved here for easy access
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
                    />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Shop Later</h4>
                <p className="text-gray-600">
                  Add to cart when you&apos;re ready to buy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Map wishlist items to proper IProduct format for ProductCard
  const productsForGrid: IProduct[] = items.map((item) => ({
    _id: item.productId,
    name: item.name,
    product_code: 0, // You might want to store this in wishlist or fetch from API
    category_id: new mongoose.Types.ObjectId(), // You might want to store this in wishlist or fetch from API
    description: "", // You might want to store this in wishlist or fetch from API
    slug: item.slug,
    base_price: item.price,
    sale_price: undefined,
    cost_price: undefined,
    weight: undefined,
    is_featured: false,
    is_active: true,
    stock_status: "in_stock" as const,
    manage_stock: true,
    stock_quantity: 0,
    low_stock_threshold: 5,
    images: [
      {
        image_url: item.image,
        is_primary: true,
        alt_text: item.name,
      },
    ],
    variants: [],
    meta_title: undefined,
    meta_description: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  return (
    <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4 sm:mb-0">
          My Wishlist
        </h1>

        {items.length > 0 && (
          <div className="flex space-x-3">
            <Link href="/products">
              <Button variant="outline" size="sm">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add More
              </Button>
            </Link>

            {showClearConfirm ? (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleClearWishlist}
                >
                  Confirm Clear
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearConfirm(true)}
                className="text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Clear All
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Wishlist stats */}
      <WishlistStats itemCount={items.length} />

      {/* Quick actions */}
      <QuickActions />

      {/* Products grid */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {productsForGrid.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Footer message */}
      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500 mb-4">
          Found something you love? Add it to your cart to complete your
          purchase.
        </p>
        <div className="flex justify-center space-x-6 text-sm">
          <Link
            href="/account/orders"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Order History
          </Link>
          <Link
            href="/cart"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            View Cart
          </Link>
          <Link
            href="/help"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Need Help?
          </Link>
        </div>
      </div>
    </div>
  );
}
