// src/app/(shop)/products/page.tsx

import ProductGrid from "@/components/product/ProductGrid";
import { IProduct } from "@/models/Product";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse all available products in our store.",
};

// This function fetches data directly on the server.
// In a real app, you might get searchParams for pagination, filtering, etc.
async function getProducts() {
  try {
    const apiUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/api/products?limit=20`, {
      // Revalidate every 60 seconds
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await res.json();
    return data.products;
  } catch (error) {
    console.error("[GET_PRODUCTS_ERROR]", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products: IProduct[] = await getProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        All Products
      </h1>
      <p className="mt-4 text-base text-gray-500">
        Check out the latest and greatest in our collection. Find your perfect
        pair today.
      </p>

      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
