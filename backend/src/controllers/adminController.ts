import express, { Request, Response, NextFunction } from "express";
import { ICreateVendor } from "../dto";

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
