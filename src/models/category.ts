import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  gender: "men" | "women" | "kids";
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  gender: { type: String, enum: ["men", "women", "kids"], required: true },
});

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
