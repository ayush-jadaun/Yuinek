import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  sizeId: string;
  colorId: string;
  price: number;
  quantity: number;
}

// Corrected identifier type
type CartItemIdentifier = {
  productId: string;
  sizeId: string;
  colorId: string;
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
              item.sizeId === newItem.sizeId &&
              item.colorId === newItem.colorId
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
                item.sizeId === identifier.sizeId &&
                item.colorId === identifier.colorId
              )
          ),
        }));
      },

      updateQuantity: (identifier, quantity) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.productId === identifier.productId &&
              item.sizeId === identifier.sizeId &&
              item.colorId === identifier.colorId
                ? { ...item, quantity: Math.max(0, quantity) }
                : item
            )
            .filter((item) => item.quantity > 0),
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
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
