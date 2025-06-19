// src/components/product/ProductCard.tsx

import Link from "next/link";
import Image from "next/image";
import { IProduct } from "@/models/Product";

interface ProductCardProps {
  product: IProduct;
}

// A helper to format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(price);
};

export default function ProductCard({ product }: ProductCardProps) {
  // Find the primary image or fall back to the first image
  const primaryImage =
    product.images.find((img) => img.is_primary) || product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col"
    >
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 h-80">
        {primaryImage ? (
          <Image
            src={primaryImage.image_url}
            alt={primaryImage.alt_text || product.name}
            width={400}
            height={400}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
        ) : (
          <div className="h-full w-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-col flex-grow">
        <div>
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          {/* You can display category here if needed */}
          {/* <p className="text-sm text-gray-500">{product.category_id.name}</p> */}
        </div>
        <div className="mt-auto pt-2">
          {product.sale_price && product.sale_price < product.base_price ? (
            <div className="flex items-baseline gap-x-2">
              <p className="text-lg font-medium text-gray-900">
                {formatPrice(product.sale_price)}
              </p>
              <p className="text-sm font-medium text-gray-500 line-through">
                {formatPrice(product.base_price)}
              </p>
            </div>
          ) : (
            <p className="text-lg font-medium text-gray-900">
              {formatPrice(product.base_price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
