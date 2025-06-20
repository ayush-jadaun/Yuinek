import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Size from "@/models/Size";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const gender = searchParams.get("gender");
    const limit = parseInt(searchParams.get("limit") || "50");

    let query = {};
    if (gender) {
      query = { gender };
    }

    const sizes = await Size.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ sizes });
  } catch (error) {
    console.error("Sizes GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sizes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const data = await request.json();
    const { us_size, eu_size, uk_size, cm_size, gender } = data;

    // Check if size already exists for this gender
    const existingSize = await Size.findOne({ us_size, gender });
    if (existingSize) {
      return NextResponse.json(
        { error: "Size already exists for this gender" },
        { status: 400 }
      );
    }

    const size = new Size({
      us_size,
      eu_size,
      uk_size,
      cm_size,
      gender,
    });

    await size.save();

    return NextResponse.json({
      message: "Size created successfully",
      size,
    });
  } catch (error) {
    console.error("Size POST error:", error);
    return NextResponse.json(
      { error: "Failed to create size" },
      { status: 500 }
    );
  }
}
