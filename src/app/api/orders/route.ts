import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

// GET /api/order?userId=USER_ID or /api/order?id=ORDER_ID
export async function GET(request: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const id = searchParams.get("id");

  try {
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "Invalid order id" },
          { status: 400 }
        );
      }
      const order = await Order.findById(id)
        .populate("userId")
        .populate("shippingAddressId")
        .populate({
          path: "items",
          populate: { path: "productId" },
        })
        .lean();
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json({ order }, { status: 200 });
    }

    // List orders for a user (or all orders if no userId provided)
    const query: any = {};
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
      }
      query.userId = userId;
    }
    const orders = await Order.find(query)
      .populate("userId")
      .populate("shippingAddressId")
      .populate({
        path: "items",
        populate: { path: "productId" },
      })
      .sort({ placedAt: -1 })
      .lean();

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch order(s)", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/order
// Create a new order
export async function POST(request: NextRequest) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const {
      userId,
      shippingAddressId,
      items,
      totalAmount,
      status = "pending",
      paymentStatus = "pending",
      trackingId,
      courier,
      estimatedDelivery,
      paidAt,
      shippedAt,
      deliveredAt,
      cancelledAt,
    } = body;

    if (
      !userId ||
      !shippingAddressId ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !totalAmount
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields (userId, shippingAddressId, items, totalAmount)",
        },
        { status: 400 }
      );
    }

    const order = await Order.create({
      userId,
      shippingAddressId,
      items,
      totalAmount,
      status,
      paymentStatus,
      trackingId,
      courier,
      estimatedDelivery,
      placedAt: new Date(),
      paidAt,
      shippedAt,
      deliveredAt,
      cancelledAt,
    });

    return NextResponse.json(
      { message: "Order created successfully", order },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create order", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/order?id=ORDER_ID
export async function PATCH(request: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid or missing order id" },
      { status: 400 }
    );
  }

  try {
    const update = await request.json();
    const updatedOrder = await Order.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order updated successfully", order: updatedOrder },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update order", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/order?id=ORDER_ID
export async function DELETE(request: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid or missing order id" },
      { status: 400 }
    );
  }

  try {
    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete order", details: error.message },
      { status: 500 }
    );
  }
}
