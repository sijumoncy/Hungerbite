import express, { Request, Response, NextFunction } from "express";
import { generateUUIDWithNamespace } from "../utils";
import { UserModel } from "../models/user.model";
import { OrderInputs } from "../dto/cart.dto";
import { FoodModel } from "../models/food.model";
import { OrderItem, OrderModel } from "../models/order.model";

/**
 * create order and update relations
 */
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get current user
  const user = req.user;

  if (user) {
    // create a unique orderid
    const orderId = generateUUIDWithNamespace(
      `${user._id}-${new Date().toISOString()}`
    );

    // getting all the order from body
    const cart = <[OrderInputs]>req.body;

    // get user profile
    const userProfile = await UserModel.findById(user._id);

    if (userProfile) {
      // get details of the ordered items and calculate total price and items
      const foods = await FoodModel.find()
        .where("_id")
        .in(cart.map((item) => item._id))
        .exec();

      const cartItems: OrderItem[] = [];
      let totalAmount = 0;

      foods.map((food) =>
        cart.map(({ _id, count }) => {
          if (food._id == _id) {
            const currentFoodTotal = parseInt(food.price) * count;
            totalAmount += currentFoodTotal;
            cartItems.push({ food, count, total: currentFoodTotal });
          }
        })
      );

      // create order object with items list
      if (cartItems.length > 0) {
        const newOrder = await OrderModel.create({
          orderId: orderId,
          vendorId: foods[0].vendorId,
          items: cartItems,
          totalAmount: totalAmount,
          orderDate: new Date(),
          paymentMode: "COD",
          paymentResponse: "",
          orderStatus: "pending",
        });

        if (newOrder) {
          // update orders to user acc ( relation )
          userProfile.orders.push(newOrder);
          await userProfile.save();

          return res.status(201).json({
            message: "order placed successfully.",
            data: newOrder,
          });
        }
      }

      return res
        .status(400)
        .json({ message: "failed to place order. No items found" });
    }
  }

  return res.status(404).json({ message: "user not found" });
};

/**
 * get all orders of user
 */
export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const profile = await UserModel.findById(user._id);
    if (profile) {
      return res.status(200).json(profile.orders);
    }
  }

  return res.status(404).json({ message: "user not found" });
};

/**
 * get order details of the user by id
 */
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const orderId = req.params.id;

  if (user && orderId) {
    const userProfile = await UserModel.findById(user._id).populate({
      path: "orders",
      match: { _id: orderId },
      populate: {
        path: "items.food",
        model: "food",
      },
    });
    if (userProfile) {
      return res.status(200).json(userProfile.orders);
    }
  }

  return res.status(404).json({ message: "order not found" });
};
