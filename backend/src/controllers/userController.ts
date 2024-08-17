import express, { NextFunction, Request, Response } from "express";

import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import {
  SignupUserInputs,
  LoginUserInputs,
  UpdateUserProfileInputs,
} from "../dto/user.dto";
import {
  generateOneTimePassword,
  generateSalt,
  hashPassword,
  sendOTP,
  verifyPassword,
} from "../utils";
import { UserModel } from "../models/user.model";
import { generateToken } from "../utils/token";
import { OfferModel, OrderModel, TransactionModel } from "../models";

/**
 * signup user
 */
export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // validate user data
  const userSignupInputs = plainToClass(SignupUserInputs, req.body);

  const InputErrors = await validate(userSignupInputs, {
    validationError: { target: true },
  });

  if (InputErrors.length > 0) {
    return res.status(411).json(InputErrors);
  }

  const { email, password, phone } = userSignupInputs;

  // check for existing user
  const existingUser = await UserModel.findOne({ email: email });

  if (existingUser !== null) {
    return res.status(409).json({ message: "Account already exist" });
  }

  // generate hashed pwd
  const salt = await generateSalt();
  const hashedPwd = await hashPassword(password, salt);

  // generate otp
  const { otp, expiry: otp_expiry } = await generateOneTimePassword();

  // create user
  const result = await UserModel.create({
    email: email,
    password: hashedPwd,
    salt: salt,
    otp: otp,
    phone: phone,
    otp_expiry: otp_expiry,
    firstName: "",
    lastName: "",
    address: "",
    verified: false,
    lat: 0,
    lng: 0,
    order: [],
  });

  if (result) {
    // send otp
    const response = await sendOTP(otp, phone);
    // generate Token
    const token = await generateToken({
      _id: result.id,
      email: result.email,
      verified: result.verified,
    });

    return res.status(201).json({
      message: "registration successful. Please verify your account",
      data: {
        token: token,
        email: result.email,
        verified: result.verified,
        id: result.id,
      },
    });
  }

  return res.status(400).json({ message: "signup failed" });
};

/**
 * user login
 */
export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInputs = plainToClass(LoginUserInputs, req.body);
  const loginErrors = await validate(loginInputs, {
    validationError: { target: false },
  });

  if (loginErrors.length > 0) {
    return res
      .status(411)
      .json({ message: "input validation error", error: loginErrors });
  }

  const { email, password } = loginInputs;

  const existingUser = await UserModel.findOne({ email: email });

  if (existingUser) {
    const validation = await verifyPassword(
      password,
      existingUser.password,
      existingUser.salt
    );

    if (validation) {
      const token = await generateToken({
        _id: existingUser.id,
        email: existingUser.email,
        verified: existingUser.verified,
      });

      return res
        .status(201)
        .json({ message: "login successful", token: token });
    }

    return res.status(404).json({ message: "invalid password" });
  }

  return res
    .status(404)
    .json({ message: "user not found. please register to continue" });
};

/**
 * verify user
 */
export const userVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  // TODO : need to take care userId also in input if verification without auth
  const user = req.user;
  if (user) {
    const profile = await UserModel.findById(user._id);
    if (profile) {
      // verify otp and expiry time
      if (profile.otp === parseInt(otp) && profile.otp_expiry <= new Date()) {
        profile.verified = true;
        const updatedUser = await profile.save();

        // re generate token with verified true
        const token = await generateToken({
          _id: updatedUser.id,
          email: updatedUser.email,
          verified: updatedUser.verified,
        });

        return res.status(201).json({
          message: "verified successfully",
          data: {
            token: token,
            email: updatedUser.email,
            verified: updatedUser.verified,
            id: updatedUser.id,
          },
        });
      }
    }
  }
  return res.status(400).json({ message: "verification failed" });
};

/**
 * otp generate with auth after login
 */
export const generateOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const profile = await UserModel.findById(user._id);

    if (profile) {
      const { otp, expiry } = await generateOneTimePassword();

      profile.otp = otp;
      profile.otp_expiry = expiry;

      const response = await sendOTP(otp, profile.phone);

      return res
        .status(200)
        .json({ message: "OTP sent to your registered phone number" });
    }
  }

  return res.status(404).json({ message: "user not found" });
};

/**
 * get user profile
 */
export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const userProfile = await UserModel.findById(user._id);
    if (userProfile) {
      res.status(200).json(userProfile);
    }
  }

  return res.status(404).json({ message: "user not found" });
};

/**
 * update user profile
 */
export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  const updateProfileInputs = plainToClass(UpdateUserProfileInputs, req.body);
  const profileUpdateError = await validate(updateProfileInputs, {
    validationError: { target: false },
  });

  if (profileUpdateError.length > 0) {
    return res.status(400).json(profileUpdateError);
  }

  const { address, firstName, lastName } = updateProfileInputs;

  if (user) {
    const profile = await UserModel.findById(user._id);
    if (profile) {
      profile.address = address;
      profile.firstName = firstName;
      profile.lastName = lastName;
      const result = await profile.save();

      return res
        .status(201)
        .json({ message: "profile updated successfully", data: result });
    }
  }

  return res.status(404).json({ message: "failed to update profile" });
};

/**
 * validate and apply offer
 */
export const validateOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const offerId = req.params._id;
  const offer = await OfferModel.findById(offerId);
  if (offer && offer.isActive) {
    if (offer.validTill >= new Date()) {
      return res
        .status(200)
        .json({ message: "offer valid", valid: true, offer: offer });
    }
    offer.isActive = false;
    await offer.save();
  }
  return res.status(400).json({ message: "Offer Expired", valid: false });
};

// ======================== Delivery =============================

export const assignOrderForDelivery = async (orderId: string) => {
  // get the vendor
  // get available delivery rider
  // find nearest delivery rider
  // update delivery Id and order status
};

// ======================== PAYMENT ================================

/**
 * generate payment for the order
 */
export const generatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { orderId, paymentMode, offerId } = req.body;
  if (user) {
    // calculate payment from orderId
    const order = await OrderModel.findById(orderId);

    if (order && order.orderStatus !== "rejected") {
      // get offer price else consider as 0
      const offer = await OfferModel.findById(offerId);
      const offerPrice =
        offer?.offerPrice > 0 && offer.isActive ? offer.offerPrice : 0;
      // calculate payable amount
      const orderTotalAmount = order.totalAmount;
      const payableAmount = orderTotalAmount - offerPrice;

      // TODO : setup and add gateway + gateway charge etc logic here ========================
      // TODO : transaction Id need to connect with order to update order status

      // add transaction record of the purchase
      const transaction = await TransactionModel.create({
        user: user._id,
        vendorId: order.vendorId,
        orderId: order.orderId,
        orderAmount: orderTotalAmount,
        transactionAmount: payableAmount,
        offerUsed: offer || "NA",
        status: "PENDING",
        paymentMode: paymentMode,
        paymentResponse: "",
      });

      // assign Delivery
      await assignOrderForDelivery(orderId);

      // return the transaction details
      return res.status(201).json({ message: "success", data: transaction });
    }
    return res.status(400).json({
      message: "unable to find order details or order not accepting ",
    });
  }
  return res
    .status(400)
    .json({ message: "unable to generate payment details" });
};
