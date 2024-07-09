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
  const userSignupInputs = plainToClass(SignupUserInputs, req.body);

  const InputErrors = await validate(userSignupInputs, {
    ValidationError: { target: true },
  });

  if (InputErrors.length > 0) {
    return res.status(411).json(InputErrors);
  }

  const { email, password, phone } = userSignupInputs;

  const salt = await generateSalt();
  const hashedPwd = await hashPassword(password, salt);

  const { otp, expiry: otp_expiry } = await generateOneTimePassword();

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
    // response
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
) => {};

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
