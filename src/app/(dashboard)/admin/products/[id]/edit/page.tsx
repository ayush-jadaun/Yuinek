// src/app/(dashboard)/admin/products/[id]/edit/page.tsx

import ProductForm from "@/components/forms/ProductForm";
import { IProduct } from "@/models/Product";

async function getProduct(id: string): Promise<IProduct | null> {
  try {
    const apiUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/api/products/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product;
  } catch (error) {
    return null;
  }
}

interface EditProductPageProps {
  params: Promise<{ id: string }>; // ✅ Changed to Promise
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
 
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div>
      <ProductForm product={product} />
    </div>
  );
}
