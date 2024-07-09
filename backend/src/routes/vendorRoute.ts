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
import multer from "multer";

const router = express.Router();

// config multer
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const handleImages = multer({ storage: imageStorage }).array("images", 10);

// =========================================== open endpoints ==========================

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
router.post("/food", handleImages, addFoodController);

export { router as vendorRoute };
