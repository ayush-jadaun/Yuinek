// src/app/api/auth/logout/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import RefreshToken from "@/models/RefreshToken";
import { hashToken } from "@/lib/auth/jwt";

export async function POST(request: NextRequest) {
  try {
    const refreshTokenCookie = request.cookies.get("refreshToken");
    const token = refreshTokenCookie?.value;

    if (token) {
      await connectDB();
      const tokenHash = hashToken(token);
      // Invalidate the refresh token in the database
      await RefreshToken.findOneAndUpdate(
        { token_hash: tokenHash },
        { is_active: false, expires_at: new Date() }
      );
    }

    const response = NextResponse.json({ message: "Logout successful" });

    // Clear the cookies on the client side
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: -1, // Expire immediately
    });

    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: -1, // Expire immediately
    });

    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
