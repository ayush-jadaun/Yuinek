// src/app/(shop)/checkout/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { IUser } from "@/models/User";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [user, setUser] = useState<IUser | null>(null);
  const [shippingAddressId, setShippingAddressId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Fetch user data (including addresses) on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      // In a real app, you'd have an API route like /api/users/me
      // For now, we'll re-use the refresh-token logic as a placeholder
      const res = await fetch("/api/auth/refresh-token", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        // Set default selected address
        if (data.user.addresses?.length > 0) {
          setShippingAddressId(data.user.addresses[0]._id);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleCheckout = async () => {
    setIsLoading(true);
    // 1. Create an order in our database
    const orderRes = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ ...i, sizeId: i.size, colorId: i.color })), // Simplification for demo
        shippingAddressId: shippingAddressId,
        billingAddressId: shippingAddressId, // Assuming same as shipping
        paymentMethod: "stripe",
      }),
    });

    if (!orderRes.ok) {
      alert("Failed to create order.");
      setIsLoading(false);
      return;
    }
    const orderData = await orderRes.json();

    // 2. Create a Stripe session for the order
    const stripeRes = await fetch("/api/payments/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems: items, orderId: orderData.order._id }),
    });

    if (!stripeRes.ok) {
      alert("Failed to connect to payment provider.");
      setIsLoading(false);
      return;
    }

    const stripeData = await stripeRes.json();
    clearCart(); // Clear the cart before redirecting
    router.push(stripeData.url); // Redirect to Stripe
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            {user?.addresses && user.addresses.length > 0 ? (
              <select
                value={shippingAddressId}
                onChange={(e) => setShippingAddressId(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {user.addresses.map((addr: any) => (
                  <option key={addr._id} value={addr._id}>
                    {addr.address_line_1}, {addr.city}, {addr.postal_code}
                  </option>
                ))}
              </select>
            ) : (
              <p>No addresses found. Please add one in your profile.</p>
            )}
          </div>
        </div>
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <ul>
              {items.map((item) => (
                <li key={item.productId} className="flex justify-between py-1">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <hr className="my-4" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₱{getTotalPrice().toFixed(2)}</span>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={isLoading || items.length === 0}
              className="w-full mt-6"
            >
              {isLoading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
