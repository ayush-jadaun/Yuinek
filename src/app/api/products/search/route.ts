import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const queryString = (searchParams.get("q") || "").trim();
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const category = searchParams.get("category");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    let query: any = { is_active: true };

    if (queryString) {
      query.$or = [
        { name: { $regex: queryString, $options: "i" } },
        { description: { $regex: queryString, $options: "i" } },
      ];
    }

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category_id = categoryDoc._id;
      }
    }

    if (minPrice || maxPrice) {
      query.base_price = {};
      if (minPrice) query.base_price.$gte = parseFloat(minPrice);
      if (maxPrice) query.base_price.$lte = parseFloat(maxPrice);
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Sorting
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Query products
    const products = await Product.find(query)
      .populate("category_id", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Product search error:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}
