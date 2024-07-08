import jwt from "jsonwebtoken";
import { IVendorPayload } from "../dto";
import dotenv from "../config/dotenv";

export async function generateToken(payload: IVendorPayload) {
  const token = jwt.sign(payload, dotenv.JWT_SECRET, { expiresIn: "30m" });
  return token;
}
