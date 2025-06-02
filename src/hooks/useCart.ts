"use client";

import { useState, useEffect, useCallback } from "react";

// Types
export interface Product {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  type?: string;
}

export interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
  selectedVariant?: string;
}

export function useCart(userId?: string | null) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart items for user
  const fetchCart = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cart?userId=${userId}`);
      const data = await res.json();
      setCartItems(data.cartItems || []);
    } catch (error) {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add or update cart item
  const addToCart = useCallback(
    async ({
      productId,
      quantity = 1,
      selectedVariant,
    }: {
      productId: string;
      quantity?: number;
      selectedVariant?: string;
    }) => {
      if (!userId) return;
      setLoading(true);
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId,
          quantity,
          selectedVariant,
        }),
      });
      await fetchCart();
    },
    [userId, fetchCart]
  );

  // Update quantity or variant
  const updateCartItem = useCallback(
    async ({
      cartItemId,
      quantity,
      selectedVariant,
    }: {
      cartItemId: string;
      quantity?: number;
      selectedVariant?: string;
    }) => {
      setLoading(true);
      await fetch(`/api/cart?id=${cartItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity, selectedVariant }),
      });
      await fetchCart();
    },
    [fetchCart]
  );

  // Remove from cart
  const removeFromCart = useCallback(
    async (cartItemId: string) => {
      setLoading(true);
      await fetch(`/api/cart?id=${cartItemId}`, { method: "DELETE" });
      await fetchCart();
    },
    [fetchCart]
  );

  // Clear cart (remove all items)
  const clearCart = useCallback(async () => {
    setLoading(true);
    // This assumes your backend supports bulk delete, otherwise loop through and delete each
    await Promise.all(
      cartItems.map((item) =>
        fetch(`/api/cart?id=${item._id}`, { method: "DELETE" })
      )
    );
    await fetchCart();
  }, [cartItems, fetchCart]);

  // Cart subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.productId.price || 0) * item.quantity,
    0
  );

  return {
    cartItems,
    loading,
    subtotal,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
}

export default useCart;
