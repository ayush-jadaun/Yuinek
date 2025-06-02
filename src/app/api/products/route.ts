import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import mongoose from "mongoose";

// GET /api/product?type=sneakers or /api/product?id=PRODUCT_ID
export async function GET(request: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  try {
    // Search by ID
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "Invalid product id" },
          { status: 400 }
        );
      }
      const product = await Product.findById(id).lean();
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ product }, { status: 200 });
    }

    // Search by type or get all products
    const query: any = {};

    if (type) {
      // Validate type against allowed values
      const validTypes = ["formal", "sneakers", "loafers", "school", "sandals"];
      if (!validTypes.includes(type.toLowerCase())) {
        return NextResponse.json(
          {
            error: `Invalid product type. Valid types are: ${validTypes.join(
              ", "
            )}`,
          },
          { status: 400 }
        );
      }
      query.type = type.toLowerCase();
    }

    // Only return active products by default
    query.isActive = true;

    console.log("Search query:", query); // Debug log

    const products = await Product.find(query).lean();

    console.log(`Found ${products.length} products`); // Debug log

    return NextResponse.json(
      {
        products,
        count: products.length,
        query: query, // Include query in response for debugging
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Database error:", error); // Debug log
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/product
export async function POST(request: NextRequest) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      stock,
      images,
      categoryId,
      type,
      variants,
      isActive = true,
    } = body;

    if (!name || !price || !categoryId || !type) {
      return NextResponse.json(
        { error: "Missing required fields: name, price, categoryId, type" },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ["formal", "sneakers", "loafers", "school", "sandals"];
    if (!validTypes.includes(type.toLowerCase())) {
      return NextResponse.json(
        {
          error: `Invalid product type. Valid types are: ${validTypes.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock: stock || 0,
      images: images || [],
      categoryId,
      type: type.toLowerCase(),
      variants: variants || [],
      isActive,
    });

    return NextResponse.json(
      { message: "Product created successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/product?id=PRODUCT_ID
export async function PATCH(request: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid or missing product id" },
      { status: 400 }
    );
  }

  try {
    const update = await request.json();

    // Validate type if it's being updated
    if (update.type) {
      const validTypes = ["formal", "sneakers", "loafers", "school", "sandals"];
      if (!validTypes.includes(update.type.toLowerCase())) {
        return NextResponse.json(
          {
            error: `Invalid product type. Valid types are: ${validTypes.join(
              ", "
            )}`,
          },
          { status: 400 }
        );
      }
      update.type = update.type.toLowerCase();
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/product?id=PRODUCT_ID
export async function DELETE(request: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid or missing product id" },
      { status: 400 }
    );
  }

  try {
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product deleted successfully", product: deleted },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product", details: error.message },
      { status: 500 }
    );
  }
}
