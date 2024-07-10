// cart is for multi device syncing
import express, { NextFunction, Request, Response } from "express";
import { authenticate } from "../middlewares/commonAuth";
import {
  addtoCart,
  deleteCart,
  getCart,
} from "../controllers/cartController";

const router = express.Router();

// =========== Authorized ===============

router.use(authenticate);

/**
 * create cart
 */
router.post("/", addtoCart);

/**
 * get cart
 */
router.post("/", getCart);

/**
 * delete cart
 */
router.post("/:id", deleteCart);

export { router as cartRoute };
