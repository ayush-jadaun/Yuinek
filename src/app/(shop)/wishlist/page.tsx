// src/app/(shop)/wishlist/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlistStore";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/product/ProductCard"; // We can reuse this!

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Loading Wishlist...
        </h1>
        <div className="mt-12 h-64 w-full animate-pulse rounded-lg bg-gray-200"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Your Wishlist is Empty
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Add your favorite items to your wishlist to keep track of them here.
        </p>
        <div className="mt-6">
          <Link href="/products">
            <Button>Discover Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  // We need to map the WishlistItem to a structure ProductCard expects.
  // This is a bit of a hack; a better solution might be a dedicated WishlistCard component.
  const productsForGrid = items.map((item) => ({
    _id: item.productId,
    name: item.name,
    slug: item.slug,
    base_price: item.price,
    images: [{ image_url: item.image, is_primary: true }],
  })) as any; // Using `any` to bypass strict IProduct typing for this example.

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-10">
        My Wishlist
      </h1>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {productsForGrid.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
