import express, { NextFunction, Request, Response } from "express";
import { authenticate } from "../middlewares/commonAuth";
import { createOrder, getOrderById, getOrders } from "../controllers";

const router = express.Router();

// =========== Authorized ===============

router.use(authenticate);

/**
 * create orders
 */
router.post("/", createOrder);

/**
 * get orders
 */
router.post("/", getOrders);

/**
 * get order by id
 */
router.post("/:id", getOrderById);

export { router as orderRoute };
