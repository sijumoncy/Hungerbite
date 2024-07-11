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
  offerUsed: string;
  status: TransactionStatusType;
  paymentMode: PaymentModeTypes;
  paymentResponse: string;
}
// INFO : relation will be added later if required

const TransactionSchema = new Schema(
  {
    user: String,
    vendorId: String,
    orderId: String,
    orderAmount: Number,
    transactionAmount: Number,
    offerUsed: String,
    status: String,
    paymentMode: String,
    paymentResponse: String,
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
