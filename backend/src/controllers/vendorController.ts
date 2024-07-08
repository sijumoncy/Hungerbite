import express, { Request, Response, NextFunction } from "express";
import { IVendorLoginInputs } from "../dto";
import { findVendor } from "./adminController";
import { verifyPassword } from "../utils";
import { generateToken } from "../utils/token";

/**
 * Vendor Login
 */
export const vendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, pasword } = <IVendorLoginInputs>req.body;

  const vendor = await findVendor(undefined, email);

  if (vendor !== null) {
    // validation
    const validated = await verifyPassword(
      pasword,
      vendor.password,
      vendor.salt
    );
    if (validated) {
      const token = generateToken({
        _id: vendor.id,
        email: vendor.email,
        foodTypes: vendor.foodType,
        name: vendor.name,
      });
      return res.json({ message: "Login successfull", token: token });
    } else {
      return res.json({ message: "password is not valid" });
    }
  }

  return res.json({ message: "login credential not valid" });
};

/**
 * Get Vendor Profile
 */
export const getVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
