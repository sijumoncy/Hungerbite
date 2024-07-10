import mongoose, { Schema, Document } from "mongoose";
import { IFoodDoc } from "./food.model";

export interface OrderItem {
  food: IFoodDoc;
  count: number;
  total: number;
}

export type PaymentModeTypes = "COD" | "Credit Card" | "Debit Card";
export type OrderStatusTypes = "pending" | "inprogress" | "completed";

export interface IOrderDoc extends Document {
  orderId: string;
  items: [OrderItem];
  totalAmount: number;
  orderDate: Date;
  paymentMode: PaymentModeTypes;
  paymentResponse: string; // TODO : need to handle this with a type alter based on payment gateway
  orderStatus: OrderStatusTypes;
}

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true },
    items: [
      {
        food: { type: Schema.Types.ObjectId, required: true, ref: "food" },
        count: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, required: true },
    paymentMode: { type: String, required: true },
    paymentResponse: { type: String, required: true },
    orderStatus: { type: String, required: true },
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

const OrderModel = mongoose.model<IOrderDoc>("order", OrderSchema);

export { OrderModel };
