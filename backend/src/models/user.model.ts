import mongoose, { Schema, Document } from "mongoose";
import { IOrderDoc } from "./order.model";
import { IFoodDoc } from "./food.model";

export interface ICart {
  food: IFoodDoc;
  count: number;
  total: number;
}

interface IUserDoc extends Document {
  email: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  verified: boolean;
  otp: number;
  otp_expiry: Date;
  lat: number;
  lng: number;
  cart: [ICart];
  orders: [IOrderDoc];
}

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    verified: { type: Boolean, required: true },
    otp: { type: Number, required: true },
    otp_expiry: { type: Date, required: true },
    lat: { type: Number },
    lng: { type: Number },
    cart: [
      {
        food: { type: Schema.Types.ObjectId, ref: "food" },
        count: { type: Number },
        total: { type: Number },
      },
    ],
    orders: [{ type: Schema.Types.ObjectId, ref: "order" }],
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

const UserModel = mongoose.model<IUserDoc>("user", UserSchema);

export { UserModel };
