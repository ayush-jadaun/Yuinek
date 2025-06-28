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
  SparklesIcon,
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  // Fallback for no images
  const primaryImage =
    product.images && product.images.length > 0
      ? product.images.find((img) => img.is_primary) || product.images[0]
      : undefined;
  const secondaryImage =
    product.images && product.images.length > 1
      ? product.images[1]
      : primaryImage;

  const isWishlisted = isInWishlist(product._id.toString());

  // sale_price logic
  const hasDiscount =
    product.sale_price !== undefined &&
    product.sale_price !== null &&
    product.sale_price < product.base_price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.base_price - product.sale_price!) / product.base_price) * 100
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
        price: product.sale_price ?? product.base_price,
      });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Add first available variant to cart
    const firstVariant = product.variants[0];
    if (firstVariant) {
      const color =
        typeof firstVariant.color_id === "object" && firstVariant.color_id
          ? firstVariant.color_id.name
          : "Default";
      const size =
        typeof firstVariant.size_id === "object" && firstVariant.size_id
          ? firstVariant.size_id.us_size
          : "Default";

      addToCart({
        productId: product._id.toString(),
        name: product.name,
        slug: product.slug,
        image: primaryImage?.image_url || "/placeholder.png",
        colorId:
          firstVariant && typeof firstVariant.color_id === "object"
            ? String(firstVariant.color_id._id)
            : String(firstVariant.color_id || "Default"),
        sizeId:
          firstVariant && typeof firstVariant.size_id === "object"
            ? String(firstVariant.size_id._id)
            : String(firstVariant.size_id || "Default"),
        quantity: 1,
        price: product.sale_price ?? product.base_price,
      });
    }
  };

  // Unique colors for color dots
  const uniqueColors = [
    ...new Set(
      product.variants
        .map((v) =>
          typeof v.color_id === "object" && v.color_id
            ? v.color_id.hex_code
            : "#ccc"
        )
        .filter(Boolean)
    ),
  ];

  return (
    <div
      className="group relative flex flex-col bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Link href={`/products/${product.slug}`}>
          <div className="relative h-full w-full">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            )}
            <Image
              src={
                isHovered && secondaryImage?.image_url
                  ? secondaryImage.image_url
                  : primaryImage?.image_url || "/placeholder.png"
              }
              alt={primaryImage?.alt_text || product.name}
              width={400}
              height={400}
              // Optionally add Cloudinary transformations for better optimization
              // If product.images are always Cloudinary, you can do:
              // src={url => url.replace('/upload/', '/upload/f_auto,q_auto,w_400/')}
              className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              priority // optional: for above-the-fold cards
              placeholder="empty" // can use "blur" if you have blurDataURL
            />

            {/* Gradient overlay on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-500 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </Link>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
            <SparklesIcon className="w-3 h-3 inline mr-1" />-
            {discountPercentage}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-4 right-4 p-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
            isWishlisted ? "ring-2 ring-red-400" : ""
          }`}
        >
          {isWishlisted ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-700 hover:text-red-500 transition-colors duration-200" />
          )}
        </button>

        {/* Stock Status */}
        {product.variants.every((v) => v.stock_quantity === 0) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick Actions - Show on Hover */}
        <div
          className={`absolute bottom-4 left-4 right-4 flex gap-3 transition-all duration-500 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 bg-white/95 backdrop-blur-md text-gray-900 py-3 px-4 rounded-2xl text-sm font-semibold hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <EyeIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Quick View</span>
            <span className="sm:hidden">View</span>
          </Link>
          <button
            onClick={handleQuickAdd}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
          >
            <ShoppingBagIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        <Link href={`/products/${product.slug}`} className="flex-1">
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300 text-base sm:text-lg leading-tight">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className="h-4 w-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">(4.5)</span>
            <span className="text-xs text-gray-400 hidden sm:inline">
              • 234 reviews
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            {hasDiscount ? (
              <>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  {formatPrice(product.sale_price!)}
                </span>
                <span className="text-sm sm:text-base text-gray-500 line-through">
                  {formatPrice(product.base_price)}
                </span>
              </>
            ) : (
              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                {formatPrice(product.base_price)}
              </span>
            )}
          </div>
        </Link>

        {/* Available Colors */}
        {uniqueColors.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Colors:</span>
              <div className="flex gap-1.5">
                {uniqueColors.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 hover:scale-110 transition-transform duration-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
                {uniqueColors.length > 3 && (
                  <div className="w-5 h-5 rounded-full bg-gray-100 border-2 border-white shadow-sm ring-1 ring-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-600 font-medium">
                      +{uniqueColors.length - 3}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-gray-500">In Stock</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
