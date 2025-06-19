// src/app/(shop)/categories/[slug]/page.tsx

import ProductGrid from "@/components/product/ProductGrid";
import { IProduct } from "@/models/Product";
import { ICategory } from "@/models/Category";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: { slug: string };
}

async function getCategoryData(slug: string) {
  try {
    const apiUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    // Fetch products for this category
    const productsRes = await fetch(`${apiUrl}/api/products?category=${slug}`, {
      next: { revalidate: 60 },
    });
    if (!productsRes.ok)
      throw new Error("Failed to fetch products for category");
    const productsData = await productsRes.json();

    // Fetch the category details itself (to get the name, description)
    // A better way would be a new API endpoint /api/categories/[slug]
    const categoriesRes = await fetch(`${apiUrl}/api/categories`);
    const allCategoriesData = await categoriesRes.json();
    const categoryDetails = allCategoriesData.categories.find(
      (c: ICategory) => c.slug === slug
    );

    return {
      products: productsData.products,
      category: categoryDetails,
    };
  } catch (error) {
    console.error(`[GET_CATEGORY_DATA_ERROR: ${slug}]`, error);
    return { products: [], category: null };
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await getCategoryData(params.slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description: `Shop for products in the ${category.name} category.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { products, category } = await getCategoryData(params.slug);

  if (!category) {
    return <p className="text-center">Category not found.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {category.name}
      </h1>
      <p className="mt-4 text-base text-gray-500">
        {category.description ||
          `Browse all products in our ${category.name} collection.`}
      </p>

      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
