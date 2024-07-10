import express, { Request, Response, NextFunction } from "express";
import { generateUUIDWithNamespace } from "../utils";
import { ICart, UserModel } from "../models/user.model";
import { OrderInputs } from "../dto/cart.dto";
import { FoodModel } from "../models/food.model";

/**
 * create or add to cart
 */
export const addtoCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get current user
  const user = req.user;

  if (user) {
    // create a unique orderid
    const cartId = generateUUIDWithNamespace(
      `${user._id}-${new Date().toISOString()}`
    );

    // getting all the order from body
    const { _id: foodId, count } = <OrderInputs>req.body;

    // get user profile
    const userProfile = await UserModel.findById(user._id).populate(
      "cart.food"
    );
    const food = await FoodModel.findById(foodId);

    if (userProfile && food) {
      // get user cart items
      const cartItems = userProfile.cart;

      let existFoodItemInCart = cartItems.filter(
        (item) => item.food._id.toString() === foodId
      );

      if (existFoodItemInCart.length > 0) {
        // check and update cart
        const itemIndex = cartItems.indexOf(existFoodItemInCart[0]);
        if (count > 0) {
          cartItems[itemIndex].count = count;
        } else {
          // remove item count < 0
          cartItems.splice(itemIndex, 1);
        }
        userProfile.cart = cartItems;
      } else {
        // push to cart and update user
        userProfile.cart.push({
          food: food,
          count: count,
          total: count * parseInt(food.price),
        });
      }
      const result = await userProfile.save();
      return res
        .status(201)
        .json({ message: "cart updated successfully", data: result.cart });
    }
    return res
      .status(400)
      .json({ message: "failed to place order. No items found" });
  }

  return res.status(404).json({ message: "user not found" });
};

/**
 * get cart of user
 */
export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const profile = await UserModel.findById(user._id).populate("cart.food");
    if (profile) {
      return res.status(200).json(profile.cart);
    }
  }

  return res.status(404).json({ message: "cart is empty" });
};

/**
 * delete or clear cart
 */
export const deleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const profile = await UserModel.findById(user._id).populate("cart.food");
    if (profile !== null) {
      profile.cart = [] as unknown as [ICart];
      const result = await profile.save();
      return res.status(200).json(result);
    }
  }

  return res.status(404).json({ message: "cart is already empty" });
};
