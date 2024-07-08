import express, { NextFunction, Request, Response } from "express";
import { vendorLogin } from "../controllers";

const router = express.Router();

/**
 * Vendor login
 */
router.post("/login", vendorLogin);

export { router as vendorRoute };
