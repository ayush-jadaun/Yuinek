// src/components/product/WishlistButton.tsx

"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useWishlistStore, WishlistItem } from "@/store/wishlistStore";
import { IProduct } from "@/models/Product";

interface WishlistButtonProps {
  product: IProduct;
}

export default function WishlistButton({ product }: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product._id.toString());

  const toggleWishlist = () => {
    const primaryImage =
      product.images.find((img) => img.is_primary) || product.images[0];
    const wishlistItem: WishlistItem = {
      productId: product._id.toString(),
      name: product.name,
      slug: product.slug,
      image: primaryImage?.image_url || "/placeholder.png",
      price: product.sale_price || product.base_price,
    };

    if (isWishlisted) {
      removeItem(product._id.toString());
    } else {
      addItem(wishlistItem);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className="absolute top-2 right-2 p-2 rounded-full bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white"
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isWishlisted ? (
        <HeartIconSolid className="h-6 w-6 text-red-500" />
      ) : (
        <HeartIcon className="h-6 w-6" />
      )}
    </button>
  );
}
