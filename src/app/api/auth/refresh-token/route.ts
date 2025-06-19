// src/app/api/auth/refresh-token/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";
import RefreshToken from "@/models/RefreshToken";
import {
  generateAccessToken,
  verifyRefreshToken,
  hashToken,
  JWTPayload,
} from "@/lib/auth/jwt";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const refreshTokenCookie = request.cookies.get("refreshToken");
    const token = refreshTokenCookie?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No refresh token" },
        { status: 401 }
      );
    }

    // 1. Verify the token signature and expiration
    const payload = verifyRefreshToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid refresh token" },
        { status: 401 }
      );
    }

    // 2. Find the token in the database to ensure it's not revoked
    const tokenHash = hashToken(token);
    const dbToken = await RefreshToken.findOne({
      token_hash: tokenHash,
      is_active: true,
      expires_at: { $gt: new Date() },
    });

    if (!dbToken) {
      return NextResponse.json(
        { error: "Unauthorized: Token has been revoked or expired" },
        { status: 401 }
      );
    }

    // 3. Find the associated user
    const user = await User.findById(payload.userId);
    if (!user || !user.is_active) {
      return NextResponse.json(
        { error: "Unauthorized: User not found or inactive" },
        { status: 401 }
      );
    }

    // 4. Issue a new access token
    const newPayload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      userType: user.user_type,
    };
    const newAccessToken = generateAccessToken(newPayload);

    // 5. Send the new token in the response
    const response = NextResponse.json({
      message: "Token refreshed successfully",
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        user_type: user.user_type,
      },
    });

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    return response;
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
