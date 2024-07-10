// cart is for multi device syncing
import express, { NextFunction, Request, Response } from "express";
import { authenticate } from "../middlewares/commonAuth";
import {
  addtoCart,
  deleteCartById,
  getCart,
  getCartById,
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
 * get cart by id
 */
router.post("/:id", getCartById);

/**
 * delete cart
 */
router.post("/:id", deleteCartById);

export { router as cartRoute };
