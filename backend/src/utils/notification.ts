// module for notification utility functions

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
    
};
