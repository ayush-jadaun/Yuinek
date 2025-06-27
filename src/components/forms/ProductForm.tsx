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
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

// Define interfaces
interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
  is_active: boolean;
}

interface ColorOption {
  _id: string;
  name: string;
  hex_code?: string;
}

interface SizeOption {
  _id: string;
  us_size: string;
  eu_size?: string;
  uk_size?: string;
  cm_size?: number;
  gender: "men" | "women" | "kids";
}

interface ProductVariant {
  color_id: string;
  size_id: string;
  sku: string;
  price_adjustment: number;
  stock_quantity: number;
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
  variants: ProductVariant[];
};

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { images, addImages, removeImage, uploadAllImages } = useImageUpload();

  // SAFELY EXTRACT CATEGORY_ID AS STRING
  const getCategoryIdString = (cat: unknown): string => {
    if (typeof cat === "string") return cat;
    if (
      typeof cat === "object" &&
      cat !== null &&
      "_id" in cat &&
      typeof (cat as any)._id === "string"
    ) {
      return (cat as any)._id;
    }
    return "";
  };

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
    category_id: getCategoryIdString(product?.category_id),
    is_featured: product?.is_featured ?? false,
    is_active: product?.is_active ?? true,
    stock_status: product?.stock_status || "in_stock",
    manage_stock: product?.manage_stock ?? true,
    stock_quantity: product?.stock_quantity || 0,
    low_stock_threshold: product?.low_stock_threshold || 5,
    meta_title: product?.meta_title || "",
    meta_description: product?.meta_description || "",
    variants:
      product?.variants?.map((v) => ({
        color_id:
          typeof v.color_id === "object" &&
          v.color_id !== null &&
          "_id" in v.color_id
            ? String((v.color_id as any)._id)
            : String(v.color_id),
        size_id:
          typeof v.size_id === "object" &&
          v.size_id !== null &&
          "_id" in v.size_id
            ? String((v.size_id as any)._id)
            : String(v.size_id),
        sku: v.sku || "",
        price_adjustment: v.price_adjustment || 0,
        stock_quantity: v.stock_quantity || 0,
      })) || [],
  });

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [sizes, setSizes] = useState<SizeOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories, colors, and sizes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, colorsRes, sizesRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/admin/colors"),
          fetch("/api/admin/sizes"),
        ]);
        let categoriesData: { categories: CategoryOption[] } = {
          categories: [],
        };
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData.categories || []);
          if (
            !product &&
            categoriesData.categories?.length > 0 &&
            !formData.category_id
          ) {
            setFormData((prev) => ({
              ...prev,
              category_id: categoriesData.categories[0]._id,
            }));
          }
        }

        if (colorsRes.ok) {
          const colorsData = await colorsRes.json();
          setColors(colorsData.colors || []);
        }

        if (sizesRes.ok) {
          const sizesData = await sizesRes.json();
          setSizes(sizesData.sizes || []);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load form data");
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate product code for new products
  useEffect(() => {
    if (!product && formData.product_code === 0) {
      setFormData((prev) => ({
        ...prev,
        product_code: generateProductCode(),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Variant management functions
  const addVariant = () => {
    if (colors.length === 0 || sizes.length === 0) {
      setError("Please add colors and sizes first in the admin panel");
      return;
    }

    const newVariant: ProductVariant = {
      color_id: colors[0]._id,
      size_id: sizes[0]._id,
      sku: `${formData.product_code}-${colors[0].name}-${sizes[0].us_size}`.toUpperCase(),
      price_adjustment: 0,
      stock_quantity: 0,
    };

    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const updateVariant = (
    index: number,
    field: keyof ProductVariant,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) => {
        if (i === index) {
          const updated = { ...variant, [field]: value };

          // Auto-generate SKU when color or size changes
          if (field === "color_id" || field === "size_id") {
            const color = colors.find(
              (c) => c._id === (field === "color_id" ? value : variant.color_id)
            );
            const size = sizes.find(
              (s) => s._id === (field === "size_id" ? value : variant.size_id)
            );
            if (color && size) {
              updated.sku =
                `${formData.product_code}-${color.name}-${size.us_size}`.toUpperCase();
            }
          }

          return updated;
        }
        return variant;
      }),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateProductForm(formData);
    if (!validation.isValid) {
      setError(validation.errors.join(", "));
      return;
    }

    // Validate variants
    if (formData.variants.length === 0) {
      setError(
        "Please add at least one product variant (color and size combination)"
      );
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
        category_id: getCategoryIdString(formData.category_id),
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
    categories.length > 0 && colors.length > 0 && sizes.length > 0;

  if (!isFormReady && !error) {
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

          {/* Product Variants Section */}
          <div className="sm:col-span-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  Product Variants
                </h4>
                <p className="text-sm text-gray-500">
                  Add different color and size combinations for this product
                </p>
              </div>
              <Button
                type="button"
                onClick={addVariant}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add Variant
              </Button>
            </div>

            {formData.variants.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-500">
                  No variants added yet. Click "Add Variant" to create color and
                  size combinations.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Color
                        </label>
                        <select
                          value={variant.color_id}
                          onChange={(e) =>
                            updateVariant(index, "color_id", e.target.value)
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          {colors.map((color) => (
                            <option key={color._id} value={color._id}>
                              {color.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Size
                        </label>
                        <select
                          value={variant.size_id}
                          onChange={(e) =>
                            updateVariant(index, "size_id", e.target.value)
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          {sizes.map((size) => (
                            <option key={size._id} value={size._id}>
                              {size.us_size} US ({size.gender})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Price Adj.
                        </label>
                        <Input
                          type="number"
                          value={variant.price_adjustment}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "price_adjustment",
                              Number(e.target.value)
                            )
                          }
                          step="0.01"
                          placeholder="0.00"
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Stock
                        </label>
                        <Input
                          type="number"
                          value={variant.stock_quantity}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "stock_quantity",
                              Number(e.target.value)
                            )
                          }
                          min="0"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">SKU:</span> {variant.sku}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

      {colors.length === 0 || sizes.length === 0 ? (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Setup Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  You need to add colors and sizes first before creating
                  products. Visit the{" "}
                  <a href="/admin/colors" className="underline">
                    Colors
                  </a>{" "}
                  and{" "}
                  <a href="/admin/sizes" className="underline">
                    Sizes
                  </a>{" "}
                  sections to set them up.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="pt-5">
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              isLoading || !isFormReady || formData.variants.length === 0
            }
          >
            {isLoading
              ? "Saving..."
              : `${product ? "Update" : "Create"} Product`}
          </Button>
        </div>
      </div>
    </form>
  );
}
