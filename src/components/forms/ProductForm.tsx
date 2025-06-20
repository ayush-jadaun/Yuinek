"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { IProduct } from "@/models/Product";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUpload } from "@/components/product/ImageUpload";
import { useImageUpload } from "@/hooks/useImageUpload";
import { generateSlug, generateProductCode } from "@/lib/utils/slug";
import { validateProductForm } from "@/lib/utils/validation";

// Define a clean interface for categories in the form
interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
  is_active: boolean;
}

interface ProductFormProps {
  product?: IProduct;
}

type FormData = {
  name: string;
  product_code: number;
  description: string;
  short_description: string;
  base_price: number;
  sale_price: number;
  cost_price: number;
  weight: number;
  slug: string;
  category_id: string;
  is_featured: boolean;
  is_active: boolean;
  stock_status: "in_stock" | "out_of_stock" | "pre_order";
  manage_stock: boolean;
  stock_quantity: number;
  low_stock_threshold: number;
  meta_title: string;
  meta_description: string;
};

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { images, addImages, removeImage, uploadAllImages } = useImageUpload();

  const [formData, setFormData] = useState<FormData>({
    name: product?.name || "",
    product_code: product?.product_code || 0,
    description: product?.description || "",
    short_description: product?.short_description || "",
    base_price: product?.base_price || 0,
    sale_price: product?.sale_price || 0,
    cost_price: product?.cost_price || 0,
    weight: product?.weight || 0,
    slug: product?.slug || "",
    category_id: product?.category_id?.toString() || "",
    is_featured: product?.is_featured ?? false,
    is_active: product?.is_active ?? true,
    stock_status: product?.stock_status || "in_stock",
    manage_stock: product?.manage_stock ?? true,
    stock_quantity: product?.stock_quantity || 0,
    low_stock_threshold: product?.low_stock_threshold || 5,
    meta_title: product?.meta_title || "",
    meta_description: product?.meta_description || "",
  });

  // Use the clean CategoryOption interface
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.error || `HTTP ${res.status}: Failed to fetch categories`
          );
        }

        const data = await res.json();

        if (!data.categories || !Array.isArray(data.categories)) {
          throw new Error("Invalid categories data received");
        }

        // Map the response to ensure we have the right types
        const categoriesWithStringIds = data.categories.map((cat: any) => ({
          _id: cat._id.toString(), // Ensure _id is a string
          name: cat.name,
          slug: cat.slug,
          is_active: cat.is_active,
        }));

        setCategories(categoriesWithStringIds);

        // Set default category for new products
        if (
          !product &&
          categoriesWithStringIds.length > 0 &&
          !formData.category_id
        ) {
          setFormData((prev) => ({
            ...prev,
            category_id: categoriesWithStringIds[0]._id,
          }));
        }
      } catch (err) {
        console.error("Categories fetch error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Could not load categories. Please try again."
        );
      }
    };

    fetchCategories();
  }, [product, formData.category_id]);

  // Generate product code for new products
  useEffect(() => {
    if (!product && formData.product_code === 0) {
      setFormData((prev) => ({
        ...prev,
        product_code: generateProductCode(),
      }));
    }
  }, [product]);

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
      const updates: Partial<FormData> = {
        [name]: type === "number" ? Number(value) : value,
      };

      // Auto-generate slug when name changes
      if (name === "name") {
        updates.slug = generateSlug(value);
        if (!formData.meta_title) {
          updates.meta_title = value;
        }
      }

      setFormData((prev) => ({ ...prev, ...updates }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateProductForm(formData);
    if (!validation.isValid) {
      setError(validation.errors.join(", "));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Upload images first
      let imageUrls: string[] = [];
      if (images.length > 0) {
        try {
          imageUrls = await uploadAllImages();
        } catch (uploadError) {
          throw new Error("Failed to upload images. Please try again.");
        }
      }

      // Prepare product data with images
      const productData = {
        ...formData,
        images: imageUrls.map((url, index) => ({
          image_url: url,
          alt_text: `${formData.name} - Image ${index + 1}`,
          is_primary: index === 0,
        })),
      };

      const apiEndpoint = product
        ? `/api/products/${product._id}`
        : "/api/products";
      const method = product ? "PUT" : "POST";

      const res = await fetch(apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
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
    } finally {
      setIsLoading(false);
    }
  };

  const isFormReady =
    product || (categories.length > 0 && formData.category_id);

  if (categories.length === 0 && !error) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 divide-y divide-gray-200"
    >
      <div className="space-y-8">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {product ? "Edit Product" : "New Product"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the details below to {product ? "update" : "create"} a
            product.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Basic Information */}
          <div className="sm:col-span-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name *
            </label>
            <Input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="product_code"
              className="block text-sm font-medium text-gray-700"
            >
              Product Code *
            </label>
            <Input
              type="number"
              name="product_code"
              id="product_code"
              value={formData.product_code}
              onChange={handleChange}
              required
              placeholder="Auto-generated"
            />
          </div>

          <div className="sm:col-span-6">
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700"
            >
              URL Slug *
            </label>
            <Input
              type="text"
              name="slug"
              id="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="product-url-slug"
              pattern="^[a-z0-9\-]+$"
              title="Only lowercase letters, numbers, and hyphens allowed"
            />
          </div>

          <div className="sm:col-span-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description *
            </label>
            <textarea
              name="description"
              id="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Detailed product description"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-6">
            <label
              htmlFor="short_description"
              className="block text-sm font-medium text-gray-700"
            >
              Short Description
            </label>
            <textarea
              name="short_description"
              id="short_description"
              rows={2}
              value={formData.short_description}
              onChange={handleChange}
              placeholder="Brief product summary"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Pricing */}
          <div className="sm:col-span-2">
            <label
              htmlFor="base_price"
              className="block text-sm font-medium text-gray-700"
            >
              Base Price * ($)
            </label>
            <Input
              type="number"
              name="base_price"
              id="base_price"
              value={formData.base_price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="sale_price"
              className="block text-sm font-medium text-gray-700"
            >
              Sale Price ($)
            </label>
            <Input
              type="number"
              name="sale_price"
              id="sale_price"
              value={formData.sale_price}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="cost_price"
              className="block text-sm font-medium text-gray-700"
            >
              Cost Price ($)
            </label>
            <Input
              type="number"
              name="cost_price"
              id="cost_price"
              value={formData.cost_price}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>

          {/* Category and Details */}
          <div className="sm:col-span-3">
            <label
              htmlFor="category_id"
              className="block text-sm font-medium text-gray-700"
            >
              Category *
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              disabled={categories.length === 0}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
            >
              {categories.length === 0 && <option value="">Loading...</option>}
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700"
            >
              Weight (kg)
            </label>
            <Input
              type="number"
              name="weight"
              id="weight"
              value={formData.weight}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>

          {/* Stock Management */}
          <div className="sm:col-span-3">
            <label
              htmlFor="stock_status"
              className="block text-sm font-medium text-gray-700"
            >
              Stock Status
            </label>
            <select
              id="stock_status"
              name="stock_status"
              value={formData.stock_status}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="pre_order">Pre Order</option>
            </select>
          </div>

          <div className="sm:col-span-2">
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
              min="0"
              disabled={!formData.manage_stock}
            />
          </div>

          <div className="sm:col-span-1">
            <label
              htmlFor="low_stock_threshold"
              className="block text-sm font-medium text-gray-700"
            >
              Low Stock Alert
            </label>
            <Input
              type="number"
              name="low_stock_threshold"
              id="low_stock_threshold"
              value={formData.low_stock_threshold}
              onChange={handleChange}
              min="0"
              disabled={!formData.manage_stock}
            />
          </div>

          {/* SEO */}
          <div className="sm:col-span-6">
            <label
              htmlFor="meta_title"
              className="block text-sm font-medium text-gray-700"
            >
              Meta Title
            </label>
            <Input
              type="text"
              name="meta_title"
              id="meta_title"
              value={formData.meta_title}
              onChange={handleChange}
              placeholder="SEO title for search engines"
            />
          </div>

          <div className="sm:col-span-6">
            <label
              htmlFor="meta_description"
              className="block text-sm font-medium text-gray-700"
            >
              Meta Description
            </label>
            <textarea
              name="meta_description"
              id="meta_description"
              rows={3}
              value={formData.meta_description}
              onChange={handleChange}
              placeholder="SEO description for search engines"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Image Upload */}
          <div className="sm:col-span-6">
            <ImageUpload
              images={images}
              onAddImages={addImages}
              onRemoveImage={removeImage}
            />
          </div>

          {/* Checkboxes */}
          <div className="sm:col-span-6 space-y-4">
            <div className="flex items-center">
              <input
                id="manage_stock"
                name="manage_stock"
                type="checkbox"
                checked={formData.manage_stock}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="manage_stock"
                className="ml-3 text-sm font-medium text-gray-700"
              >
                Manage Stock
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="is_featured"
                name="is_featured"
                type="checkbox"
                checked={formData.is_featured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="is_featured"
                className="ml-3 text-sm font-medium text-gray-700"
              >
                Featured Product
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="is_active"
                className="ml-3 text-sm font-medium text-gray-700"
              >
                Product is Active
              </label>
              <p className="ml-2 text-sm text-gray-500">
                (Inactive products will not be visible in the store)
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pt-5">
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !isFormReady}>
            {isLoading
              ? "Saving..."
              : `${product ? "Update" : "Create"} Product`}
          </Button>
        </div>
      </div>
    </form>
  );
}
