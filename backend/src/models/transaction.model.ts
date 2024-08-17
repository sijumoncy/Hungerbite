import mongoose, { Schema, Document } from "mongoose";
import { PaymentModeTypes } from "./order.model";

export type TransactionStatusType =
  | "PENDING"
  | "CANCELLED"
  | "SUCCESS"
  | "OPEN";

export interface ITransactionDoc extends Document {
  user: string;
  vendorId: string;
  orderId: string;
  orderAmount: number;
  transactionAmount: number;
  transactionId: string;
  offerUsed: string;
  status: TransactionStatusType;
  paymentMode: PaymentModeTypes;
  paymentResponse: string;
}
// INFO : relation will be added later if required

const TransactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "vendor", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "order", required: true },
    orderAmount: Number,
    transactionAmount: Number,
    offerUsed: String,
    status: { type: String, default: "PENDING" },
    paymentMode: { type: String, default: "COD" },
    paymentResponse: String,
    transactionId: { type: String, required: true, unique: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const TransactionModel = mongoose.model<ITransactionDoc>(
  "transaction",
  TransactionSchema
);

export { TransactionModel };
