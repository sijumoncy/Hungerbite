import express, { NextFunction, Request, Response } from "express";
import {
  getVendorProfile,
  updateVendorProfile,
  vendorLogin,
} from "../controllers";
import { authenticate } from "../middlewares/commonAuth";

const router = express.Router();

/**
 * Vendor login
 */
router.post("/login", vendorLogin);

// Authorized routes
router.use(authenticate);
/**
 * Get Vendor profile
 */
router.get("/profile", getVendorProfile);
router.patch("/profile", updateVendorProfile);

export { router as vendorRoute };
