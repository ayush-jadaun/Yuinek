"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
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

export default function OrderConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const paymentType = searchParams.get("payment");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    if (orderId) {
      fetchOrder();
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
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            {paymentType === "cod"
              ? "Your order has been placed successfully. Please have the payment ready upon delivery."
              : "Thank you for your purchase! Your order has been confirmed."}
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

        {paymentType === "cod" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">
              Cash on Delivery Instructions:
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>
                • Please have the exact amount (₱{order.total_amount.toFixed(2)}
                ) ready
              </li>
              <li>• Our delivery partner will contact you before delivery</li>
              <li>• Payment is due upon receipt of your order</li>
              <li>• Please inspect your items before payment</li>
            </ul>
          </div>
        )}

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
