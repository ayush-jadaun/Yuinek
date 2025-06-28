"use client";

import { useState } from "react";
import { IProduct } from "@/models/Product";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import {
  HeartIcon,
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  StarIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
  FireIcon,
  ClockIcon,
  ShareIcon,
  EyeIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

interface ProductDetailsProps {
  product: IProduct;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(price);
};

// Cloudinary image optimization
const getOptimizedImageUrl = (
  url: string,
  width: number = 800,
  quality: number = 80
) => {
  if (url.includes("cloudinary.com")) {
    // Extract the public_id from Cloudinary URL
    const urlParts = url.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");
    if (uploadIndex !== -1) {
      const publicId = urlParts.slice(uploadIndex + 1).join("/");
      const baseUrl = urlParts.slice(0, uploadIndex + 1).join("/");
      return `${baseUrl}/w_${width},q_${quality},f_auto,c_fill/${publicId}`;
    }
  }
  return url;
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState(
    product.variants[0]?.color_id &&
      typeof product.variants[0].color_id === "object"
      ? product.variants[0].color_id.name
      : null
  );
  const [selectedSize, setSelectedSize] = useState(
    product.variants[0]?.size_id &&
      typeof product.variants[0].size_id === "object"
      ? product.variants[0].size_id.us_size
      : null
  );
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const { addItem: addToCart } = useCartStore();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();

  const isWishlisted = isInWishlist(product._id.toString());
  const hasDiscount =
    product.sale_price !== undefined &&
    product.sale_price !== null &&
    product.sale_price < product.base_price;
  const discountPercentage =
    hasDiscount && product.sale_price !== undefined
      ? Math.round(
          ((product.base_price - product.sale_price) / product.base_price) * 100
        )
      : 0;

  const handleAddToCart = async () => {
    setError(null);
    setSuccess(null);
    setAddingToCart(true);

    if (!selectedColor || !selectedSize) {
      setError("Please select a color and size.");
      setAddingToCart(false);
      return;
    }

    const variant = product.variants.find(
      (v) =>
        typeof v.color_id === "object" &&
        v.color_id.name === selectedColor &&
        typeof v.size_id === "object" &&
        v.size_id.us_size === selectedSize
    );

    if (!variant || variant.stock_quantity < quantity) {
      setError("This variant is out of stock.");
      setAddingToCart(false);
      return;
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const price = product.sale_price ?? product.base_price;
    const adjustedPrice = price + (variant.price_adjustment || 0);
    const primaryImage =
      product.images.find((img) => img.is_primary) || product.images[0];

    addToCart({
      productId: product._id.toString(),
      name: product.name,
      slug: product.slug,
      image: primaryImage?.image_url || "/placeholder.png",
      colorId:
        typeof variant.color_id === "object"
          ? String(variant.color_id._id)
          : String(variant.color_id ?? selectedColor ?? "Default"),
      sizeId:
        typeof variant.size_id === "object"
          ? String(variant.size_id._id)
          : String(variant.size_id ?? selectedSize ?? "Default"),
      quantity: quantity,
      price: adjustedPrice,
    });

    setSuccess("Added to cart successfully!");
    setAddingToCart(false);
    setTimeout(() => setSuccess(null), 4000);
  };

  const handleWishlistToggle = () => {
    const primaryImage =
      product.images.find((img) => img.is_primary) || product.images[0];

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      setSuccess("Link copied to clipboard!");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Get unique colors and sizes from variants
  const colors = [
    ...new Set(
      product.variants.map((v) =>
        typeof v.color_id === "object" ? v.color_id.name : "Default"
      )
    ),
  ];
  const sizes = [
    ...new Set(
      product.variants.map((v) =>
        typeof v.size_id === "object" ? v.size_id.us_size : "Default"
      )
    ),
  ];

  // Get available stock for selected variant
  const selectedVariant = product.variants.find(
    (v) =>
      typeof v.color_id === "object" &&
      v.color_id.name === selectedColor &&
      typeof v.size_id === "object" &&
      v.size_id.us_size === selectedSize
  );

  const isLowStock = selectedVariant && selectedVariant.stock_quantity <= 5;
  const primaryImage =
    product.images.find((img) => img.is_primary) || product.images[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden group">
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-3xl" />
              )}
              {primaryImage && (
                <Image
                  src={getOptimizedImageUrl(primaryImage.image_url, 800)}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  onLoad={() => setImageLoading(false)}
                />
              )}

              {/* Image Overlay Actions */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => {
                    /* Add zoom functionality */
                  }}
                  className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
                >
                  <EyeIcon className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
                >
                  <ShareIcon className="h-5 w-5 text-gray-700" />
                </button>
              </div>

              {/* Sale Badge */}
              {hasDiscount && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                    <FireIcon className="w-4 h-4 inline mr-1" />
                    {discountPercentage}% OFF
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative flex-shrink-0 w-20 h-20 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  >
                    <Image
                      src={getOptimizedImageUrl(image.image_url, 200)}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-3">
                    {product.name}
                  </h1>

                  {/* Rating & Reviews */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ))}
                      <span className="ml-2 font-semibold text-gray-900">
                        4.8
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>1,247 reviews</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="font-medium text-green-600">
                          In Stock
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                    isWishlisted
                      ? "bg-red-50 text-red-500 ring-2 ring-red-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="h-6 w-6" />
                  ) : (
                    <HeartIcon className="h-6 w-6" />
                  )}
                </button>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100">
                {hasDiscount ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl lg:text-5xl font-bold text-gray-900">
                        {formatPrice(product.sale_price ?? product.base_price)}
                      </span>
                      <span className="text-2xl text-gray-500 line-through">
                        {formatPrice(product.base_price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        <BoltIcon className="w-4 h-4 inline mr-1" />
                        Save{" "}
                        {formatPrice(
                          product.base_price -
                            (product.sale_price ?? product.base_price)
                        )}
                      </span>
                      <span className="text-sm text-gray-600">
                        Limited time offer
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-4xl lg:text-5xl font-bold text-gray-900">
                    {formatPrice(product.base_price)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Color Selection */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                Color
                {selectedColor && (
                  <span className="text-base font-normal text-gray-600">
                    - {selectedColor}
                  </span>
                )}
              </h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => {
                  const colorVariant = product.variants.find(
                    (v) =>
                      typeof v.color_id === "object" &&
                      v.color_id.name === color
                  );
                  const hexColor =
                    typeof colorVariant?.color_id === "object"
                      ? colorVariant.color_id.hex_code
                      : "#ccc";

                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative p-1 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                        selectedColor === color
                          ? "ring-4 ring-indigo-400 ring-offset-2 shadow-xl"
                          : "ring-2 ring-gray-200 hover:ring-gray-300"
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-xl border-2 border-white shadow-md"
                        style={{ backgroundColor: hexColor }}
                      />
                      {selectedColor === color && (
                        <CheckIcon className="absolute inset-0 m-auto h-6 w-6 text-white drop-shadow-lg" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Size</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-4 px-3 text-sm font-semibold rounded-xl border-2 transition-all duration-300 hover:scale-105 active:scale-95 ${
                      selectedSize === size
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                        : "bg-white text-gray-900 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Stock */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Quantity</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-4 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <MinusIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <span className="px-6 py-4 font-bold text-xl min-w-[100px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-4 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                    disabled={
                      selectedVariant &&
                      quantity >= selectedVariant.stock_quantity
                    }
                  >
                    <PlusIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {selectedVariant && (
                  <div className="flex items-center gap-2">
                    {isLowStock && (
                      <ClockIcon className="h-5 w-5 text-orange-500" />
                    )}
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        isLowStock
                          ? "text-orange-700 bg-orange-100"
                          : "text-green-700 bg-green-100"
                      }`}
                    >
                      {isLowStock ? "Only" : ""}{" "}
                      {selectedVariant.stock_quantity} left
                      {isLowStock && " - Order now!"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm p-4 -mx-4 border-t border-gray-200 sm:static sm:bg-transparent sm:p-0 sm:border-t-0">
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart || !selectedColor || !selectedSize}
                className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-6 px-8 text-lg font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed`}
              >
                {addingToCart ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingBagIcon className="h-6 w-6" />
                    Add to Cart -{" "}
                    {formatPrice(
                      (product.sale_price ?? product.base_price) * quantity
                    )}
                  </>
                )}
              </Button>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 animate-in slide-in-from-top duration-300">
                <p className="text-red-700 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {error}
                </p>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 animate-in slide-in-from-top duration-300">
                <p className="text-green-700 font-semibold flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-green-600" />
                  {success}
                </p>
              </div>
            )}

            {/* Features Grid */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-indigo-600" />
                Why Choose Us
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="p-3 bg-green-100 rounded-xl w-fit mb-4">
                    <TruckIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Free Shipping
                  </h4>
                  <p className="text-sm text-gray-600">
                    Free delivery on orders over ₱2,000
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
                    <ArrowPathIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Easy Returns
                  </h4>
                  <p className="text-sm text-gray-600">
                    30-day hassle-free returns
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="p-3 bg-purple-100 rounded-xl w-fit mb-4">
                    <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Quality Guarantee
                  </h4>
                  <p className="text-sm text-gray-600">
                    2-year warranty included
                  </p>
                </div>
              </div>
            </div>

            {/* Product Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-gray-600" />
                  Product Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium text-gray-900">
                      100% Premium Cotton
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Care:</span>
                    <span className="font-medium text-gray-900">
                      Machine Washable
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Origin:</span>
                    <span className="font-medium text-gray-900">
                      Made in Philippines
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-medium text-gray-900">
                      {product._id.toString().slice(-8).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Size Guide</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Need help finding your perfect fit?
                </p>
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100">
                  View Size Chart →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
