// app/products/[type]/page.tsx - Fixed Products by Type Page
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

const VALID_TYPES = ["formal", "sneakers", "loafers", "school", "sandals"];

export default async function ProductsByTypePage({
  params,
}: {
  params: Promise<{ type: string }>; // Changed to Promise
}) {
  // Await the params
  const { type } = await params;

  console.log("Product type requested:", type); // Debug log

  if (!VALID_TYPES.includes(type.toLowerCase())) {
    console.log("Invalid product type:", type);
    return notFound();
  }

  await connectToDatabase();

  try {
    const products = await Product.find({
      type: type.toLowerCase(),
      isActive: true,
    }).lean();

    console.log(`Found ${products.length} products for type: ${type}`); // Debug log

    if (!products.length) {
      console.log("No products found for type:", type);
      return notFound();
    }

    return (
      <main className="max-w-7xl mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yellow-800 capitalize">
            {type} Collection
          </h1>
          <p className="text-gray-600 mt-2">
            Discover our {type} collection ({products.length} items)
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div
              key={product._id.toString()}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="bg-yellow-50 w-full h-full flex items-center justify-center text-yellow-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="text-xl font-bold text-yellow-600 mb-2">
                  ₹{product.price.toLocaleString()}
                </div>
                {product.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      product.stock > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                  <Link
                    href={`/product/${product._id}`}
                    className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-medium px-4 py-2 rounded text-sm transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/products"
            className="text-yellow-700 hover:underline inline-flex items-center gap-1"
          >
            <span>&larr;</span>
            <span>Back to All Products</span>
          </Link>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Database error:", error);
    return notFound();
  }
}
