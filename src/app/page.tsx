import ProductGrid from "@/components/product/ProductGrid";
import { IProduct } from "@/models/Product";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  StarIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

async function getFeaturedProducts(): Promise<IProduct[]> {
  try {
    const apiUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/api/products?featured=true&limit=8`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error("Failed to fetch featured products");
    const data = await res.json();
    return data.products;
  } catch (error) {
    console.error("[GET_FEATURED_PRODUCTS_ERROR]", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className=" bg-amber-100">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                  What&apos;s new
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                  <span>Just shipped v2.0</span>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Step Into Your
              <span className="block bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                Perfect Style
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Discover premium footwear that combines cutting-edge design with
              unmatched comfort. From casual to formal, find the perfect pair
              for every occasion.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link href="/products">
                <Button className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 text-base font-semibold">
                  Shop Collection
                </Button>
              </Link>
              <button className="group inline-flex items-center gap-x-2 text-base font-semibold leading-6 text-gray-900">
                <PlayIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                Watch video
              </button>
            </div>

            {/* Stats */}
            <div className="mt-16 flex items-center gap-x-8">
              <div className="flex items-center gap-x-3">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">50K+ Reviews</span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">100K+</span> Happy
                Customers
              </div>
            </div>
          </div>

          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="relative rounded-3xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <Image
                  src="/images/logo.png"
                  alt="Hero shoes"
                  width={2432}
                  height={1442}
                  className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Why Choose Us
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for the perfect fit
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We&apos;re committed to providing the best shopping experience
              with premium quality products and exceptional service.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <TruckIcon className="h-6 w-6 text-white" />
                  </div>
                  Free Shipping
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Enjoy free shipping on all orders over $100. Fast delivery
                  worldwide with tracking included.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <ArrowPathIcon className="h-6 w-6 text-white" />
                  </div>
                  Easy Returns
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  30-day return policy. No questions asked. We&apos;ll even pay
                  for return shipping.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <ShieldCheckIcon className="h-6 w-6 text-white" />
                  </div>
                  Quality Guarantee
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  All products come with our lifetime quality guarantee. We
                  stand behind what we sell.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <StarIcon className="h-6 w-6 text-white" />
                  </div>
                  Expert Support
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Our shoe experts are here to help you find the perfect fit.
                  Chat with us anytime.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Shop by Category
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Find the perfect style for every occasion
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {[
              {
                name: "Athletic",
                description: "Performance footwear for your active lifestyle",
                image: "/placeholder.png",
                gradient: "from-red-500 to-orange-500",
              },
              {
                name: "Casual",
                description: "Comfortable everyday shoes for any occasion",
                image: "/placeholder.png",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                name: "Formal",
                description:
                  "Elegant shoes for professional and special events",
                image: "/placeholder.png",
                gradient: "from-gray-700 to-gray-900",
              },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/categories/${category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-3xl bg-gray-100 aspect-[3/2] hover:shadow-2xl transition-all duration-500"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-80 group-hover:opacity-90 transition-opacity duration-300`}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-white/90 text-sm mb-4">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center text-white font-semibold group-hover:translate-x-1 transition-transform duration-300">
                    Shop Now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Featured Collection
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Handpicked for You
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Discover our most popular styles, loved by customers worldwide.
            </p>
          </div>

          <div className="mt-16">
            <ProductGrid products={featuredProducts} />
          </div>

          <div className="mt-16 text-center">
            <Link href="/products">
              <Button
                variant="outline"
                className="px-8 py-3 text-base font-semibold border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300"
              >
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-lg font-semibold leading-8 text-gray-600">
              Trusted by customers worldwide
            </h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            {/* Add brand logos here */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              >
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
