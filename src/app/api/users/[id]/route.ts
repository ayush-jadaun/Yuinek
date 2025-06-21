import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { verifyAccessToken, JWTPayload } from "@/lib/auth/jwt";
import User from "@/models/User";
import mongoose from "mongoose";

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    // Authenticate and authorize
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

    // Allow users to view their own profile, or admins to view any profile
    if (payload.userType !== "admin" && payload.userId !== id) {
      return NextResponse.json(
        { error: "Forbidden: Access is denied" },
        { status: 403 }
      );
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("User GET [ID] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    // Authenticate and authorize
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

    const updateData = await request.json();

    // Different permissions for admin vs regular user
    if (payload.userType === "admin") {
      // Admin can update any user, including userType
      const { password, ...allowedUpdates } = updateData;

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { ...allowedUpdates, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } else if (payload.userId === id) {
      // Regular user can only update their own profile (excluding sensitive fields)
      const { password, userType, ...allowedUpdates } = updateData;

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { ...allowedUpdates, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } else {
      return NextResponse.json(
        { error: "Forbidden: Access is denied" },
        { status: 403 }
      );
    }
  } catch (error: any) {
    console.error("User PUT [ID] error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
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
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    // Only admins can delete users
    const token = request.cookies.get("accessToken")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const payload: JWTPayload | null = verifyAccessToken(token);
    if (!payload || payload.userType !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("User DELETE [ID] error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
