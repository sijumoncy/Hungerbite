import mongoose, { Schema, Document } from "mongoose";
import { IVendorDoc } from "./vendor.model";

export type OfferType = "VENDOR" | "GENERIC";
export type PromoType = "BANK" | "CARD" | "ALL";

export interface IOfferDoc extends Document {
  offerType: OfferType;
  vendors: [IVendorDoc];
  title: string;
  description: string;
  minPurchase: number;
  offerPrice: number;
  validFrom: Date;
  validTill: Date;
  promoCode: string;
  promoType: string;
  pincode: string;
  bank: [string];
  bankIdentificationNumber: [Number];
  isActive: boolean;
}

const OfferSchema = new Schema(
  {
    offerType: { type: String, required: true },
    vendors: [{ type: Schema.Types.ObjectId, ref: "vendor" }],
    title: { type: String, required: true },
    description: String,
    minPurchase: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    validFrom: Date,
    validTill: Date,
    promoCode: { type: String, required: true },
    promoType: { type: String, required: true },
    bank: [{ type: String }],
    bankIdentificationNumber: [{ type: Number }],
    pincode: { type: String, required: true },
    isActive: Boolean,
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

const OfferModel = mongoose.model<IOfferDoc>("offer", OfferSchema);

export { OfferModel };
