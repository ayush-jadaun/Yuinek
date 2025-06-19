// src/app/(shop)/products/[slug]/page.tsx

import { IProduct } from "@/models/Product";
import ProductDetails from "@/components/product/ProductDetails";
import Image from "next/image";
import type { Metadata } from "next";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// This function fetches a single product by its slug
async function getProduct(slug: string): Promise<IProduct | null> {
  try {
    const apiUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    // Use the API route that can handle both ID and slug
    const res = await fetch(`${apiUrl}/api/products/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product;
  } catch (error) {
    console.error(`[GET_PRODUCT_ERROR: ${slug}]`, error);
    return null;
  }
}

// Generate metadata for the page dynamically
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) {
    return {
      title: "Product Not Found",
    };
  }
  return {
    title: product.name,
    description: product.short_description || product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    return <p className="text-center">Product not found.</p>;
  }

  return (
    <div className="pt-6">
      <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
        {/* Image gallery */}
        <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
          <Image
            src={product.images[0]?.image_url || "/placeholder.png"}
            alt={product.images[0]?.alt_text || product.name}
            width={800}
            height={800}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
          <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
            <Image
              src={product.images[1]?.image_url || "/placeholder.png"}
              alt={product.images[1]?.alt_text || product.name}
              width={500}
              height={500}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
            <Image
              src={product.images[2]?.image_url || "/placeholder.png"}
              alt={product.images[2]?.alt_text || product.name}
              width={500}
              height={500}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product info */}
        <ProductDetails product={product} />
      </div>
    </div>
  );
}
