import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Size from "@/models/Size";
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
      return NextResponse.json({ error: "Invalid size ID" }, { status: 400 });
    }

    const size = await Size.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!size) {
      return NextResponse.json({ error: "Size not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Size updated successfully",
      size,
    });
  } catch (error) {
    console.error("Size PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update size" },
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
      return NextResponse.json({ error: "Invalid size ID" }, { status: 400 });
    }

    const size = await Size.findByIdAndDelete(id);

    if (!size) {
      return NextResponse.json({ error: "Size not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Size deleted successfully",
    });
  } catch (error) {
    console.error("Size DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete size" },
      { status: 500 }
    );
  }
}
