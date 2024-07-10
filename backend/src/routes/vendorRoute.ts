import express, { NextFunction, Request, Response } from "express";
import {
  addFoodController,
  createVendorOffers,
  deleteVendorOffers,
  getFoodById,
  getFoodController,
  getVendorOffers,
  getVendorOrderById,
  getVendorOrders,
  getVendorProfile,
  processVendorOrder,
  updateVendorCoverImage,
  updateVendorOffers,
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
 * update vendor profile picture
 */
router.patch("/profile-image", handleImages, updateVendorCoverImage);

/**
 * update service avialability status of vendor
 */
router.patch("/service", updateVendorServiceAvailability);

/**
 * Food or Menu
 */
router.post("/food", handleImages, addFoodController);

// =================================== orders =======================
/**
 * get orders of vendor
 */
router.get("/orders", getVendorOrders);

/**
 * update vendor order status
 */
router.put("/order/:id/process", processVendorOrder);

/**
 * get vendor order by id
 */
router.get("/order/:id", getVendorOrderById);

// ================================= offers ======================
/**
 * add vendor offers
 */
router.post("/offers", createVendorOffers);

/**
 * get vendor offers
 */
router.get("/offers", getVendorOffers);

/**
 * update vendor offers
 */
router.put("/offers/:id", updateVendorOffers);

/**
 * delete vendor offers
 */
router.delete("/offers/:id", deleteVendorOffers);

export { router as vendorRoute };
