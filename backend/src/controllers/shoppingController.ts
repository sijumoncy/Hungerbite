import express, { NextFunction, Request, Response } from "express";
import { VendorModel } from "../models";
import { IFoodDoc } from "../models/food.model";

export const getFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userPincode = req.params.pincode;

  const result = await VendorModel.find({
    pincode: userPincode,
    serviceAvailable: true,
  })
    .sort([["rating", "desc"]])
    .populate("foods");

  if (result.length > 0) {
    //TODO : add status code returning in all response
    return res.json(result);
  }
  return res.status(400).json({ message: "No food available" });
};

export const getTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userPincode = req.params.pincode;

  const result = await VendorModel.find({
    pincode: userPincode,
    serviceAvailable: true,
  })
    .sort([["rating", "desc"]])
    .limit(10);

  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(400).json({ message: "No restaurants found" });
};

export const getFoodInCertainTime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userPincode = req.params.pincode;
  const time = parseInt(req.params.time);

  const result = await VendorModel.find({
    pincode: userPincode,
    serviceAvailable: true,
  }).populate("foods");

  if (result.length > 0) {
    let foodsArr: IFoodDoc[] = [];
    result.map((vendor) => {
      const foods = vendor.foods as [IFoodDoc];
      foodsArr.push(
        ...foods.filter((food) => parseInt(food.readyTime) <= time)
      );
    });

    return res.status(200).json(foodsArr || []);
  }

  return res.status(400).json({ message: "No food available" });
};

export const searchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getRestaurantDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
