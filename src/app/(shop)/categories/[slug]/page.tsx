import ProductGrid from "@/components/product/ProductGrid";
import { ICategory } from "@/models/Category";
import { IProduct } from "@/models/Product";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: { slug: string };
}

async function getCategoryData(slug: string) {
  try {
    const apiUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const productsRes = await fetch(`${apiUrl}/api/products?category=${slug}`, {
      next: { revalidate: 60 },
    });
    if (!productsRes.ok)
      throw new Error("Failed to fetch products for category");
    const productsData: { products: IProduct[] } = await productsRes.json();

    const categoriesRes = await fetch(`${apiUrl}/api/categories`);
    if (!categoriesRes.ok) throw new Error("Failed to fetch categories");
    const allCategoriesData: { categories: ICategory[] } =
      await categoriesRes.json();

    const categoryDetails = allCategoriesData.categories.find(
      (c) => c.slug === slug
    );

    return {
      products: productsData.products,
      category: categoryDetails ?? null,
    };
  } catch (error) {
    console.error(`[GET_CATEGORY_DATA_ERROR: ${slug}]`, error);
    return { products: [], category: null };
  }
}

export async function generateMetadata(
  props: Promise<CategoryPageProps> // ✅ params is async now
): Promise<Metadata> {
  const { params } = await props; // ✅ must await
  const { category } = await getCategoryData(params.slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: category.name,
    description: `Shop for products in the ${category.name} category.`,
  };
}

export default async function CategoryPage(
  props: Promise<CategoryPageProps> // ✅ params is async now
) {
  const { params } = await props; // ✅ must await
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
