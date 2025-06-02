// app/product/[id]/page.tsx - Fixed Individual Product Page
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import mongoose from "mongoose";

interface ProductVariant {
  name: string;
  value: string;
  stock: number;
  priceAdjustment: number;
}

interface ProductData {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  type: "formal" | "sneakers" | "loafers" | "school" | "sandals";
  variants: ProductVariant[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>; // Changed to Promise
}) {
  // Await the params
  const { id } = await params;

  console.log("Product ID requested:", id); // Debug log

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid ObjectId:", id);
    return notFound();
  }

  await connectToDatabase();

  try {
    const product = await Product.findById(id).lean();

    console.log("Product found:", product ? "Yes" : "No"); // Debug log

    if (!product) {
      console.log("Product not found in database");
      return notFound();
    }

    // Transform the MongoDB document to match our interface
    const data: ProductData = {
      _id: product._id.toString(),
      name: product.name,
      description: product.description || undefined,
      price: product.price,
      stock: product.stock,
      images: product.images || [],
      categoryId: product.categoryId.toString(),
      type: product.type,
      variants: product.variants || [],
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    return (
      <main className="max-w-5xl mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Images */}
          <div className="flex-1">
            {data.images.length > 0 ? (
              <Image
                src={data.images[0]}
                alt={data.name}
                width={480}
                height={480}
                className="rounded-lg object-cover w-full"
                priority
              />
            ) : (
              <div className="bg-yellow-50 w-full h-96 rounded-lg flex items-center justify-center text-yellow-400">
                No Image
              </div>
            )}

            {/* Thumbnails */}
            {data.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {data.images.slice(1).map((img, idx) => (
                  <Image
                    key={`thumbnail-${idx}`}
                    src={img}
                    alt={`${data.name} thumbnail ${idx + 2}`}
                    width={80}
                    height={80}
                    className="rounded border object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-yellow-800">{data.name}</h1>
            <div className="text-xl text-yellow-600 font-semibold">
              ₹{data.price.toLocaleString()}
            </div>
            {data.description && (
              <div className="text-gray-700">{data.description}</div>
            )}
            <div>
              <span className="font-medium">Category:</span>{" "}
              <span className="capitalize">{data.type}</span>
            </div>
            {data.variants.length > 0 && (
              <div>
                <div className="font-medium mb-1">Available Variants:</div>
                <ul className="flex flex-wrap gap-2">
                  {data.variants.map((variant, idx) => (
                    <li
                      key={`variant-${idx}`}
                      className="border rounded px-2 py-1 text-sm bg-yellow-50 text-yellow-700"
                    >
                      {variant.name}: {variant.value}{" "}
                      {variant.priceAdjustment !== 0 && (
                        <span>
                          (₹{variant.priceAdjustment > 0 ? "+" : ""}
                          {variant.priceAdjustment})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <span className="font-medium">Stock:</span>{" "}
              <span
                className={data.stock > 0 ? "text-green-600" : "text-red-500"}
              >
                {data.stock > 0 ? `${data.stock} available` : "Out of Stock"}
              </span>
            </div>
            <button
              className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-6 py-2 rounded transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={data.stock === 0}
              type="button"
            >
              {data.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            <div className="mt-6">
              <Link
                href="/products"
                className="text-yellow-700 hover:underline inline-flex items-center gap-1"
              >
                <span>&larr;</span>
                <span>Back to Products</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Database error:", error);
    return notFound();
  }
}

// ==========================================

