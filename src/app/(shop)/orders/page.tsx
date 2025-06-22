"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface Order {
  _id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  payment_method: string;
  createdAt: string;
  items: Array<{
    product_name: string;
    quantity: number;
    total_price: number;
  }>;
}

export default function OrdersListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        } else {
          setError("Failed to fetch orders.");
        }
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading your orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="mb-4">{error}</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Orders Found</h1>
          <p className="mb-4">You haven't placed any orders yet.</p>
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>
        <div className="space-y-6">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition border cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="font-semibold text-lg">
                      Order #{order.order_number}
                    </div>
                    <div className="text-sm text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-indigo-700">
                      ₱{order.total_amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {order.payment_method === "cod"
                        ? "Cash on Delivery"
                        : "Card Payment"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm mt-2">
                  <span
                    className={`px-2 py-1 rounded-full capitalize ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full capitalize ${
                      order.payment_status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                  <span className="ml-auto">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
