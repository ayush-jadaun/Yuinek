import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { verifyAccessToken } from "@/lib/auth/jwt";
import Product from "@/models/Product";
import mongoose from "mongoose";

interface CartItem {
  product_id: string;
  variant_id?: string;
  size_id: string;
  color_id: string;
  quantity: number;
}

interface CartData {
  items: CartItem[];
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // For this example, we'll use session storage or cookies for cart
    // In production, you might want to store cart in database for logged-in users
    const cartData = request.cookies.get("cart")?.value;

    if (!cartData) {
      return NextResponse.json({ cart: { items: [], total: 0 } });
    }

    const cart: CartData = JSON.parse(cartData);

    await connectDB();

    // Populate cart items with product details
    const populatedItems = await Promise.all(
      cart.items.map(async (item: CartItem) => {
        const product = await Product.findById(item.product_id)
          .populate("variants.size_id", "us_size eu_size uk_size")
          .populate("variants.color_id", "name hex_code");

        if (!product) return null;

        // Find the specific variant
        const variant = product.variants.find(
          (v: any) =>
            v.size_id._id.toString() === item.size_id &&
            v.color_id._id.toString() === item.color_id
        );

        const price = product.sale_price || product.base_price;
        const adjustedPrice = variant
          ? price + variant.price_adjustment
          : price;

        return {
          ...item,
          product: {
            _id: product._id,
            name: product.name,
            slug: product.slug,
            images: product.images,
            base_price: product.base_price,
            sale_price: product.sale_price,
          },
          variant,
          unit_price: adjustedPrice,
          total_price: adjustedPrice * item.quantity,
        };
      })
    );

    const validItems = populatedItems.filter((item) => item !== null);
    const total = validItems.reduce((sum, item) => sum + item.total_price, 0);

    return NextResponse.json({
      cart: {
        items: validItems,
        total,
        itemCount: validItems.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const {
      product_id,
      size_id,
      color_id,
      quantity = 1,
    } = await request.json();

    await connectDB();

    // Verify product exists and has stock
    const product = await Product.findById(product_id);
    if (!product || !product.is_active) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check variant stock
    const variant = product.variants.find(
      (v: any) =>
        v.size_id.toString() === size_id && v.color_id.toString() === color_id
    );

    if (variant && variant.stock_quantity < quantity) {
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 }
      );
    }

    // Get current cart
    const cartData = request.cookies.get("cart")?.value;
    let cart: CartData = cartData ? JSON.parse(cartData) : { items: [] };

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product_id === product_id &&
        item.size_id === size_id &&
        item.color_id === color_id
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product_id,
        size_id,
        color_id,
        quantity,
      });
    }

    const response = NextResponse.json({
      message: "Item added to cart successfully",
    });

    // Update cart cookie
    response.cookies.set("cart", JSON.stringify(cart), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { product_id, size_id, color_id, quantity } = await request.json();

    if (quantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be greater than 0" },
        { status: 400 }
      );
    }

    // Get current cart
    const cartData = request.cookies.get("cart")?.value;
    if (!cartData) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 404 });
    }

    let cart: CartData = JSON.parse(cartData);

    // Find and update item
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product_id === product_id &&
        item.size_id === size_id &&
        item.color_id === color_id
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    cart.items[itemIndex].quantity = quantity;

    const response = NextResponse.json({
      message: "Cart updated successfully",
    });

    response.cookies.set("cart", JSON.stringify(cart), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Cart PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get("product_id");
    const size_id = searchParams.get("size_id");
    const color_id = searchParams.get("color_id");

    // Get current cart
    const cartData = request.cookies.get("cart")?.value;
    if (!cartData) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 404 });
    }

    let cart: CartData = JSON.parse(cartData);

    if (product_id && size_id && color_id) {
      // Remove specific item
      cart.items = cart.items.filter(
        (item) =>
          !(
            item.product_id === product_id &&
            item.size_id === size_id &&
            item.color_id === color_id
          )
      );
    } else {
      // Clear entire cart
      cart.items = [];
    }

    const response = NextResponse.json({
      message: "Item removed from cart successfully",
    });

    response.cookies.set("cart", JSON.stringify(cart), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}
