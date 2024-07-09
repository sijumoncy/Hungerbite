import express, { NextFunction, Request, Response } from "express";
import {
  getFoodAvailability,
  getFoodInCertainTime,
  getRestaurantDetails,
  getTopRestaurants,
  searchFoods,
} from "../controllers";

const router = express.Router();

/**
 * check food availability based on pincode
 * TODO : leverage to location based
 */
router.get("/:pincode", getFoodAvailability);

/**
 * get top rated restaurants in the location
 */
router.get("/top-restaurants/:pincode", getTopRestaurants);

/**
 * food available in certain time
 */
router.get("/food-in-given-time/:pincode/:time", getFoodInCertainTime);

/**
 * search food in the location
 */
router.get("/search-food/:pincode", searchFoods);

/**
 * find restaurants and details
 */
router.get("/restaurants/:id", getRestaurantDetails);

export { router as shoppingRoute };
