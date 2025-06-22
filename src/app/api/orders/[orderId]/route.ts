import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Order from "@/models/Order";
import { verifyAccessToken, JWTPayload } from "@/lib/auth/jwt";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB();

    const { orderId } = await params; // Await params as required by Next.js 14+

    // 1. Authenticate user (optional, but recommended)
    const token = request.cookies.get("accessToken")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const payload: JWTPayload | null = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 2. Fetch the order by ID (populate user for admin info)
    const order = await Order.findById(orderId).populate(
      "user_id",
      "first_name last_name email"
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 3. Only allow user to view their own order (unless admin)
    if (
      payload.userType !== "admin" &&
      order.user_id.toString() !== payload.userId
    ) {
      return NextResponse.json(
        { error: "Unauthorized to view this order" },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (err: any) {
    console.error("Order GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PATCH for admin: update status, payment_status, notes, etc.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB();

    const { orderId } = await params;

    // 1. Authenticate user
    const token = request.cookies.get("accessToken")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const payload: JWTPayload | null = verifyAccessToken(token);
    if (!payload || payload.userType !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // 2. Parse body
    const body = await request.json();

    // Allow updating status, payment_status, notes, shipping_address, etc.
    const updateFields: Record<string, any> = {};
    if (body.status) updateFields.status = body.status;
    if (body.payment_status) updateFields.payment_status = body.payment_status;
    if (body.notes !== undefined) updateFields.notes = body.notes;
    if (body.shipping_address)
      updateFields.shipping_address = body.shipping_address;
    if (body.tracking_number)
      updateFields.tracking_number = body.tracking_number;
    // Add more fields as needed

    // 3. Update order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateFields },
      { new: true }
    ).populate("user_id", "first_name last_name email");

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (err: any) {
    console.error("Order PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
