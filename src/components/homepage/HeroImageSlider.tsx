"use client";

import Image from "next/image";

// Example props, you can expand or fetch dynamically
const slides = [
  {
    image: "/slider/slide1.jpg",
    headline: "Summer Collection",
    subtext: "Up to 50% off on new arrivals.",
    link: "/products?type=sneakers",
  },
  {
    image: "/slider/slide2.jpg",
    headline: "Shop Loafers",
    subtext: "Classic comfort & style.",
    link: "/products?type=loafers",
  },
];

const HeroImageSlider = () => {
  // You can add carousel logic here (e.g., Swiper.js or another library)
  return (
    <section className="w-full h-[60vh] md:h-[80vh] bg-yellow-100 flex items-center overflow-hidden relative">
      {/* Replace with carousel/slider */}
      <div className="w-full h-full relative">
        <Image
          src={slides[0].image}
          alt={slides[0].headline}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-yellow-900/30 flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-yellow-50 drop-shadow-lg mb-4">
            {slides[0].headline}
          </h1>
          <p className="text-lg md:text-2xl text-yellow-100 mb-6">
            {slides[0].subtext}
          </p>
          <a
            href={slides[0].link}
            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold rounded px-6 py-2 transition"
          >
            Shop Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroImageSlider;
