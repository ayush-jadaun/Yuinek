import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";
import { sendVerification } from "@/lib/sms/sendVerification"; // This should trigger Twilio Verify

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { userId, phone } = await request.json();

    // Find user and update phone if provided
    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (phone) user.phone = phone;

    // Reset verification state
    user.phone_verified = false;

    await user.save();

    // Send verification code via Twilio Verify (do not generate or store code here)
    try {
      await sendVerification(user.phone); // This should call Twilio Verify API for SMS
    } catch (err) {
      return NextResponse.json(
        { error: "Failed to send verification code" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Verification code sent." });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
