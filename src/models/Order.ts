import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  shippingAddressId: mongoose.Types.ObjectId;
  items: mongoose.Types.ObjectId[]; // orderItems _id
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "success" | "failed";
  trackingId?: string;
  courier?: string;
  estimatedDelivery?: Date;
  placedAt: Date;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    shippingAddressId: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    items: [{ type: Schema.Types.ObjectId, ref: "OrderItem", required: true }],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    trackingId: { type: String },
    courier: { type: String },
    estimatedDelivery: { type: Date },
    placedAt: { type: Date, default: Date.now },
    paidAt: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
  },
  { timestamps: false }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
