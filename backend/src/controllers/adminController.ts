import express, { Request, Response, NextFunction } from "express";
import { ICreateVendor } from "../dto";
import { VendorModel } from "../models";
import { generateSalt, hashPassword } from "../utils";

/**
 *
 * @param id
 * @param email
 * @param phone
 * @returns
 * Util function to get vendor by unique fields
 */
export const findVendor = async (
  id: string | undefined,
  email?: string,
  phone?: string
) => {
  if (email) {
    const vendor = await VendorModel.findOne({ email: email });
    return vendor;
  } else if (phone) {
    const vendor = await VendorModel.findOne({ phone: phone });
    return vendor;
  } else {
    const vendor = VendorModel.findById(id);
    return vendor;
  }
};

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
  const existingVendor = await findVendor(undefined, email);

  if (existingVendor !== null) {
    return res.json({ message: "A Vendor with this email id is exist" });
  }

  // ecrypt password by generate salt
  const generatedSalt = await generateSalt();
  const hashedPwd = await hashPassword(password, generatedSalt);

  const createdVendor = await VendorModel.create({
    name: name,
    email: email,
    foodType: foodType,
    ownerName: ownerName,
    password: hashedPwd,
    phone: phone,
    pincode: pincode,
    address: address,
    rating: 0,
    salt: generatedSalt,
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
  const vendor = await findVendor(vendorId);
  if (vendor !== null) {
    return res.json(vendor);
  }

  return null;
};
