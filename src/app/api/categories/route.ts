import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Category from "@/models/Category";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const parentId = searchParams.get("parentId");

    let query: any = {};

    if (!includeInactive) {
      query.is_active = true;
    }

    if (parentId) {
      query.parent_id = parentId === "null" ? null : parentId;
    }

    const categories = await Category.find(query)
      .populate("parent_id", "name slug")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const data = await request.json();

    // Create slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const category = await Category.create({
      ...data,
      slug,
    });

    const populatedCategory = await Category.findById(category._id).populate(
      "parent_id",
      "name slug"
    );

    return NextResponse.json(
      {
        message: "Category created successfully",
        category: populatedCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Categories POST error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
