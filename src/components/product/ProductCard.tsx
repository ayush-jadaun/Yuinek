"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { IProduct } from "@/models/Product";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import {
  HeartIcon,
  ShoppingBagIcon,
  EyeIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface ProductCardProps {
  product: IProduct;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(price);
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const isWishlisted = isInWishlist(product._id.toString());
  const primaryImage =
    product.images.find((img) => img.is_primary) || product.images[0];
  const secondaryImage = product.images[1] || primaryImage;

  const hasDiscount =
    product.sale_price && product.sale_price < product.base_price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.base_price - product.sale_price) / product.base_price) * 100
      )
    : 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(product._id.toString());
    } else {
      addToWishlist({
        productId: product._id.toString(),
        name: product.name,
        slug: product.slug,
        image: primaryImage?.image_url || "/placeholder.png",
        price: product.sale_price || product.base_price,
      });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Add first available variant to cart
    const firstVariant = product.variants[0];
    if (firstVariant) {
      addToCart({
        productId: product._id.toString(),
        name: product.name,
        slug: product.slug,
        image: primaryImage?.image_url || "/placeholder.png",
        color:
          typeof firstVariant.color_id === "object"
            ? firstVariant.color_id.name
            : "Default",
        size:
          typeof firstVariant.size_id === "object"
            ? firstVariant.size_id.us_size
            : "Default",
        quantity: 1,
        price: product.sale_price || product.base_price,
      });
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={
              isHovered && secondaryImage
                ? secondaryImage.image_url
                : primaryImage?.image_url || "/placeholder.png"
            }
            alt={primaryImage?.alt_text || product.name}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            -{discountPercentage}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200 group-hover:scale-110"
        >
          {isWishlisted ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-700 hover:text-red-500" />
          )}
        </button>

        {/* Quick Actions - Show on Hover */}
        <div
          className={`absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 bg-white/90 backdrop-blur-sm text-gray-900 py-2 px-4 rounded-full text-sm font-medium hover:bg-white transition-all duration-200 flex items-center justify-center gap-2"
          >
            <EyeIcon className="h-4 w-4" />
            Quick View
          </Link>
          <button
            onClick={handleQuickAdd}
            className="bg-black/90 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black transition-all duration-200"
          >
            <ShoppingBagIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/products/${product.slug}`} className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className="h-4 w-4 text-yellow-400 fill-current"
              />
            ))}
            <span className="text-sm text-gray-500 ml-1">(4.5)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.sale_price!)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.base_price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.base_price)}
              </span>
            )}
          </div>
        </Link>

        {/* Available Colors */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-3 flex items-center gap-1">
            <span className="text-xs text-gray-500">Colors:</span>
            <div className="flex gap-1">
              {[
                ...new Set(
                  product.variants.map((v) =>
                    typeof v.color_id === "object"
                      ? v.color_id.hex_code
                      : "#ccc"
                  )
                ),
              ]
                .slice(0, 4)
                .map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              {product.variants.length > 4 && (
                <span className="text-xs text-gray-500">
                  +{product.variants.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
