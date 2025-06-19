// src/app/(shop)/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ShoeStore",
  description: "Learn about the mission and history of ShoeStore.",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Our Story
      </h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          A Step Above the Rest
        </h2>
        <p className="text-gray-600 leading-relaxed">
          At ShoeStore, we believe shoes are more than just a necessity—they're
          a statement of who you are. Founded in 2024 by passionate footwear
          enthusiasts, ShoeStore began with a mission to make high-quality,
          stylish, and affordable footwear accessible to everyone.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Crafted with Passion
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Our collection is carefully curated to ensure every pair of shoes not
          only meets high standards of durability and comfort, but also keeps up
          with the latest fashion trends. From timeless classics to modern
          sneakers, we have something for every walk of life.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Our Commitment
        </h2>
        <p className="text-gray-600 leading-relaxed">
          We're more than a store—we're a community. Our team is committed to
          exceptional service, ethical sourcing, and contributing to a more
          sustainable fashion future. Thank you for stepping with us.
        </p>
      </section>
    </div>
  );
}
