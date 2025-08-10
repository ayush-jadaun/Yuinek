// src/app/(shop)/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Yuniek",
  description:
    "Discover Yuniek — your new destination for stylish and comfortable footwear in the Philippines.",
};

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-amber-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-full p-6 w-24 h-24 mx-auto shadow-sm">
              <Image
                src="/images/logo.png"
                alt="Yuniek Logo"
                width={48}
                height={48}
                className="mx-auto"
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Welcome to <span className="text-amber-600">Yuniek</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We&apos;re just getting started on our journey to bring you stylish,
            comfortable footwear at prices that make sense.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Our Story */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
              Our Story
            </div>

            <h2 className="text-3xl font-bold text-gray-800">
              Simple Idea. <span className="text-amber-600">Better Shoes.</span>
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Founded in 2024, Yuniek started with a simple belief: everyone
              deserves great shoes without breaking the bank. We&lsquo;re building
              something special for Filipino feet, one step at a time.
            </p>

            <p className="text-gray-600 leading-relaxed">
              While we&apos;re still growing, our commitment remains the same —
              quality footwear that looks good, feels great, and won&apos;t empty
              your wallet.
            </p>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl h-64 flex items-center justify-center">
              <div className="text-5xl">👟</div>
            </div>
            <div className="absolute -bottom-3 -right-3 bg-white rounded-xl p-3 shadow-md">
              <div className="text-xl font-bold text-amber-600">2024</div>
              <div className="text-xs text-gray-500">Started</div>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">
            What We&lsquo;re Building
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-600 text-xl">💝</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Quality First
              </h4>
              <p className="text-gray-600 text-sm">
                Every pair is chosen with care for comfort and durability
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-600 text-xl">💰</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Fair Prices</h4>
              <p className="text-gray-600 text-sm">
                Great shoes shouldn&apos;t cost a fortune
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-600 text-xl">🤝</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Personal Touch
              </h4>
              <p className="text-gray-600 text-sm">
                We&lsquo;re here to help you find your perfect fit
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple CTA */}
      <section className="bg-gradient-to-r from-amber-100 to-amber-200 py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Find Your Perfect Pair?
          </h3>

          <p className="text-gray-700 mb-8">
            Browse our collection and discover what makes Yuniek special
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              View Our Shoes
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center text-amber-700 hover:text-amber-800 font-semibold px-6 py-3 border border-amber-300 hover:border-amber-400 rounded-lg transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
