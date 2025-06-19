// src/components/product/ProductGrid.tsx

import { IProduct } from "@/models/Product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: IProduct[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  // Handle the case where there are no products to display.
  // This is important for filtered views or if the API returns an empty array.
  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-center text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    // This div uses Tailwind CSS to create a responsive grid.
    // - It's a grid container (`grid`).
    // - On small screens (mobile-first), it has 1 column (`grid-cols-1`).
    // - On small-named breakpoints and up (sm:), it has 2 columns (`sm:grid-cols-2`).
    // - On large-named breakpoints and up (lg:), it has 3 columns (`lg:grid-cols-3`).
    // - On extra-large breakpoints and up (xl:), it has 4 columns (`xl:grid-cols-4`).
    // - It has spacing between columns (`gap-x-6`) and rows (`gap-y-10`).
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {products.map((product) => (
        // For each product in the array, we render a ProductCard.
        // The `key` prop is crucial for React to efficiently manage the list.
        <ProductCard key={product._id.toString()} product={product} />
      ))}
    </div>
  );
}
