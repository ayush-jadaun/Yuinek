import mongoose, { Schema, Document } from "mongoose";
import { IColor } from "./Color";
import { ISize } from "./Size";

export interface IProductVariant {
  size_id: ISize;
  color_id: IColor;
  stock_quantity: number;
  price_adjustment: number;
  is_active: boolean;
  sku: string; // <-- Add this line!
}

export interface IProductImage {
  color_id?: mongoose.Types.ObjectId;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
}

export interface IProduct extends Document {
  _id: string;
  name: string;
  product_code: number;
  category_id: mongoose.Types.ObjectId;
  description: string;
  short_description?: string;
  base_price: number;
  sale_price?: number;
  cost_price?: number;
  weight?: number;
  slug: string;
  is_featured: boolean;
  is_active: boolean;
  stock_status: "in_stock" | "out_of_stock" | "pre_order";
  manage_stock: boolean;
  stock_quantity: number;
  low_stock_threshold: number;
  images: IProductImage[];
  variants: IProductVariant[];
  meta_title?: string;
  meta_description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>({
  size_id: { type: Schema.Types.ObjectId, ref: "Size", required: true },
  color_id: { type: Schema.Types.ObjectId, ref: "Color", required: true },
  stock_quantity: { type: Number, required: true, min: 0 },
  price_adjustment: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  sku: { type: String, required: true }, // <-- Add this line!
});

const ProductImageSchema = new Schema<IProductImage>({
  color_id: { type: Schema.Types.ObjectId, ref: "Color" },
  image_url: { type: String, required: true },
  alt_text: String,
  is_primary: { type: Boolean, default: false },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    product_code: { type: Number, required: true, unique: true },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: { type: String, required: true },
    short_description: String,
    base_price: { type: Number, required: true, min: 0 },
    sale_price: { type: Number, min: 0 },
    cost_price: { type: Number, min: 0 },
    weight: Number,
    slug: { type: String, required: true, unique: true, lowercase: true },
    is_featured: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    stock_status: {
      type: String,
      enum: ["in_stock", "out_of_stock", "pre_order"],
      default: "in_stock",
    },
    manage_stock: { type: Boolean, default: true },
    stock_quantity: { type: Number, default: 0, min: 0 },
    low_stock_threshold: { type: Number, default: 5 },
    images: [ProductImageSchema],
    variants: [ProductVariantSchema],
    meta_title: String,
    meta_description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
