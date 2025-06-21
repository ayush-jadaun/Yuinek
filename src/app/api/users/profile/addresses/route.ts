import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { verifyAccessToken, JWTPayload } from "@/lib/auth/jwt";
import User from "@/models/User";

export async function POST(request: NextRequest) {
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

    const addressData = await request.json();

    // If this is set as default, unset other default addresses
    if (addressData.is_default) {
      await User.updateOne(
        { _id: payload.userId },
        { $set: { "addresses.$[].is_default": false } }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { $push: { addresses: addressData } },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      message: "Address added successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Address POST error:", error);
    return NextResponse.json(
      { error: "Failed to add address" },
      { status: 500 }
    );
  }
}
