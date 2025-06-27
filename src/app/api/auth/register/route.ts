import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";
import { sendVerification } from "@/lib/sms/sendVerification";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password, first_name, last_name, phone } =
      await request.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Always set phone_verified: false
    let userData: any = {
      email,
      password_hash,
      first_name,
      last_name,
      phone,
      user_type: "customer",
      phone_verified: false,
    };

    // If phone is present, trigger verification via Twilio Verify
    if (phone) {
      // Send verification code via Twilio Verify
      try {
        await sendVerification(phone);
        // Optionally: you could store a "pending verification" state, but
        // do NOT store any code - the check will happen later by comparing user input to Twilio's service.
      } catch (err) {
        return NextResponse.json(
          { error: "Failed to send verification code" },
          { status: 500 }
        );
      }
    }

    // Create user
    const user = await User.create(userData);

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user._id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          phone_verified: user.phone_verified,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
