"use client";

import Link from "next/link";
import Image from "next/image";

// Example products array (replace with real data/fetch)
const products = [
  {
    id: "1",
    name: "Classic Loafer",
    image: "/products/loafer1.jpg",
    price: 2399,
    link: "/products/1",
  },
  // Add more...
];

const AllProducts = () => (
  <section className="max-w-7xl mx-auto py-12 px-4">
    <h2 className="text-3xl font-serif text-yellow-700 mb-8 text-center">
      All Products
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <Link
          href={product.link}
          key={product.id}
          className="group block rounded-lg overflow-hidden shadow-md bg-white hover:shadow-xl transition"
        >
          <div className="relative w-full h-52">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-yellow-800">
              {product.name}
            </h3>
            <div className="text-yellow-600 font-bold mt-1">
              ₹{product.price}
            </div>
          </div>
        </Link>
      ))}
    </div>
    <div className="flex justify-center mt-10">
      <Link
        href="/products"
        className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold rounded px-6 py-2 transition"
      >
        View All Products
      </Link>
    </div>
  </section>
);

export default AllProducts;
