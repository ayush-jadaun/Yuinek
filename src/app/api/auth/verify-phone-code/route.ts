import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { userId, code } = await request.json();
    console.log(userId,code)

    const user = await User.findById(userId);

    if (
      !user ||
      !user.phone_verification_code ||
      !user.phone_verification_expires ||
      user.phone_verification_code !== code ||
      user.phone_verification_expires < new Date()
    ) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 400 }
      );
    }

    user.phone_verified = true;
    user.phone_verification_code = undefined;
    user.phone_verification_expires = undefined;
    await user.save();

    return NextResponse.json({ message: "Phone verified successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
