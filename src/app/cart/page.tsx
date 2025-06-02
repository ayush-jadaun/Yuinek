"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Types for cart items
interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  type: string;
}

interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
  selectedVariant?: string;
}

const YELLOW = "bg-yellow-50";
const YELLOW_ACCENT = "bg-yellow-400";
const YELLOW_DARK = "text-yellow-800";
const YELLOW_LIGHT = "text-yellow-600";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null); // Replace with your auth/user logic

  // Replace with your user logic (for demo: localStorage or a hardcoded userId)
  useEffect(() => {
    // Demo: check for userId in localStorage or auth context
    const uid = localStorage.getItem("userId") || "665c3e2d7e30d2e8a4ad7b13";
    setUserId(uid);
  }, []);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/cart?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setCartItems(data.cartItems || []))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleRemove = async (cartItemId: string) => {
    await fetch(`/api/cart?id=${cartItemId}`, { method: "DELETE" });
    setCartItems((items) => items.filter((item) => item._id !== cartItemId));
  };

  const handleQtyChange = async (cartItemId: string, newQty: number) => {
    if (newQty < 1) return;
    await fetch(`/api/cart?id=${cartItemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity: newQty }),
      headers: { "Content-Type": "application/json" },
    });
    setCartItems((items) =>
      items.map((item) =>
        item._id === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  return (
    <main className={`${YELLOW} min-h-screen py-10 px-4`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-yellow-700 drop-shadow-lg">
          <span className="inline-block px-4 py-2 rounded bg-yellow-100">
            Your Cart
          </span>
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-40 text-yellow-700">
            Loading your cart...
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🛒</div>
            <div className="text-xl font-semibold text-yellow-500 mb-2">
              Your cart is empty!
            </div>
            <Link
              href="/products"
              className="mt-4 inline-block px-6 py-2 rounded bg-yellow-400 text-yellow-900 font-semibold hover:bg-yellow-500 transition"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left border-b border-yellow-200">
                    <th className="py-2">Product</th>
                    <th className="py-2">Type</th>
                    <th className="py-2">Variant</th>
                    <th className="py-2">Price</th>
                    <th className="py-2">Qty</th>
                    <th className="py-2">Total</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-yellow-100 hover:bg-yellow-50 group"
                    >
                      <td className="py-2 flex items-center gap-3">
                        <Image
                          src={
                            item.productId.images?.[0] || "/images/no-image.png"
                          }
                          width={60}
                          height={60}
                          alt={item.productId.name}
                          className="rounded object-cover border"
                        />
                        <Link
                          href={`/product/${item.productId._id}`}
                          className="font-semibold text-yellow-800 hover:underline"
                        >
                          {item.productId.name}
                        </Link>
                      </td>
                      <td className="py-2 capitalize">{item.productId.type}</td>
                      <td className="py-2">
                        {item.selectedVariant ? (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                            {item.selectedVariant}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="py-2 text-yellow-700 font-semibold">
                        ₹{item.productId.price}
                      </td>
                      <td className="py-2">
                        <div className="flex items-center gap-1">
                          <button
                            className="px-2 py-1 rounded bg-yellow-200 hover:bg-yellow-300 text-yellow-700"
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              handleQtyChange(item._id, item.quantity - 1)
                            }
                          >
                            -
                          </button>
                          <span className="px-2 min-w-[2ch] text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="px-2 py-1 rounded bg-yellow-200 hover:bg-yellow-300 text-yellow-700"
                            onClick={() =>
                              handleQtyChange(item._id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-2 font-bold text-yellow-900">
                        ₹{item.productId.price * item.quantity}
                      </td>
                      <td className="py-2">
                        <button
                          className="p-2 rounded-full hover:bg-yellow-200 transition"
                          aria-label="Remove"
                          onClick={() => handleRemove(item._id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-yellow-800"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cart Summary */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
              <div>
                <Link
                  href="/products"
                  className="inline-block px-4 py-2 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                >
                  &larr; Continue Shopping
                </Link>
              </div>
              <div className="text-xl font-bold text-yellow-800">
                Subtotal: <span className="text-yellow-600">₹{subtotal}</span>
              </div>
              <button
                className="px-6 py-2 rounded bg-yellow-400 text-yellow-900 font-bold hover:bg-yellow-500 transition shadow"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
