import express, { NextFunction, Request, Response } from "express";
import {
  getVendorProfile,
  updateVendorProfile,
  updateVendorServiceAvailability,
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

/**
 * update vendor profile data
 */
router.patch("/profile", updateVendorProfile);

/**
 * update service avialability status of vendor
 */
router.patch("/service", updateVendorServiceAvailability);

export { router as vendorRoute };
