import express, { Request, Response, NextFunction } from "express";
import { ICreateVendor } from "../dto";
import { VendorModel } from "../models";

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

  const createdVendor = await VendorModel.create({
    name: name,
    email: email,
    foodType: foodType,
    ownerName: ownerName,
    password: password,
    phone: phone,
    pincode: pincode,
    address: address,
    rating: 0,
    salt: "",
    serviceAvaialble: [],
    coverImages: [],
  });

  return res.json({ name });
};

/**
 * get vendors
 */
export const getVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

/**
 * get vendor by Id
 */
export const getVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
