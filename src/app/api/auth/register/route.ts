import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";
import { sendSms } from "@/lib/sms/sendSms";

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

    // Generate and set code/expiry if phone is present
    if (phone) {
      userData.phone_verification_code = "123456"; // Always string!
      userData.phone_verification_expires = new Date(
        Date.now() + 10 * 60 * 1000
      ); // 10 min
    }
    console.log("userData:", userData);
    // Create user
    const user = await User.create(userData);

    // Send verification code via SMS if phone was provided
    // if (phone && userData.phone_verification_code) {
    //   await sendSms(
    //     phone,
    //     `Your verification code is: ${userData.phone_verification_code}`
    //   );
    // }

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
