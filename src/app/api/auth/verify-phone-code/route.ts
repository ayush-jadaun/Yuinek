import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";
import { checkVerification } from "@/lib/sms/checkVerification"; // Update this import path to where your function is

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { userId, code } = await request.json();

    const user = await User.findById(userId);

    if (!user || !user.phone) {
      return NextResponse.json(
        { error: "User or phone number not found" },
        { status: 404 }
      );
    }

    // Use Twilio Verify to check the code
    let isApproved = false;
    try {
      isApproved = await checkVerification(user.phone, code);
    } catch (err) {
      return NextResponse.json(
        { error: "Failed to verify code" },
        { status: 500 }
      );
    }

    if (!isApproved) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 400 }
      );
    }

    user.phone_verified = true;
    await user.save();

    return NextResponse.json({ message: "Phone verified successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
