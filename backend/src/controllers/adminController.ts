import express, { Request, Response, NextFunction } from "express";
import { ICreateVendor } from "../dto";
import { VendorModel } from "../models";
import { hashPassword } from "../utils";

/**
 * create new vendor
 */
export const createVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("in create vendor admin ===> ", req.body);

  const {
    name,
    email,
    foodType,
    ownerName,
    password,
    phone,
    pincode,
    address,
  } = <ICreateVendor>req.body;

  // check exist
  const existingVendor = await VendorModel.findOne({ email: email });

  if (existingVendor !== null) {
    return res.json({ message: "A Vendor with this email id is exist" });
  }

  // ecrypt password by generate salt
  const hashed = await hashPassword(password);

  const createdVendor = await VendorModel.create({
    name: name,
    email: email,
    foodType: foodType,
    ownerName: ownerName,
    password: hashed.pwd,
    phone: phone,
    pincode: pincode,
    address: address,
    rating: 0,
    salt: hashed.salt,
    serviceAvaialble: [],
    coverImages: [],
  });

  return res.json(createdVendor);
};

/**
 * get vendors
 */
export const getVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await VendorModel.find();

  if (vendors !== null) {
    return res.json(vendors);
  }

  return [];
};

/**
 * get vendor by Id
 */
export const getVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendorId = req.params.id;
  const vendor = await VendorModel.findById(vendorId);
  if (vendor !== null) {
    return res.json(vendor);
  }

  return null;
};
