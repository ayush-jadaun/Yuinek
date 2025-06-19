import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshToken extends Document {
  user_id: mongoose.Types.ObjectId;
  token_hash: string;
  device_info?: string;
  ip_address?: string;
  is_active: boolean;
  expires_at: Date;
  createdAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token_hash: { type: String, required: true },
    device_info: String,
    ip_address: String,
    is_active: { type: Boolean, default: true },
    expires_at: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.models.RefreshToken ||
  mongoose.model<IRefreshToken>("RefreshToken", RefreshTokenSchema);
