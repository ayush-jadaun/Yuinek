// src/components/cart/CartItem.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore, CartItem as CartItemType } from "@/store/cartStore";

interface CartItemProps {
  item: CartItemType;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(price);
};

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      updateQuantity(
        { productId: item.productId, size: item.size, color: item.color },
        newQuantity
      );
    }
  };

  const handleRemove = () => {
    removeItem({
      productId: item.productId,
      size: item.size,
      color: item.color,
    });
  };

  return (
    <li className="flex py-6 sm:py-10">
      <div className="flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          width={150}
          height={150}
          className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div>
            <h3 className="text-sm">
              <Link
                href={`/products/${item.slug}`}
                className="font-medium text-gray-700 hover:text-gray-800"
              >
                {item.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-gray-500">{item.color}</p>
            <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            <label htmlFor={`quantity-${item.productId}`} className="sr-only">
              Quantity, {item.name}
            </label>
            <input
              id={`quantity-${item.productId}`}
              name={`quantity-${item.productId}`}
              type="number"
              min="1"
              value={item.quantity}
              onChange={handleQuantityChange}
              className="block w-16 rounded-md border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <p className="mt-2 text-sm font-medium text-gray-900">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex space-x-2 text-sm text-gray-700">
          <button
            type="button"
            onClick={handleRemove}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
