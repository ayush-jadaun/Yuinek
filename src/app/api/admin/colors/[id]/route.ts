import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Color from "@/models/Color";
import mongoose from "mongoose";

interface Params {
  id: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const data = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid color ID" }, { status: 400 });
    }

    const color = await Color.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!color) {
      return NextResponse.json({ error: "Color not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Color updated successfully",
      color,
    });
  } catch (error) {
    console.error("Color PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update color" },
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

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid color ID" }, { status: 400 });
    }

    const color = await Color.findByIdAndDelete(id);

    if (!color) {
      return NextResponse.json({ error: "Color not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Color deleted successfully",
    });
  } catch (error) {
    console.error("Color DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete color" },
      { status: 500 }
    );
  }
}
