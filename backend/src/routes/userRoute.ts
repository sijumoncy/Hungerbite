import express, { NextFunction, Request, Response } from "express";
import {
  generateOTP,
  getUserProfile,
  updateUserProfile,
  userLogin,
  userSignup,
  userVerify,
} from "../controllers";

const router = express.Router();

router.post("/signup", userSignup);

router.post("/login", userLogin);

// ===================== authorized ==================

router.patch("/verify", userVerify);

router.get("/otp", generateOTP);

router.get("/profile", getUserProfile);

router.patch("/profile", updateUserProfile);

export { router as userRoute };
