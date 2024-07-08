import { NextFunction, Request, Response } from "express";
import { AuthPayloadType } from "../dto";
import { validateToken } from "../utils/token";

declare global {
  namespace Express {
    interface Request {
      user: AuthPayloadType;
    }
  }
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isVerified = await validateToken(req);

  if (isVerified) {
    next();
  } else {
    return res.json({ message: "unable to authorize user" });
  }
}
