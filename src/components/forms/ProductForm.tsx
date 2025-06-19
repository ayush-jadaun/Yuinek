// src/components/forms/ProductForm.tsx

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { IProduct } from "@/models/Product";
import { ICategory } from "@/models/Category";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ProductFormProps {
  product?: IProduct; // Optional product for editing
}

type FormData = {
  name: string;
  description: string;
  base_price: number;
  category_id: string; // This must be a valid ObjectId string
  is_active: boolean;
  stock_quantity: number;
  // Add other fields as needed
};

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: product?.name || "",
    description: product?.description || "",
    base_price: product?.base_price || 0,
    // Initialize with the product's category ID, or an empty string temporarily.
    // The useEffect below will fix this for new products.
    category_id: product?.category_id?._id || "",
    is_active: product?.is_active ?? true,
    stock_quantity: product?.stock_quantity || 0,
  });
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();

        setCategories(data.categories);

        // ==================== THE FIX IS HERE ====================
        // If this is a NEW product form (product prop is undefined) AND
        // we have successfully fetched categories AND
        // the current category_id in state is not valid...
        if (!product && data.categories.length > 0) {
          // ...then set the category_id in the form data to the ID of the FIRST category in the list.
          // This ensures we never try to submit an empty string for the category_id.
          setFormData((prev) => ({
            ...prev,
            category_id: data.categories[0]._id,
          }));
        }
        // ========================================================
      } catch (err) {
        setError("Could not load categories. Please try again.");
      }
    };
    fetchCategories();
  }, [product]); // Dependency array is correct. It runs once when the component mounts.

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

    // Add a validation check before submitting
    if (!formData.category_id) {
      setError("Please select a category.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const apiEndpoint = product
      ? `/api/products/${product._id}`
      : "/api/products";
    const method = product ? "PUT" : "POST";

    try {
      const res = await fetch(apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || `Failed to ${product ? "update" : "create"} product.`
        );
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Prevent form submission if categories haven't loaded for a new product
  const isFormReady =
    product || (categories.length > 0 && formData.category_id);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 divide-y divide-gray-200"
    >
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {product ? "Edit Product" : "New Product"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* ... other form fields are fine ... */}
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Product Name
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
                rows={5}
                value={formData.description}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              ></textarea>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="base_price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <Input
                type="number"
                name="base_price"
                id="base_price"
                value={formData.base_price}
                onChange={handleChange}
                required
                step="0.01"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="stock_quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Stock Quantity
              </label>
              <Input
                type="number"
                name="stock_quantity"
                id="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="category_id"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              {/* Disable the select until categories are loaded */}
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                disabled={categories.length === 0}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
              >
                {categories.length === 0 && <option>Loading...</option>}
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-6">
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
                  <label
                    htmlFor="is_active"
                    className="font-medium text-gray-700"
                  >
                    Product is Active
                  </label>
                  <p className="text-gray-500">
                    Inactive products will not be visible in the store.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <Button
            type="submit"
            className="ml-3"
            disabled={isLoading || !isFormReady}
          >
            {isLoading ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>
    </form>
  );
}
