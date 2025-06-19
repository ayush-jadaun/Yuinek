import mongoose, { Schema, Document } from "mongoose";

export interface ISize extends Document {
  us_size: string;
  eu_size?: string;
  uk_size?: string;
  cm_size?: number;
  gender: "men" | "women" | "kids";
  createdAt: Date;
}

const SizeSchema = new Schema<ISize>(
  {
    us_size: { type: String, required: true },
    eu_size: String,
    uk_size: String,
    cm_size: Number,
    gender: { type: String, enum: ["men", "women", "kids"], required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.models.Size ||
  mongoose.model<ISize>("Size", SizeSchema);
