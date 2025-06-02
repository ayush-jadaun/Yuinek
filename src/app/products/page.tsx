// app/products/page.tsx - All Products Page
import Link from "next/link";
import Image from "next/image";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

const PRODUCT_TYPES = [
  { type: "formal", label: "Formal Shoes" },
  { type: "sneakers", label: "Sneakers" },
  { type: "loafers", label: "Loafers" },
  { type: "school", label: "School Shoes" },
  { type: "sandals", label: "Sandals" },
];

export default async function ProductsPage() {
  await connectToDatabase();
  const products = await Product.find({ isActive: true }).limit(12).lean();

  return (
    <main className="max-w-7xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-yellow-800">Our Products</h1>
        <p className="text-gray-600 mt-2">
          Browse our complete shoe collection
        </p>
      </div>

      {/* Category Links */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-yellow-800 mb-4">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {PRODUCT_TYPES.map(({ type, label }) => (
            <Link
              key={type}
              href={`/products/${type}`}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium px-4 py-3 rounded-lg text-center transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-yellow-800 mb-4">
          Featured Products
        </h2>
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
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {product.type}
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
      </div>
    </main>
  );
}
