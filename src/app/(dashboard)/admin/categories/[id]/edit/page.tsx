// src/app/(dashboard)/admin/categories/[id]/edit/page.tsx

import CategoryForm from "@/components/forms/CategoryForm";
import { ICategory } from "@/models/Category";

async function getCategory(id: string): Promise<ICategory | null> {
  try {
    const apiUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/api/categories/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.category;
  } catch (error) {
    return null;
  }
}

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await getCategory(params.id);

  if (!category) {
    return <p>Category not found.</p>;
  }

  return (
    <div>
      <CategoryForm category={category} />
    </div>
  );
}
