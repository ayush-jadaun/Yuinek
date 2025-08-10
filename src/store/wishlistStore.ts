// src/store/wishlistStore.ts

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Using a simplified product structure for the wishlist
export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void; // Add this line
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const existing = get().items.find(
          (item) => item.productId === newItem.productId
        );
        if (!existing) {
          set((state) => ({ items: [...state.items, newItem] }));
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
