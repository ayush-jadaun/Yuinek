"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import CartItem from "@/components/cart/CartItem";
import { Button } from "@/components/ui/Button";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-PH", {
    // Fixed: PHP should be PH for Philippines
    style: "currency",
    currency: "PHP",
  }).format(price);
};

export default function CartPage() {
  const { items, getTotalPrice } = useCartStore();
  const router = useRouter();
  // This state ensures the component only renders on the client, avoiding hydration mismatches.
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCheckout = () => {
    // Navigate to checkout page
    router.push("/checkout");
  };

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
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
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
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Shopping Cart
      </h1>

      {/* Removed the form wrapper since we don't need form submission */}
      <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
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
                key={`${item.productId}-${item.sizeId}-${item.colorId}-${index}`}
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
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Shipping</dt>
              <dd className="text-sm font-medium text-gray-900">
                {formatPrice(150)} {/* Fixed shipping rate */}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Tax (12%)</dt>
              <dd className="text-sm font-medium text-gray-900">
                {formatPrice(getTotalPrice() * 0.12)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-medium text-gray-900">
                Order total
              </dt>
              <dd className="text-base font-medium text-gray-900">
                {formatPrice(getTotalPrice() + 150 + getTotalPrice() * 0.12)}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            {/* Changed from type="submit" to onClick handler */}
            <Button
              onClick={handleCheckout}
              className="w-full"
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              or{" "}
              <Link
                href="/products"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Continue Shopping
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
