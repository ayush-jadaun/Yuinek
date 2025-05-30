"use client";

import Image from "next/image";

// Example banners
const banners = [
  {
    image: "/banners/banner1.jpg",
    link: "/products?type=sports",
    label: "Sports Collection",
  },
  {
    image: "/banners/banner2.jpg",
    link: "/products?type=formal",
    label: "Formal Elegance",
  },
];

const MidPageBannerSlider = () => (
  <section className="w-full py-8 bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 px-4">
      {banners.map((banner) => (
        <a
          key={banner.label}
          href={banner.link}
          className="flex-1 rounded-lg overflow-hidden shadow-lg group relative"
        >
          <div className="relative h-40 md:h-56 w-full">
            <Image
              src={banner.image}
              alt={banner.label}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span className="absolute bottom-4 left-4 bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded shadow-lg text-lg">
            {banner.label}
          </span>
        </a>
      ))}
    </div>
  </section>
);

export default MidPageBannerSlider;
