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

// Fetch product by slug
async function getProduct(slug: string): Promise<IProduct | null> {
  try {
    const apiUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

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

// Dynamic metadata
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
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
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
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

  const primaryImage = product.images?.[0];
  const secondaryImage = product.images?.[1];
  const tertiaryImage = product.images?.[2];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Amazon-Style Layout: Left Images, Right Details */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Side - Images Section (Amazon Style) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="flex flex-col lg:flex-row lg:space-x-4">
              {/* Thumbnail Column (Left side on desktop) */}
              <div className="order-2 lg:order-1 lg:w-16 xl:w-20">
                <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 mt-4 lg:mt-0 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                  {/* Primary Image Thumbnail */}
                  <div className="flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 border border-gray-200 rounded cursor-pointer hover:border-orange-500 transition-colors">
                    <Image
                      src={primaryImage?.image_url || "/images/logo.png"}
                      alt={primaryImage?.alt_text || product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* Secondary Image Thumbnail */}
                  {secondaryImage && (
                    <div className="flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 border border-gray-200 rounded cursor-pointer hover:border-orange-500 transition-colors">
                      <Image
                        src={secondaryImage.image_url}
                        alt={secondaryImage.alt_text || product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}

                  {/* Tertiary Image Thumbnail */}
                  {tertiaryImage && (
                    <div className="flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 border border-gray-200 rounded cursor-pointer hover:border-orange-500 transition-colors">
                      <Image
                        src={tertiaryImage.image_url}
                        alt={tertiaryImage.alt_text || product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Main Image (Right side on desktop) */}
              <div className="order-1 lg:order-2 flex-1">
                <div className="aspect-square bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={primaryImage?.image_url || "/images/logo.png"}
                    alt={primaryImage?.alt_text || product.name}
                    width={800}
                    height={800}
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Product Details (Amazon Style) */}
          <div className="mt-6 lg:mt-0 lg:col-span-7 xl:col-span-8">
            <div className="max-w-none">
              <ProductDetails product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
