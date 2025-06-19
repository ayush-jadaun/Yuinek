// src/components/forms/CategoryForm.tsx

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ICategory } from "@/models/Category";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface CategoryFormProps {
  category?: ICategory; // Optional category for editing
}

type FormData = {
  name: string;
  description: string;
  is_active: boolean;
};

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: category?.name || "",
    description: category?.description || "",
    is_active: category?.is_active ?? true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const apiEndpoint = category
      ? `/api/categories/${category._id}`
      : "/api/categories";
    const method = category ? "PUT" : "POST";

    try {
      const res = await fetch(apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || `Failed to ${category ? "update" : "create"} category.`
        );
      }

      router.push("/admin/categories");
      router.refresh(); // Important to see the changes in the list
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 divide-y divide-gray-200"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {category ? "Edit Category" : "New Category"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the category details.
          </p>
        </div>

        <div className="sm:col-span-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Category Name
          </label>
          <Input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="sm:col-span-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <div className="relative flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="is_active" className="font-medium text-gray-700">
              Category is Active
            </label>
            <p className="text-gray-500">
              Inactive categories will not be visible in the store.
            </p>
          </div>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <div className="pt-5">
        <div className="flex justify-end gap-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Category"}
          </Button>
        </div>
      </div>
    </form>
  );
}
