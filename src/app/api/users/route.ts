// src/app/api/users/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { verifyAccessToken, JWTPayload } from "@/lib/auth/jwt";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // 1. Authenticate and Authorize the request
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

    // Crucially, check if the user is an admin
    if (payload.userType !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Access is denied" },
        { status: 403 }
      );
    }

    // 2. Fetch all users from the database
    // We explicitly exclude the password hash from the response for security.
    const users = await User.find({})
      .select("-password_hash")
      .sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Users GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
