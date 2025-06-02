import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import CartItem from "@/models/CartItem";

// GET /api/cart?userId=USER_ID
export async function GET(request: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json(
      { error: "Invalid or missing userId" },
      { status: 400 }
    );
  }

  try {
    const cartItems = await CartItem.find({ userId })
      .populate("productId")
      .lean();
    return NextResponse.json({ cartItems }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch cart items", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/cart
// Add an item to the cart or update quantity if it exists
export async function POST(request: NextRequest) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { userId, productId, quantity = 1, selectedVariant } = body;

    if (
      !userId ||
      !productId ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return NextResponse.json(
        { error: "Invalid or missing userId/productId" },
        { status: 400 }
      );
    }

    // Check if the item already exists (same product, user, and variant)
    const filter: any = { userId, productId };
    if (selectedVariant) filter.selectedVariant = selectedVariant;

    let cartItem = await CartItem.findOne(filter);

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        userId,
        productId,
        quantity,
        selectedVariant,
      });
    }

    return NextResponse.json(
      { message: "Cart item added/updated successfully", cartItem },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to add/update cart item", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/cart?id=CART_ITEM_ID
// Update the quantity or selectedVariant of a cart item
export async function PATCH(request: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid or missing cart item id" },
      { status: 400 }
    );
  }

  try {
    const update = await request.json();
    const cartItem = await CartItem.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Cart item updated successfully", cartItem },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update cart item", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/cart?id=CART_ITEM_ID
export async function DELETE(request: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid or missing cart item id" },
      { status: 400 }
    );
  }

  try {
    const deleted = await CartItem.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Cart item deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete cart item", details: error.message },
      { status: 500 }
    );
  }
}
