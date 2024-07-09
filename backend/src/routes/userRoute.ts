import express, { NextFunction, Request, Response } from "express";
import {
  generateOTP,
  getUserProfile,
  updateUserProfile,
  userLogin,
  userSignup,
  userVerify,
} from "../controllers";
import { authenticate } from "../middlewares/commonAuth";

const router = express.Router();

router.post("/signup", userSignup);

router.post("/login", userLogin);

// ===================== authorized ==================
router.use(authenticate);

// TODO : May need to move to verify user without auth : opt verify initially itself and later from profile
router.patch("/verify", userVerify);

router.get("/otp", generateOTP);

router.get("/profile", getUserProfile);

router.patch("/profile", updateUserProfile);

export { router as userRoute };
