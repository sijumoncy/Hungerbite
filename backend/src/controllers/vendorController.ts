import express, { Request, Response, NextFunction } from "express";
import { IVendorLoginInputs } from "../dto";
import { findVendor } from "./adminController";
import { verifyPassword } from "../utils";

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
      return res.json({ message: "Login successfull", data: vendor });
    } else {
      return res.json({ message: "password is not valid" });
    }
  }

  return res.json({ message: "login credential not valid" });
};
