"use client";

import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Loafers",
    image: "/categories/loafers.jpg",
    link: "/products?type=loafers",
  },
  {
    name: "Sneakers",
    image: "/categories/sneakers.jpg",
    link: "/products?type=sneakers",
  },
  {
    name: "Sports",
    image: "/categories/sports.jpg",
    link: "/products?type=sports",
  },
  {
    name: "Slippers",
    image: "/categories/slippers.jpg",
    link: "/products?type=slippers",
  },
  {
    name: "Formal",
    image: "/categories/formal.jpg",
    link: "/products?type=formal",
  },
];

const ShopByCategory = () => (
  <section className="max-w-7xl mx-auto py-12 px-4">
    <h2 className="text-3xl font-serif text-yellow-700 mb-8 text-center">
      Shop by Category
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {categories.map((cat) => (
        <Link
          href={cat.link}
          key={cat.name}
          className="group block rounded-lg overflow-hidden shadow-md bg-yellow-50 hover:shadow-xl transition"
        >
          <div className="relative w-full h-40">
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="py-3 text-center text-yellow-800 font-semibold text-lg">
            {cat.name}
          </div>
        </Link>
      ))}
    </div>
  </section>
);

export default ShopByCategory;
