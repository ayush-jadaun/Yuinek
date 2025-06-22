import mongoose, { Schema, Document } from "mongoose";

export interface IOrderAddress {
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  [key: string]: any;
}

export interface IOrderItem {
  product_id: mongoose.Types.ObjectId;
  product_variant_id?: mongoose.Types.ObjectId;
  product_name: string;
  product_code: number;
  size_name: string;
  color_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface IOrder extends Document {
  order_number: string;
  user_id: mongoose.Types.ObjectId;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  billing_address: IOrderAddress;
  shipping_address: IOrderAddress;
  items: IOrderItem[];
  payment_method: string;
  payment_status:
    | "pending"
    | "paid"
    | "failed"
    | "refunded"
    | "partially_refunded";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  product_variant_id: { type: Schema.Types.ObjectId },
  product_name: { type: String, required: true },
  product_code: { type: Number, required: true },
  size_name: { type: String, required: true },
  color_name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit_price: { type: Number, required: true, min: 0 },
  total_price: { type: Number, required: true, min: 0 },
});

const OrderSchema = new Schema<IOrder>(
  {
    order_number: { type: String, required: true, unique: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    subtotal: { type: Number, required: true, min: 0 },
    tax_amount: { type: Number, default: 0, min: 0 },
    shipping_amount: { type: Number, default: 0, min: 0 },
    discount_amount: { type: Number, default: 0, min: 0 },
    total_amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "PHP" },
    billing_address: { type: Schema.Types.Mixed, required: true }, // Use IOrderAddress in TS
    shipping_address: { type: Schema.Types.Mixed, required: true }, // Use IOrderAddress in TS
    items: [OrderItemSchema],
    payment_method: { type: String, required: true },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "partially_refunded"],
      default: "pending",
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
