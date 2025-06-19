import mongoose, { Schema, Document } from "mongoose";

export interface IColor extends Document {
  name: string;
  hex_code?: string;
  createdAt: Date;
}

const ColorSchema = new Schema<IColor>(
  {
    name: { type: String, required: true, trim: true },
    hex_code: {
      type: String,
      match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.models.Color ||
  mongoose.model<IColor>("Color", ColorSchema);
