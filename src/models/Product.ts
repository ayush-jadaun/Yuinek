import mongoose, { Schema, Document } from "mongoose";

interface Variant {
  name: string;
  value: string;
  stock: number;
  priceAdjustment: number;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: mongoose.Types.ObjectId;
  type: "formal" | "sneakers" | "loafers" | "school" | "sandals";
  variants: Variant[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<Variant>(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    priceAdjustment: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    type: {
      type: String,
      enum: ["formal", "sneakers", "loafers", "school", "sandals"],
      required: true,
    },
    variants: { type: [VariantSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
