"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import CartItem from "@/components/cart/CartItem";
import { Button } from "@/components/ui/Button";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price);
};

// Empty bag SVG component
const EmptyBagIcon = () => (
  <svg
    className="mx-auto h-32 w-32 text-gray-300"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M9 13h6"
      opacity={0.5}
    />
  </svg>
);

export default function CartPage() {
  const { items, getTotalPrice } = useCartStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (!isClient) {
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
          {/* Empty bag illustration */}
          <div className="mb-8">
            <EmptyBagIcon />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Your bag looks empty!
          </h1>

          <p className="text-lg text-gray-600 mb-2">
            Ready to fill it up with amazing finds?
          </p>

          <p className="text-base text-gray-500 mb-8">
            Discover our latest collections and add some items to get started.
          </p>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto">
                Start Shopping
              </Button>
            </Link>

            <Link href="/collections">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Browse Collections
              </Button>
            </Link>
          </div>

          {/* Additional helpful links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Need help finding something specific?
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link
                href="/help"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Customer Support
              </Link>
              <Link
                href="/wishlist"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                View Wishlist
              </Link>
              <Link
                href="/categories"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Shop by Category
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <div className="text-sm text-gray-500">
          {items.length} {items.length === 1 ? "item" : "items"}
        </div>
      </div>

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

          {/* Continue shopping link below items */}
          <div className="mt-6">
            <Link
              href="/products"
              className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add more items
            </Link>
          </div>
        </section>

        {/* Order summary */}
        <section
          aria-labelledby="summary-heading"
          className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 sticky top-4"
        >
          <h2
            id="summary-heading"
            className="text-lg font-medium text-gray-900"
          >
            Order Summary
          </h2>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">
                {formatPrice(getTotalPrice())}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center text-sm text-gray-600">
                Shipping
                <span className="ml-1 text-xs text-green-600 font-medium">
                  (Fixed Rate)
                </span>
              </dt>
              <dd className="text-sm font-medium text-gray-900">
                {formatPrice(150)}
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
                Order Total
              </dt>
              <dd className="text-base font-medium text-gray-900">
                {formatPrice(getTotalPrice() + 150 + getTotalPrice() * 0.12)}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <Button
              onClick={handleCheckout}
              className="w-full"
              disabled={items.length === 0}
              size="lg"
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

          {/* Security badges */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Secure Checkout</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
