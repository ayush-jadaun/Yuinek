// src/app/(shop)/cart/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import CartItem from "@/components/cart/CartItem";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

// Note: You can't export Metadata from a client component directly.
// You would set this in a parent layout or a separate `head.js` file if needed.
// For now, we'll focus on the component logic.

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(price);
};

export default function CartPage() {
  const { items, getTotalPrice } = useCartStore();
  // This state ensures the component only renders on the client, avoiding hydration mismatches.
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render a loading state or null on the server
    return (
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Loading Cart...
        </h1>
        <div className="mt-12 h-64 w-full animate-pulse rounded-lg bg-gray-200"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Your Shopping Cart is Empty
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Looks like you haven't added anything to your cart yet.
        </p>
        <div className="mt-6">
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Shopping Cart
      </h1>
      <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section aria-labelledby="cart-heading" className="lg:col-span-7">
          <h2 id="cart-heading" className="sr-only">
            Items in your shopping cart
          </h2>

          <ul
            role="list"
            className="divide-y divide-gray-200 border-t border-b border-gray-200"
          >
            {items.map((item, index) => (
              <CartItem
                key={`${item.productId}-${item.size}-${item.color}-${index}`}
                item={item}
              />
            ))}
          </ul>
        </section>

        {/* Order summary */}
        <section
          aria-labelledby="summary-heading"
          className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
        >
          <h2
            id="summary-heading"
            className="text-lg font-medium text-gray-900"
          >
            Order summary
          </h2>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">
                {formatPrice(getTotalPrice())}
              </dd>
            </div>
            {/* Add more details like shipping, taxes here if needed */}
          </dl>

          <div className="mt-6">
            <Button type="submit" className="w-full">
              Checkout
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
}
