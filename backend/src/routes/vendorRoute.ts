import express, { NextFunction, Request, Response } from "express";
import { getVendorProfile, vendorLogin } from "../controllers";

const router = express.Router();

/**
 * Vendor login
 */
router.post("/login", vendorLogin);

/**
 * Get Vendor profile
 */
router.get('/profile', getVendorProfile)

export { router as vendorRoute };
