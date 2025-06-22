"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface Order {
  _id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  payment_method: string;
  items: Array<{
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  shipping_address: any;
  createdAt: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params?.orderId as string | undefined;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return; // Wait for orderId to be available

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setOrder(data.order);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // If after hydration there is STILL no orderId, show error
  useEffect(() => {
    if (typeof window !== "undefined" && !orderId) {
      setLoading(false);
      setError("Missing order ID in URL.");
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="mb-4">{error || "Order not found"}</p>
          <Link href="/orders">
            <Button>View My Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Details
          </h1>
          <p className="text-gray-600">
            Order <span className="font-mono">#{order.order_number}</span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">
                  Order #{order.order_number}
                </h2>
                <p className="text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  ₱{order.total_amount.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {order.payment_method === "cod"
                    ? "Cash on Delivery"
                    : "Card Payment"}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between py-2">
                  <span>
                    {item.product_name} x {item.quantity}
                  </span>
                  <span>₱{item.total_price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3">Shipping Address</h3>
            <div className="text-gray-700 text-sm">
              {order.shipping_address?.address_line_1},{" "}
              {order.shipping_address?.city}, {order.shipping_address?.state}{" "}
              {order.shipping_address?.postal_code}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Status:</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm capitalize">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="font-semibold">Payment Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm capitalize ${
                  order.payment_status === "paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.payment_status}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center space-x-4">
          <Link href="/orders">
            <Button variant="outline">View All Orders</Button>
          </Link>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
