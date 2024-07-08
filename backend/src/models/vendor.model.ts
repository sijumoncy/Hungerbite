import mongoose, { Schema, Document } from "mongoose";
import { IFoodDoc } from "./food.model";

interface IVendorDoc extends Document {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  phone: string;
  email: string;
  address: string;
  password: string;
  salt: string;
  serviceAvaialble: boolean;
  rating: string;
  foods: [IFoodDoc];
  coverImages: [string];
}

const VendorSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String] },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvaialble: { type: Boolean },
    rating: { type: String },
    foods: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "food",
      },
    ],
    coverImages: { type: [String] },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const VendorModel = mongoose.model<IVendorDoc>("vendor", VendorSchema);

export { VendorModel };
