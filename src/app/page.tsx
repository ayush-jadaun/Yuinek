// src/app/page.tsx

import ProductGrid from "@/components/product/ProductGrid";
import { IProduct } from "@/models/Product";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

async function getFeaturedProducts(): Promise<IProduct[]> {
  try {
    const apiUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/api/products?featured=true&limit=4`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });
    if (!res.ok) throw new Error("Failed to fetch featured products");
    const data = await res.json();
    return data.products;
  } catch (error) {
    console.error("[GET_FEATURED_PRODUCTS_ERROR]", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-40">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Find Your Perfect Pair
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Step into style and comfort. Explore our latest collection of
              premium footwear, crafted for every journey.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/products">
                <Button>Shop Now</Button>
              </Link>
              <Link
                href="/about"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Featured Products
        </h2>
        <div className="mt-6">
          <ProductGrid products={featuredProducts} />
        </div>
      </div>
    </div>
  );
}
