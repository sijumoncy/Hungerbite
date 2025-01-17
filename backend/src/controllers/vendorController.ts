import express, { Request, Response, NextFunction } from "express";
import {
  CreateOfferInputs,
  IUpdateVendorProfileInputs,
  IVendorLoginInputs,
} from "../dto";
import { findVendor } from "./adminController";
import { verifyPassword } from "../utils";
import { generateToken } from "../utils/token";
import { ICreateFoodInput } from "../dto/food.dto";
import { FoodModel } from "../models/food.model";
import { OrderModel } from "../models/order.model";
import { IVendorDoc, OfferModel, VendorModel } from "../models";

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

/**
 * get orders of vendor
 */
export const getVendorOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = req.user;

  if (vendor) {
    const orders = await OrderModel.find({ vendorId: vendor._id }).populate(
      "item.food"
    );

    if (orders?.length > 0) {
      return res.status(200).json(orders);
    }
  }
  return res.status(404).json({ message: "order not found" });
};

/**
 * get vendor order by id
 */
export const getVendorOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = req.user;
  const orderId = req.params.id;

  if (vendor && orderId) {
    const order = await OrderModel.findOne({
      vendorId: vendor._id,
      orderId: orderId,
    }).populate("item.food");

    if (order) {
      return res.status(200).json(order);
    }
  }
  return res.status(404).json({ message: "order not found" });
};

/**
 * update vendor order status
 */
export const processVendorOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = req.user;
  const orderId = req.params.id;
  const { status, remarks, time } = req.body;

  if (vendor && orderId) {
    const order = await OrderModel.findById(orderId).populate("food");

    order.orderStatus = status;
    order.remarks = remarks;
    if (time) {
      order.readyTime = time;
    }

    const orderResult = await order.save();
    if (orderResult) {
      return res
        .status(201)
        .json({ message: "order status updated", data: orderResult });
    }
  }
  return res.status(400).json({ message: "unable to process the order" });
};

/**
 * add vendor offers
 */
export const createVendorOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = req.user;

  if (vendor) {
    const {
      title,
      description,
      offerType,
      offerPrice,
      pincode,
      promoCode,
      promoType,
      validFrom,
      validTill,
      bank,
      bankIdentificationNumber,
      isActive,
      minPurchase,
    } = <CreateOfferInputs>req.body;

    const existingVendor = await findVendor(vendor._id);
    if (existingVendor) {
      const offerCreated = await OfferModel.create({
        title,
        description,
        offerType,
        offerPrice,
        pincode,
        promoCode,
        promoType,
        validFrom,
        validTill,
        bank,
        bankIdentificationNumber,
        isActive,
        minPurchase,
        vendors: [existingVendor],
      });

      if (offerCreated) {
        return res
          .status(201)
          .json({ message: "Offer Created Successfully", data: offerCreated });
      }
    }
    return res.status(400).json({ message: "failed to create offer" });
  }
};

/**
 * get vendor offers
 */
export const getVendorOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = req.user;
  if (vendor) {
    let vendorOffers = Array();
    const offers = await OfferModel.find().populate("vendors");

    if (offers) {
      // get vendor specific and generic offers
      offers.forEach((offer) => {
        if (offer.vendors?.length > 0) {
          offer.vendors.forEach((vn) => {
            if (vn._id.toString() === vendor._id) {
              vendorOffers.push(offer);
            }
          });
        }

        if (offer.offerType === "GENERIC") {
          vendorOffers.push(offer);
        }
      });

      return res.status(200).json(vendorOffers);
    }
  }

  return res.status(404).json({ message: "Offer not found" });
};
/**
 * edit vendor offers
 */
export const updateVendorOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = req.user;
  const offerId = req.params.id;

  if (vendor) {
    const {
      title,
      description,
      offerType,
      offerPrice,
      pincode,
      promoCode,
      promoType,
      validFrom,
      validTill,
      bank,
      bankIdentificationNumber,
      isActive,
      minPurchase,
    } = <CreateOfferInputs>req.body;

    // getting current offer with id
    const currentOffer = await OfferModel.findById(offerId);

    if (currentOffer) {
      const existingVendor = await findVendor(vendor._id);

      if (existingVendor) {
        currentOffer.title = title;
        currentOffer.description = description;
        currentOffer.offerType = offerType;
        currentOffer.offerPrice = offerPrice;
        currentOffer.pincode = pincode;
        currentOffer.promoCode = promoCode;
        currentOffer.promoType = promoType;
        currentOffer.validFrom = validFrom;
        currentOffer.validTill = validTill;
        currentOffer.bank = bank;
        currentOffer.bankIdentificationNumber = bankIdentificationNumber;
        currentOffer.isActive = isActive;
        currentOffer.minPurchase = minPurchase;

        const updatedResult = await currentOffer.save();
        return res
          .status(201)
          .json({ message: "updated offer successfully", data: updatedResult });
      }
    }
    return res.status(400).json({ message: "failed to create offer" });
  }
};
/**
 * delete vendor offers
 */
export const deleteVendorOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = req.user;
  const offerId = req.params.id;

  if (vendor && offerId) {
    const offer = await OfferModel.findById(offerId).populate("vendors");

    /**
     * check the vendor is in the offer vendors list
     * delete offer directly if it is GENERIC type
     * if yes remove from the list
     * if list empty remove the offer
     */
    if (offer) {
      const filteredVendorsList = offer.vendors.filter(
        (vn) => vn._id.toString() !== vendor._id.toString()
      );

      if (filteredVendorsList.length > 0 && offer.offerType !== "GENERIC") {
        offer.vendors = filteredVendorsList as [IVendorDoc];
        await offer.save();
      } else {
        await offer.deleteOne();
      }
      return res.status(200).json({ message: "offer successfully deleted" });
    }
  }

  return res.status(411).json({ message: "Offer not found" });
};
