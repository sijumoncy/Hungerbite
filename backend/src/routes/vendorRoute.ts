import express, { NextFunction, Request, Response } from "express";
import {
  addFoodController,
  getFoodById,
  getFoodController,
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

/**
 * Get foods
 */
router.get("/food", getFoodController);
/**
 * get food by id
 */
router.get("/food/:id", getFoodById);

// ===========================================  Authorized  ============================

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

/**
 * Food or Menu
 */
router.post("/food", addFoodController);

export { router as vendorRoute };
