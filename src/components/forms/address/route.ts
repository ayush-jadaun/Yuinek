// src/app/api/users/addresses/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { verifyAccessToken, JWTPayload } from "@/lib/auth/jwt";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const token = request.cookies.get("accessToken")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload: JWTPayload | null = verifyAccessToken(token);
    if (!payload)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const newAddress = await request.json();

    await User.findByIdAndUpdate(
      payload.userId,
      { $push: { addresses: newAddress } },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { message: "Address added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADD ADDRESS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to add address" },
      { status: 500 }
    );
  }
}
