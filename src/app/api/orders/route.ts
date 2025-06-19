// src/app/api/orders/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { verifyAccessToken, JWTPayload } from "@/lib/auth/jwt";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import mongoose from "mongoose";

// Function to generate a unique order number
const generateOrderNumber = async () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const datePrefix = `${year}${month}${day}`;

  // Find the last order created today to determine the sequence
  const lastOrder = await Order.findOne({
    order_number: new RegExp(`^${datePrefix}`),
  }).sort({ createdAt: -1 });

  let sequence = 1;
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.order_number.slice(-4), 10);
    sequence = lastSequence + 1;
  }

  return `${datePrefix}-${sequence.toString().padStart(4, "0")}`;
};

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // 1. Authenticate user
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

    // 2. Get order data from request
    const { items, shippingAddressId, billingAddressId, paymentMethod } =
      await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cannot create an empty order." },
        { status: 400 }
      );
    }

    // 3. Find user and their addresses
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const shipping_address = user.addresses.find(
      (addr) => addr._id.toString() === shippingAddressId
    );
    const billing_address = user.addresses.find(
      (addr) => addr._id.toString() === billingAddressId
    );

    if (!shipping_address || !billing_address) {
      return NextResponse.json(
        { error: "Invalid shipping or billing address." },
        { status: 400 }
      );
    }

    // 4. Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found.`);
      }

      const variant = product.variants.find(
        (v) =>
          v.size_id.toString() === item.sizeId &&
          v.color_id.toString() === item.colorId
      );

      if (!variant) {
        throw new Error(`Variant for product ${product.name} not found.`);
      }

      if (variant.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}.`);
      }

      const price = product.sale_price || product.base_price;
      const adjustedPrice = price + (variant.price_adjustment || 0);
      const total_price = adjustedPrice * item.quantity;
      subtotal += total_price;

      orderItems.push({
        product_id: product._id,
        // product_variant_id is missing from your model, but would be good to add
        product_name: product.name,
        product_code: product.product_code,
        size_name: variant.size_id.us_size, // Assuming population or direct access
        color_name: variant.color_id.name, // Assuming population or direct access
        quantity: item.quantity,
        unit_price: adjustedPrice,
        total_price: total_price,
      });
    }

    // In a real app, calculate tax and shipping
    const tax_amount = subtotal * 0.12; // Example 12% tax
    const shipping_amount = 150; // Example flat rate shipping
    const total_amount = subtotal + tax_amount + shipping_amount;
    const order_number = await generateOrderNumber();

    // 5. Create the order
    const newOrder = new Order({
      order_number,
      user_id: user._id,
      items: orderItems,
      subtotal,
      tax_amount,
      shipping_amount,
      total_amount,
      shipping_address,
      billing_address,
      payment_method,
      status: "pending",
      payment_status: "pending",
    });

    await newOrder.save();

    // 6. Decrement stock (important!)
    for (const item of orderItems) {
      await Product.updateOne(
        {
          _id: item.product_id,
          "variants.size_id": item.size_id,
          "variants.color_id": item.color_id,
        },
        {
          $inc: {
            "variants.$.stock_quantity": -item.quantity,
            stock_quantity: -item.quantity,
          },
        }
      );
    }

    return NextResponse.json(
      {
        message: "Order created successfully",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Order POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // 1. Authenticate user
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

    let orders;
    const { searchParams } = new URL(request.url);
    const fetchAll = searchParams.get("all") === "true";

    // 2. Authorize and fetch data
    if (payload.userType === "admin" && fetchAll) {
      // Admin is requesting all orders
      orders = await Order.find({})
        .populate("user_id", "first_name last_name email") // Get user info
        .sort({ createdAt: -1 });
    } else {
      // Customer is fetching their own orders
      orders = await Order.find({ user_id: payload.userId }).sort({
        createdAt: -1,
      });
    }

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}