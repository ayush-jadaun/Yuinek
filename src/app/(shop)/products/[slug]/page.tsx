import { IProduct } from "@/models/Product";
import ProductDetails from "@/components/product/ProductDetails";
import Image from "next/image";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// This function fetches a single product by its slug
async function getProduct(slug: string): Promise<IProduct | null> {
  try {
    const apiUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    // Use the API route that can handle both ID and slug
    const res = await fetch(`${apiUrl}/api/products/${slug}`, {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch product: ${res.status} ${res.statusText}`);
      return null;
    }

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
  // Await params before using
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }
  return {
    title: product.meta_title || product.name,
    description:
      product.meta_description ||
      product.short_description ||
      product.description,
    openGraph: {
      title: product.name,
      description: product.short_description || product.description,
      images: product.images?.[0]?.image_url
        ? [product.images[0].image_url]
        : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Await params before using
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse All Products
          </a>
        </div>
      </div>
    );
  }

  // Ensure images array exists and has at least one item
  const primaryImage = product.images?.[0];
  const secondaryImage = product.images?.[1];
  const tertiaryImage = product.images?.[2];

  return (
    <div className="pt-6">
      <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
        {/* Image gallery */}
        <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
          <Image
            src={primaryImage?.image_url || "/placeholder.png"}
            alt={primaryImage?.alt_text || product.name}
            width={800}
            height={800}
            className="h-full w-full object-cover object-center"
            priority
          />
        </div>

        <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
          <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
            <Image
              src={secondaryImage?.image_url || "/placeholder.png"}
              alt={secondaryImage?.alt_text || product.name}
              width={500}
              height={500}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
            <Image
              src={tertiaryImage?.image_url || "/placeholder.png"}
              alt={tertiaryImage?.alt_text || product.name}
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
