import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";
// Define the category interface
interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_category_id?: string;
  is_active: boolean;
  sort_order: number;
  product_count?: number;
  createdAt: string;
  updatedAt: string;
}

// API response interface
interface CategoriesResponse {
  success: boolean;
  categories: ICategory[];
  total?: number;
}

// Metadata for SEO
export const metadata: Metadata = {
  title: "Shop by Category | Your Store",
  description:
    "Browse our complete collection of product categories. Find exactly what you're looking for.",
};

async function getCategories(): Promise<ICategory[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/categories`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      console.error(
        `Failed to fetch categories: ${res.status} ${res.statusText}`
      );
      return [];
    }

    const data: CategoriesResponse = await res.json();
    return data.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Category card component
const CategoryCard = ({ category }: { category: ICategory }) => (
  <Link href={`/products?category=${category.slug}`} className="group">
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
      {/* Category image */}
      <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            width={500} // set an appropriate width
            height={500} // set an appropriate height
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw" // adjust for responsive behavior
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
        )}

        {/* Product count badge */}
        {category.product_count !== undefined && (
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
              {category.product_count}{" "}
              {category.product_count === 1 ? "item" : "items"}
            </span>
          </div>
        )}
      </div>

      {/* Category info */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 mb-2">
          {category.name}
        </h3>

        {category.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {category.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>/{category.slug}</span>
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  </Link>
);

// Empty state component
const EmptyState = () => (
  <div className="text-center py-16">
    <div className="mb-6">
      <svg
        className="mx-auto h-24 w-24 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    </div>

    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No categories found
    </h3>
    <p className="text-gray-600 mb-6">
      It looks like there are no product categories available at the moment.
    </p>

    <Link href="/products">
      <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
        Browse All Products
      </button>
    </Link>
  </div>
);

// // Loading skeleton component
// const LoadingSkeleton = () => (
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//     {Array.from({ length: 8 }).map((_, index) => (
//       <div
//         key={index}
//         className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
//       >
//         <div className="aspect-video bg-gray-200 animate-pulse" />
//         <div className="p-5">
//           <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
//           <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-3/4" />
//           <div className="flex justify-between">
//             <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
//             <div className="h-3 bg-gray-200 rounded animate-pulse w-4" />
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// );

export default async function CategoriesPage() {
  const categories = await getCategories();

  // Filter only active categories and sort them
  const activeCategories = categories
    .filter((category) => category.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Shop by Category
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our complete collection organized by category. Find
              exactly what you&rsquo;re looking for.
            </p>

            {activeCategories.length > 0 && (
              <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {activeCategories.length}{" "}
                  {activeCategories.length === 1 ? "Category" : "Categories"}
                </div>

                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4h4v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Free Shipping Available
                </div>

                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Quality Guaranteed
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeCategories.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeCategories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        )}
      </div>

      {/* Call to Action Section */}
      {activeCategories.length > 0 && (
        <div className="bg-indigo-50 border-t border-indigo-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Can&lsquo;t find what you&lsquo;re looking for?
              </h2>
              <p className="text-gray-600 mb-6">
                Browse all products or get in touch with our customer service
                team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                    View All Products
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors duration-200">
                    Contact Support
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
