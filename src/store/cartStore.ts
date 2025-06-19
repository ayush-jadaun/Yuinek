// src/store/cartStore.ts

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  size: string; // e.g., "US 9"
  color: string; // e.g., "Red"
  quantity: number;
  price: number;
}

// Define a unique identifier for a cart item
type CartItemIdentifier = {
  productId: string;
  size: string;
  color: string;
};

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (identifier: CartItemIdentifier) => void;
  updateQuantity: (identifier: CartItemIdentifier, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              item.size === newItem.size &&
              item.color === newItem.color
          );

          if (existingItemIndex > -1) {
            // Item exists, update quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          } else {
            // Item does not exist, add it
            return { items: [...state.items, newItem] };
          }
        });
      },

      removeItem: (identifier) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === identifier.productId &&
                item.size === identifier.size &&
                item.color === identifier.color
              )
          ),
        }));
      },

      updateQuantity: (identifier, quantity) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.productId === identifier.productId &&
              item.size === identifier.size &&
              item.color === identifier.color
                ? { ...item, quantity: Math.max(0, quantity) } // Ensure quantity isn't negative
                : item
            )
            .filter((item) => item.quantity > 0), // Remove item if quantity is 0
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage", // name of the item in storage
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
);
