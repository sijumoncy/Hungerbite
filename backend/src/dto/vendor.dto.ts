// Data Transfer Object for vendor inputs

import { IVendorDoc } from "../models";
import { OfferType } from "../models/offer.model";

export interface ICreateVendor {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  phone: string;
  email: string;
  address: string;
  password: string;
}

export interface IUpdateVendorProfileInputs {
  name: string;
  address: string;
  phone: string;
  foodTypes: [string];
}

export interface IVendorLoginInputs {
  email: string;
  password: string;
}

export interface IVendorPayload {
  _id: string;
  email: string;
  name: string;
  foodTypes: string[];
}

export interface CreateOfferInputs {
  offerType: OfferType;
  vendors: [IVendorDoc] | [];
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
