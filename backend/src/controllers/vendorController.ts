import express, { Request, Response, NextFunction } from "express";
import { IUpdateVendorProfileInputs, IVendorLoginInputs } from "../dto";
import { findVendor } from "./adminController";
import { verifyPassword } from "../utils";
import { generateToken } from "../utils/token";
import { ICreateFoodInput } from "../dto/food.dto";
import { FoodModel } from "../models/food.model";

/**
 * Vendor Login
 */
export const vendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <IVendorLoginInputs>req.body;

  const vendor = await findVendor(undefined, email);

  if (vendor !== null) {
    // validation
    const validated = await verifyPassword(
      password,
      vendor.password,
      vendor.salt
    );
    if (validated) {
      const token = generateToken({
        _id: vendor.id,
        email: vendor.email,
        foodTypes: vendor.foodType,
        name: vendor.name,
      });
      return res.json({ message: "Login successful", token: token });
    } else {
      return res.json({ message: "password is not valid" });
    }
  }

  return res.json({ message: "login credential not valid" });
};

/**
 * Get Vendor Profile
 */
export const getVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVendor = await findVendor(user._id);
    return res.json(existingVendor);
  }
  return res.json({ message: "vendor not found" });
};

/**
 * update Vendor Profile
 */
export const updateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { address, foodTypes, name, phone } = <IUpdateVendorProfileInputs>(
    req.body
  );
  const user = req.user;
  if (user) {
    const existingVendor = await findVendor(user._id);
    if (existingVendor !== null) {
      existingVendor.name = name;
      existingVendor.address = address;
      existingVendor.foodType = foodTypes;
      existingVendor.phone = phone;

      const updatedVendor = await existingVendor.save();
      return res.json({ message: "updated successfully", data: updatedVendor });
    }

    return res.json(existingVendor);
  }
  return res.json({ message: "vendor not found" });
};

/**
 * update Vendor Cover Image
 */
export const updateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const vendor = await findVendor(user._id);
    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];
      const images = files.map((file) => file.filename);

      vendor.coverImages.push(...images);
      const result = vendor.save();

      return res.json({
        message: "cover images updated successfully",
        data: result,
      });
    }
  }
  return res.json({ message: "failed to update cover images." });
};

/**
 * update Vendor Profile
 */
export const updateVendorServiceAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVendor = await findVendor(user._id);
    if (existingVendor !== null) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
      const updatedVendor = await existingVendor.save();
      return res.json({ message: "updated successfully", data: updatedVendor });
    }

    return res.json(existingVendor);
  }
  return res.json({ message: "vendor not found" });
};

/**
 * Food create
 */
export const addFoodController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const { category, description, foodType, name, price, readyTime } = <
      ICreateFoodInput
    >req.body;

    const vendor = await findVendor(user._id);
    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];
      const images = files.map((file) => file.filename);

      const createdFood = await FoodModel.create({
        vendorId: vendor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        readyTime: readyTime,
        price: price,
        rating: 0,
        images: images,
      });

      vendor.foods.push(createdFood);
      const result = vendor.save();

      return res.json({ message: "food added successfully ", data: result });
    }
  }
  return res.json({ message: "failed to add food." });
};

/**
 * Get Food by filters
 * id , vendorId , category
 */
export const findFood = async (
  id: string | undefined,
  vendorId?: string,
  category?: string
) => {
  if (vendorId) {
    return await FoodModel.findOne({ vendorId: vendorId });
  } else if (category) {
    return await FoodModel.findOne({ category: category });
  } else {
    return await FoodModel.findById(id);
  }
};

/**
 * get all food
 * TODO : implement pagination later
 */
export const getFoodController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const food = await FoodModel.find();
  return food || [];
};

/**
 * find by id
 */
export const getFoodById = async (id: string) => {
  return findFood(id);
};
