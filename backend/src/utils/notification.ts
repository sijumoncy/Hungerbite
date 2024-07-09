// module for notification utility functions

import dotenv from "../config/dotenv";

/**
 * otp notification
 */
export const generateOneTimePassword = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 10 * 60 * 1000);
  return { otp, expiry };
};

/**
 * send OTP
 * with twilio
 */
export const sendOTP = async (otp: number, phone: string) => {
  const twilioaccId = dotenv.TWILLIO_ACC_ID;
  const twilioToken = dotenv.TWILLIO_TOKEN;
  const twilioClient = require("twilio")(twilioaccId, twilioToken);

  const response = await twilioClient.messages.create({
    body: `Your OTP is ${otp}. Do not share your OTP.`,
    from: dotenv.TWILLIO_NUMBER,
    // INFO : later can be change with user expandable locations
    to: `+91${phone}`,
  });

  return response;
};
