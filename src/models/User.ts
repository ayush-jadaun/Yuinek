import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  phone_verified: boolean;
  phone_verification_code?: string;
  phone_verification_expires?: Date;
  user_type: "customer" | "admin" | "staff";
  is_active: boolean;
  email_verified: boolean;
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
  // Add for password reset
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

export interface IAddress {
  type: "billing" | "shipping";
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
}

const AddressSchema = new Schema<IAddress>({
  type: { type: String, enum: ["billing", "shipping"], required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  company: String,
  address_line_1: { type: String, required: true },
  address_line_2: String,
  city: { type: String, required: true },
  state_province: { type: String, required: true },
  postal_code: { type: String, required: true },
  country: { type: String, default: "Philippines" },
  phone: String,
  is_default: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password_hash: { type: String, required: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    phone_verified: { type: Boolean, default: false },
    phone_verification_code: { type: String },
    phone_verification_expires: { type: Date },
    user_type: {
      type: String,
      enum: ["customer", "admin", "staff"],
      default: "customer",
    },
    is_active: { type: Boolean, default: true },
    email_verified: { type: Boolean, default: false },
    addresses: [AddressSchema],
    // Add for password reset:
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
