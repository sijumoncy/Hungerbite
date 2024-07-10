import mongoose, { Schema, Document } from "mongoose";

export interface IFoodDoc extends Document {
  vendorId: string;
  name: string;
  description: string;
  category: string;
  foodType: string;
  readyTime: string;
  price: string;
  rating: string;
  images: [string];
}

const FoodSchema = new Schema(
  {
    vendorId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    foodType: { type: String, required: true },
    readyTime: { type: String },
    price: { type: String, required: true },
    rating: { type: String },
    images: { type: [String] },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v, delete ret.createdAt, delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const FoodModel = mongoose.model<IFoodDoc>("food", FoodSchema);

export { FoodModel };
