import express, { NextFunction, Request, Response } from "express";
import { createVendor, getVendorById, getVendors } from "../controllers";

const router = express.Router();

/**
 * create vendor
 */
router.post("/vendor", createVendor);

/**
 * get vendors
 */
router.get("/vendor", getVendors);

/**
 * get vendor by id
 */
router.get("/vendor/:id", getVendorById);

// TODO : handle unknown endpoits

export { router as adminRoute };
