import jwt from "jsonwebtoken";
import { AuthPayloadType } from "../dto";
import dotenv from "../config/dotenv";
import { Request } from "express";

/**
 * generate Token
 */
export async function generateToken(payload: AuthPayloadType) {
  const token = jwt.sign(payload, dotenv.JWT_SECRET, { expiresIn: "30m" });
  return token;
}

/**
 * validate and get the payload from request
 * validate token and add user to requ
 */
export async function validateToken(req: Request) {
  const bearerString = req.get("Authorization");
  if (bearerString) {
    const token = bearerString.split(" ")[1];
    const payload = (await jwt.verify(
      token,
      dotenv.JWT_SECRET
    )) as AuthPayloadType;

    req.user = payload;

    return true;
  }

  return false;
}
