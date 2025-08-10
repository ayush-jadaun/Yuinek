import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import mongoose from "mongoose";

// Import ALL referenced models so Mongoose registers them
import "@/models/Category";
import "@/models/Size";
import "@/models/Color";
import Product from "@/models/Product";

interface Params {
  id: string;
}

interface VariantUpdate {
  size_id: string | { _id: string };
  color_id: string | { _id: string };
  stock_quantity: number;
  price_adjustment: number;
  is_active: boolean;
  sku: string;
}

interface ProductUpdateData {
  name?: string;
  product_code?: number;
  category_id?: string | { _id: string };
  description?: string;
  short_description?: string;
  base_price?: number;
  sale_price?: number;
  cost_price?: number;
  weight?: number;
  slug?: string;
  is_featured?: boolean;
  is_active?: boolean;
  stock_status?: "in_stock" | "out_of_stock" | "pre_order";
  manage_stock?: boolean;
  stock_quantity?: number;
  low_stock_threshold?: number;
  images?: Array<{
    color_id?: string;
    image_url: string;
    alt_text?: string;
    is_primary: boolean;
  }>;
  variants?: VariantUpdate[];
  meta_title?: string;
  meta_description?: string;
  updatedAt?: Date;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { slug: id };

    const product = await Product.findOne(query)
      .populate("category_id", "name slug")
      .populate({
        path: "variants.size_id",
        select: "us_size eu_size uk_size cm_size gender",
      })
      .populate({
        path: "variants.color_id",
        select: "name hex_code",
      })
      .populate({
        path: "images.color_id",
        select: "name hex_code",
      })
      .lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const data: ProductUpdateData = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const updateData: ProductUpdateData = { ...data, updatedAt: new Date() };

    if (updateData.category_id) {
      if (
        typeof updateData.category_id === "object" &&
        updateData.category_id !== null &&
        "_id" in updateData.category_id
      ) {
        updateData.category_id = updateData.category_id._id;
      }
      if (
        typeof updateData.category_id === "string" &&
        !mongoose.Types.ObjectId.isValid(updateData.category_id)
      ) {
        return NextResponse.json(
          { error: "Invalid category id" },
          { status: 400 }
        );
      }
    }

    if (Array.isArray(updateData.variants)) {
      updateData.variants = updateData.variants.map((variant) => {
        const newVariant = { ...variant };
        if (
          newVariant.size_id &&
          typeof newVariant.size_id === "object" &&
          "_id" in newVariant.size_id
        ) {
          newVariant.size_id = newVariant.size_id._id;
        }
        if (
          newVariant.color_id &&
          typeof newVariant.color_id === "object" &&
          "_id" in newVariant.color_id
        ) {
          newVariant.color_id = newVariant.color_id._id;
        }
        return newVariant;
      });
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category_id", "name slug");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Product PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { is_active: false, updatedAt: new Date() },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Product DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
