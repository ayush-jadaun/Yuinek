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
  const [billingAddressId, setBillingAddressId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("stripe");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [userLoading, setUserLoading] = useState(true);
  const router = useRouter();

  // Fetch user data (including addresses) on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserLoading(true);
        const res = await fetch("/api/users/profile", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          if (data.user.addresses?.length > 0) {
            const defaultAddress = data.user.addresses[0]._id;
            setShippingAddressId(defaultAddress);
            setBillingAddressId(defaultAddress);
          }
        } else if (res.status === 401) {
          router.push("/auth/login?redirect=/checkout");
        } else {
          setError("Failed to load user data");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!userLoading && items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, userLoading, router]);

  const validateCheckout = () => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }

    if (!shippingAddressId) {
      setError("Please select a shipping address");
      return false;
    }

    if (!billingAddressId) {
      setError("Please select a billing address");
      return false;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return false;
    }

    // Validate cart items have required fields
    for (const item of items) {
      if (!item.productId || !item.sizeId || !item.colorId) {
        setError("Invalid cart items. Please refresh and try again.");
        return false;
      }
    }

    return true;
  };

  const handleCheckout = async () => {
    setError("");

    if (!validateCheckout()) {
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create an order in our database
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.productId,
          sizeId: item.sizeId,
          colorId: item.colorId,
          quantity: item.quantity,
        })),
        shippingAddressId,
        billingAddressId,
        payment_method: paymentMethod, // <-- Corrected key
      };

      console.log("Creating order with payload:", orderPayload);

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const orderData = await orderRes.json();

      // 2. Handle different payment methods
      if (paymentMethod === "cod") {
        // For Cash on Delivery, we don't need Stripe
        // Just clear cart and redirect to success page
        clearCart();
        router.push(`/order-confirmation/${orderData.order._id}?payment=cod`);
      } else {
        // For Stripe payment
        const stripeRes = await fetch("/api/payments/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            cartItems: items,
            orderId: orderData.order._id,
          }),
        });

        if (!stripeRes.ok) {
          const errorData = await stripeRes.json();
          throw new Error(
            errorData.error || "Failed to connect to payment provider"
          );
        }

        const stripeData = await stripeRes.json();

        // Clear the cart only after successful order creation and payment setup
        clearCart();

        // Redirect to Stripe
        window.location.href = stripeData.url;
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "An error occurred during checkout");
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="mb-4">Please log in to continue with checkout.</p>
          <Button onClick={() => router.push("/auth/login?redirect=/checkout")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Calculate COD fee (optional)
  const codFee = paymentMethod === "cod" ? 50 : 0; // ₱50 COD handling fee
  const finalTotal = getTotalPrice() + getTotalPrice() * 0.12 + 150 + codFee;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            {user.addresses && user.addresses.length > 0 ? (
              <select
                value={shippingAddressId}
                onChange={(e) => setShippingAddressId(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select shipping address</option>
                {user.addresses.map((addr: any) => (
                  <option key={addr._id} value={addr._id}>
                    {addr.address_line_1}, {addr.city}, {addr.state}{" "}
                    {addr.postal_code}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-center py-4">
                <p className="mb-4">
                  No addresses found. Please add one in your profile.
                </p>
                <Button onClick={() => router.push("/profile?tab=addresses")}>
                  Add Address
                </Button>
              </div>
            )}
          </div>

          {/* Billing Address */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={billingAddressId === shippingAddressId}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setBillingAddressId(shippingAddressId);
                    }
                  }}
                  className="mr-2"
                />
                Same as shipping address
              </label>
            </div>
            {user.addresses && user.addresses.length > 0 && (
              <select
                value={billingAddressId}
                onChange={(e) => setBillingAddressId(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select billing address</option>
                {user.addresses.map((addr: any) => (
                  <option key={addr._id} value={addr._id}>
                    {addr.address_line_1}, {addr.city}, {addr.state}{" "}
                    {addr.postal_code}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="radio"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3 mt-1"
                />
                <div>
                  <div className="font-medium">Credit/Debit Card</div>
                  <div className="text-sm text-gray-500">
                    Pay securely with your credit or debit card via Stripe
                  </div>
                </div>
              </label>

              <label className="flex items-start">
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3 mt-1"
                />
                <div>
                  <div className="font-medium">Cash on Delivery (COD)</div>
                  <div className="text-sm text-gray-500">
                    Pay with cash when your order is delivered
                    {codFee > 0 && (
                      <span className="text-orange-600 block">
                        Additional handling fee: ₱{codFee.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.sizeId}-${item.colorId}`}
                  className="flex justify-between py-1 text-sm"
                >
                  <span className="flex-1">
                    {item.name}
                    <span className="text-gray-500"> x{item.quantity}</span>
                  </span>
                  <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₱{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (12%)</span>
                <span>₱{(getTotalPrice() * 0.12).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₱150.00</span>
              </div>
              {codFee > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>COD Handling Fee</span>
                  <span>₱{codFee.toFixed(2)}</span>
                </div>
              )}
            </div>

            <hr className="my-4" />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₱{finalTotal.toFixed(2)}</span>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={
                isLoading ||
                items.length === 0 ||
                !shippingAddressId ||
                !billingAddressId
              }
              className="w-full mt-6"
            >
              {isLoading
                ? "Processing..."
                : paymentMethod === "cod"
                ? "Place Order (COD)"
                : "Proceed to Payment"}
            </Button>

            {paymentMethod === "cod" && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Please have the exact amount ready when
                  your order arrives.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
