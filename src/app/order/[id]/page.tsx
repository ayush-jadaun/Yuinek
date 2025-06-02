"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

// Types for order and related fields
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
  trackingId?: string;
  courier?: string;
  estimatedDelivery?: string;
  [key: string]: any;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    fetch(`/api/order?id=${orderId}`)
      .then((res) => res.json())
      .then((data) => setOrder(data.order || null))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-yellow-700">Loading order details...</div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center text-yellow-700">
          <div className="text-6xl mb-4">❓</div>
          <div className="text-xl mb-2">Order not found</div>
          <Link
            href="/order"
            className="inline-block px-6 py-2 mt-4 rounded bg-yellow-400 text-yellow-900 font-semibold hover:bg-yellow-500 transition"
          >
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-10 px-4 bg-yellow-50">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-yellow-800">
            Order # {order._id.slice(-6).toUpperCase()}
          </h1>
          <Link
            href="/order"
            className="text-yellow-600 hover:text-yellow-800 hover:underline"
          >
            &larr; All Orders
          </Link>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-4">
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
            <span className="px-2 py-1 rounded text-xs bg-yellow-50 text-yellow-900">
              Placed:{" "}
              {order.placedAt ? new Date(order.placedAt).toLocaleString() : "-"}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="font-semibold text-yellow-800 mb-1">
            Delivery Address:
          </div>
          <div className="text-gray-700 text-sm">
            {order.shippingAddressId?.line1 || ""}
            {order.shippingAddressId?.city
              ? `, ${order.shippingAddressId.city}`
              : ""}
            {order.shippingAddressId?.country
              ? `, ${order.shippingAddressId.country}`
              : ""}
          </div>
        </div>

        {order.trackingId && (
          <div className="mb-4">
            <div className="font-semibold text-yellow-800 mb-1">
              Tracking Info:
            </div>
            <div className="text-gray-700 text-sm">
              Courier: {order.courier || "-"}
              <br />
              Tracking ID: {order.trackingId}
              {order.estimatedDelivery && (
                <>
                  <br />
                  Estimated Delivery:{" "}
                  {new Date(order.estimatedDelivery).toLocaleDateString()}
                </>
              )}
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="font-semibold text-yellow-800 mb-2">Order Items:</div>
          <div>
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 py-2 border-b border-yellow-100 last:border-b-0"
              >
                <Image
                  src={item.productId?.images?.[0] || "/images/no-image.png"}
                  width={64}
                  height={64}
                  alt={item.productId?.name || "Product"}
                  className="rounded object-cover border"
                />
                <div className="flex-1">
                  <div className="font-semibold text-yellow-900">
                    {item.productId?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    Product ID: {item.productId?._id}
                  </div>
                  <div className="text-sm mt-1">
                    Quantity:{" "}
                    <span className="font-medium">{item.quantity}</span>
                  </div>
                </div>
                <div className="text-yellow-700 font-bold">
                  ₹{item.productId?.price} x {item.quantity} = ₹
                  {item.productId?.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end items-center gap-4">
          <div className="text-xl font-bold text-yellow-800">
            Total: <span className="text-yellow-600">₹{order.totalAmount}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
