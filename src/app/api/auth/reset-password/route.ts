import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/db/mongodb";

export async function POST(request: NextRequest) {
  await connectDB();
  const { token, password } = await request.json();
  if (!token || !password)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user)
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return NextResponse.json({ message: "Password reset successful." });
}
