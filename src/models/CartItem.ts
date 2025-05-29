import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  selectedVariant?: string;
  addedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, default: 1 },
  selectedVariant: { type: String },
  addedAt: { type: Date, default: Date.now },
});

export default mongoose.models.CartItem ||
  mongoose.model<ICartItem>("CartItem", CartItemSchema);
