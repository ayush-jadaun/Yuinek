import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { verifyAccessToken, JWTPayload } from "@/lib/auth/jwt";
import User from "@/models/User";
import mongoose from "mongoose";

interface Params {
  id: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();

    const token = request.cookies.get("accessToken")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const payload: JWTPayload | null = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { id } = params;
    const addressData = await request.json();

    // If this is set as default, unset other default addresses
    if (addressData.is_default) {
      await User.updateOne(
        { _id: payload.userId },
        { $set: { "addresses.$[].is_default": false } }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: payload.userId,
        "addresses._id": new mongoose.Types.ObjectId(id),
      },
      {
        $set: {
          "addresses.$": {
            ...addressData,
            _id: new mongoose.Types.ObjectId(id),
          },
        },
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Address updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Address PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();

    const token = request.cookies.get("accessToken")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const payload: JWTPayload | null = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { id } = params;

    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { $pull: { addresses: { _id: new mongoose.Types.ObjectId(id) } } },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Address deleted successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Address DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
