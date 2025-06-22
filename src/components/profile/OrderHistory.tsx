"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface Order {
  _id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  createdAt: string;
  items: Array<{
    product_name: string;
    quantity: number;
  }>;
}

export default function OrderHistory() {
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
          setOrders(data.orders);
        } else {
          setError("Failed to load orders");
        }
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Order History</h2>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No orders found</p>
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">Order #{order.order_number}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ₱{order.total_amount.toFixed(2)}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-3">
                {order.items.length} item(s):{" "}
                {order.items
                  .map((item) => `${item.product_name} (${item.quantity})`)
                  .join(", ")}
              </div>

              <Link href={`/orders/${order._id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
