import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import mongoose from "mongoose";

// Import ALL models to ensure they're registered BEFORE using them
import Product from "@/models/Product";
import Category from "@/models/Category";
import Size from "@/models/Size";
import Color from "@/models/Color";
import User from "@/models/User";

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    await connectDB();

    // Await params before using
    const { id } = await params;

    // Check if it's a valid ObjectId or slug
    let product;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product || !product.is_active) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Try to populate, but if it fails, return the product without population
    try {
      const populatedProduct = await Product.findById(product._id)
        .populate("category_id", "name slug")
        .populate({
          path: "variants.size_id",
          select: "us_size eu_size uk_size cm_size gender",
          model: "Size", // Explicitly specify the model
        })
        .populate({
          path: "variants.color_id",
          select: "name hex_code",
          model: "Color", // Explicitly specify the model
        })
        .lean();

      return NextResponse.json({ product: populatedProduct });
    } catch (populateError) {
      console.error("Population error:", populateError);
      // Return the basic product without population if populate fails
      return NextResponse.json({ product: product.toObject() });
    }
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
  { params }: { params: Promise<Params> }
) {
  try {
    await connectDB();

    // Await params before using
    const { id } = await params;
    const data = await request.json();

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate("category_id", "name slug");

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
  { params }: { params: Promise<Params> }
) {
  try {
    await connectDB();

    // Await params before using
    const { id } = await params;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Soft delete - set is_active to false
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


