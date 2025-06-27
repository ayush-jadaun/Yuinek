import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/User";
import { connectDB } from "@/lib/db/mongodb";
// import sendEmail from "@/lib/email/sendEmail"; // Implement this for real usage

export async function POST(request: NextRequest) {
  await connectDB();
  const { email } = await request.json();
  if (!email)
    return NextResponse.json({ error: "Email required" }, { status: 400 });

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({
      message: "If the email exists, you will receive a reset link.",
    });

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne(
      { email },
      {
        $set: {
          resetPasswordToken: token,
          resetPasswordExpires: new Date(Date.now() + 1000 * 60 * 60),
        },
      }
    );

  // TODO: Implement real sending
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;
  // await sendEmail(user.email, "Reset your password", `Click here: ${resetUrl}`);

  return NextResponse.json({
    message: "If the email exists, you will receive a reset link.",
  });
}
