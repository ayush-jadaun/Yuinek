import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Color from "@/models/Color";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const colors = await Color.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ colors });
  } catch (error) {
    console.error("Colors GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch colors" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const data = await request.json();
    const { name, hex_code } = data;

    // Check if color already exists
    const existingColor = await Color.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingColor) {
      return NextResponse.json(
        { error: "Color with this name already exists" },
        { status: 400 }
      );
    }

    const color = new Color({
      name,
      hex_code,
    });

    await color.save();

    return NextResponse.json({
      message: "Color created successfully",
      color,
    });
  } catch (error) {
    console.error("Color POST error:", error);
    return NextResponse.json(
      { error: "Failed to create color" },
      { status: 500 }
    );
  }
}
