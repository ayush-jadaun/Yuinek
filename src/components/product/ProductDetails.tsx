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
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface ProductDetailsProps {
  product: IProduct;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(price);
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

  const handleAddToCart = () => {
    setError(null);
    setSuccess(null);

    if (!selectedColor || !selectedSize) {
      setError("Please select a color and size.");
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
      return;
    }

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

    setSuccess("Added to cart!");
    setTimeout(() => setSuccess(null), 3000);
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

  return (
    <div className="lg:col-span-2 lg:border-l lg:border-gray-200 lg:pl-8">
      {/* Product Title & Rating */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">(4.5) • 234 reviews</span>
          </div>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
        >
          {isWishlisted ? (
            <HeartSolidIcon className="h-6 w-6 text-red-500" />
          ) : (
            <HeartIcon className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Price */}
      <div className="mt-6">
        {hasDiscount ? (
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(product.sale_price ?? product.base_price)}
            </span>
            <span className="text-xl text-gray-500 line-through">
              {formatPrice(product.base_price)}
            </span>
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
              -{discountPercentage}% OFF
            </span>
          </div>
        ) : (
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(product.base_price)}
          </span>
        )}
      </div>

      {/* Product Description */}
      <div className="mt-6">
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      <div className="mt-8 space-y-8">
        {/* Colors */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Color</h3>
          <div className="flex items-center gap-3">
            {colors.map((color) => {
              const colorVariant = product.variants.find(
                (v) =>
                  typeof v.color_id === "object" && v.color_id.name === color
              );
              const hexColor =
                typeof colorVariant?.color_id === "object"
                  ? colorVariant.color_id.hex_code
                  : "#ccc";

              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`relative p-1 rounded-full transition-all duration-200 ${
                    selectedColor === color
                      ? "ring-2 ring-indigo-500 ring-offset-2"
                      : "ring-1 ring-gray-300 hover:ring-gray-400"
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full border border-gray-200"
                    style={{ backgroundColor: hexColor }}
                  />
                  {selectedColor === color && (
                    <CheckIcon className="absolute inset-0 m-auto h-4 w-4 text-white" />
                  )}
                </button>
              );
            })}
          </div>
          {selectedColor && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {selectedColor}
            </p>
          )}
        </div>

        {/* Sizes */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Size</h3>
          <div className="grid grid-cols-4 gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-3 px-4 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  selectedSize === size
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-900 border-gray-300 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quantity</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100 transition-colors duration-200"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-gray-100 transition-colors duration-200"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            {selectedVariant && (
              <span className="text-sm text-gray-600">
                {selectedVariant.stock_quantity} in stock
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="flex gap-4">
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-8 text-lg font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3"
          >
            <ShoppingBagIcon className="h-5 w-5" />
            Add to Cart
          </Button>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        {/* Features */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <TruckIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">
                Free shipping on orders over $100
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ArrowPathIcon className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">
                30-day return policy
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-600">
                2-year warranty included
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
