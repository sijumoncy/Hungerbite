import express, { NextFunction, Request, Response } from "express";

import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { SignupUserInputs } from "../dto/user.dto";
import {
  generateOneTimePassword,
  generateSalt,
  hashPassword,
  sendOTP,
} from "../utils";
import { UserModel } from "../models/user.model";
import { generateToken } from "../utils/token";

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
    ValidationError: { target: true },
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
) => {};

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
 * otp generate
 */
export const generateOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

/**
 * get user profile
 */
export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

/**
 * update user profile
 */
export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
