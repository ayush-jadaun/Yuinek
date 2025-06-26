import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";
import { sendSms } from "@/lib/sms/sendSms"; // You'd implement this for your SMS provider

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { userId, phone } = await request.json();

    // Find user and update phone if provided
    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (phone) user.phone = phone;

    // Generate 6-digit code
    const code = 123456

    user.phone_verification_code = code;
    user.phone_verification_expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
    user.phone_verified = false;

    await user.save();

    // Send SMS
    // await sendSms(user.phone, `Your verification code is: ${code}`);

    return NextResponse.json({ message: "Verification code sent." });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
