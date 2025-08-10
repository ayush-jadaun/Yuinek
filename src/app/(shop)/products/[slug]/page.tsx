import { IProduct } from "@/models/Product";
import ProductDetails from "@/components/product/ProductDetails";
import Image from "next/image";
import Link from "next/link";
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
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8 text-sm sm:text-base">
            The product you&apos;re looking for doesn&lsquo;t exist or has been removed.
          </p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  // Ensure images array exists and has at least one item
  const primaryImage = product.images?.[0];
  const secondaryImage = product.images?.[1];
  const tertiaryImage = product.images?.[2];

  return (
    <div className="pt-4 sm:pt-6">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Mobile Image Gallery */}
        <div className="block lg:hidden mb-6">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={primaryImage?.image_url || "/images/logo.png"}
              alt={primaryImage?.alt_text || product.name}
              width={600}
              height={600}
              className="h-full w-full object-cover object-center"
              priority
            />
          </div>
          {/* Mobile thumbnail gallery */}
          {(secondaryImage || tertiaryImage) && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {secondaryImage && (
                <div className="flex-shrink-0 aspect-square w-20 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={secondaryImage.image_url}
                    alt={secondaryImage.alt_text || product.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              )}
              {tertiaryImage && (
                <div className="flex-shrink-0 aspect-square w-20 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={tertiaryImage.image_url}
                    alt={tertiaryImage.alt_text || product.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-x-8">
          {/* Main Image */}
          <div className="aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={primaryImage?.image_url || "/images/logo.png"}
              alt={primaryImage?.alt_text || product.name}
              width={800}
              height={1000}
              className="h-full w-full object-cover object-center"
              priority
            />
          </div>

          {/* Side Images */}
          <div className="grid grid-cols-1 gap-y-8">
            <div className="aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={secondaryImage?.image_url || "/images/logo.png"}
                alt={secondaryImage?.alt_text || product.name}
                width={500}
                height={625}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={tertiaryImage?.image_url || "/images/logo.png"}
                alt={tertiaryImage?.alt_text || product.name}
                width={500}
                height={625}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-0">
            <ProductDetails product={product} />
          </div>
        </div>

        {/* Mobile Product Details */}
        <div className="block lg:hidden mt-6">
          <ProductDetails product={product} />
        </div>
      </div>
    </div>
  );
}
