"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// Types for order and populated fields
interface Address {
  _id: string;
  line1?: string;
  city?: string;
  country?: string;
  [key: string]: any;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images?: string[];
}

interface OrderItem {
  _id: string;
  productId: Product;
  quantity: number;
  [key: string]: any;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  placedAt: string;
  shippingAddressId: Address;
  [key: string]: any;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null); // Replace with your user logic

  useEffect(() => {
    // Replace with user auth logic
    const uid = localStorage.getItem("userId") || "665c3e2d7e30d2e8a4ad7b13";
    setUserId(uid);
  }, []);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/order?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <main className="min-h-screen py-10 px-4 bg-yellow-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-yellow-700 drop-shadow-lg">
          <span className="inline-block px-4 py-2 rounded bg-yellow-100">
            Your Orders
          </span>
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-40 text-yellow-700">
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📦</div>
            <div className="text-xl font-semibold text-yellow-500 mb-2">
              No orders yet!
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
                    <th className="py-2">Order #</th>
                    <th className="py-2">Placed</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Payment</th>
                    <th className="py-2">Total</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-yellow-100 group hover:bg-yellow-50"
                    >
                      <td className="py-2 font-mono text-yellow-800">
                        {order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-2">
                        {order.placedAt
                          ? new Date(order.placedAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-2 capitalize">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2 capitalize">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            order.paymentStatus === "success"
                              ? "bg-green-100 text-green-700"
                              : order.paymentStatus === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-2 font-bold text-yellow-900">
                        ₹{order.totalAmount}
                      </td>
                      <td className="py-2">
                        <Link
                          href={`/order/${order._id}`}
                          className="px-3 py-1 rounded bg-yellow-200 text-yellow-900 font-medium hover:bg-yellow-300 transition"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
