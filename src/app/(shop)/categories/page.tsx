import React from "react";

async function getCategories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/categories`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.categories || [];
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat: any) => (
            <li key={cat._id} className="p-2 border rounded">
              <div className="font-semibold">{cat.name}</div>
              <div className="text-gray-500 text-sm">Slug: {cat.slug}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
