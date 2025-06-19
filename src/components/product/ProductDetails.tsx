// src/components/product/ProductDetails.tsx

"use client";

import { useState } from "react";
import { IProduct } from "@/models/Product";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";

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
    product.variants[0]?.color_id.name || null
  );
  const [selectedSize, setSelectedSize] = useState(
    product.variants[0]?.size_id.us_size || null
  );
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    setError(null);
    setSuccess(null);

    if (!selectedColor || !selectedSize) {
      setError("Please select a color and size.");
      return;
    }

    const variant = product.variants.find(
      (v) =>
        v.color_id.name === selectedColor && v.size_id.us_size === selectedSize
    );

    if (!variant || variant.stock_quantity < quantity) {
      setError("This variant is out of stock.");
      return;
    }

    const price = product.sale_price || product.base_price;
    const adjustedPrice = price + (variant.price_adjustment || 0);
    const primaryImage =
      product.images.find((img) => img.is_primary) || product.images[0];

    addItem({
      productId: product._id.toString(),
      name: product.name,
      slug: product.slug,
      image: primaryImage?.image_url || "/placeholder.png",
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      price: adjustedPrice,
    });

    setSuccess("Added to cart!");
    setTimeout(() => setSuccess(null), 3000);
  };

  // Get unique colors and sizes from variants
  const colors = [...new Set(product.variants.map((v) => v.color_id.name))];
  const sizes = [...new Set(product.variants.map((v) => v.size_id.us_size))];

  return (
    <div className="lg:col-span-2 lg:border-l lg:border-gray-200 lg:pl-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {product.name}
      </h1>
      <p className="text-3xl tracking-tight text-gray-900 mt-4">
        {formatPrice(product.base_price)}
      </p>

      <div className="mt-10">
        {/* Colors */}
        <div>
          <h3 className="text-sm font-medium text-gray-900">Color</h3>
          <div className="flex items-center space-x-3 mt-4">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none ${
                  selectedColor === color
                    ? "ring ring-offset-1 ring-indigo-500"
                    : ""
                }`}
              >
                <span
                  style={{
                    backgroundColor:
                      product.variants.find((v) => v.color_id.name === color)
                        ?.color_id.hex_code || "#ccc",
                  }}
                  className="h-8 w-8 rounded-full border border-black border-opacity-10"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="mt-10">
          <h3 className="text-sm font-medium text-gray-900">Size</h3>
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4 mt-4">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 ${
                  selectedSize === size
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <Button onClick={handleAddToCart}>Add to bag</Button>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
        </div>
      </div>
      <div className="py-10 lg:pt-6">
        <h3 className="text-lg font-medium text-gray-900">Description</h3>
        <div className="mt-4 space-y-6">
          <p className="text-base text-gray-700">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
