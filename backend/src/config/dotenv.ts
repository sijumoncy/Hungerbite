import "dotenv/config";

export default {
  MONGO_URI: process.env.MONGO_URI || "",
  PORT: process.env.PORT || 8000,
  JWT_SECRET: process.env.JWT_SECRET || "jwt_secret",
  TWILLIO_ACC_ID: process.env.TWILLIO_ACC_ID || "",
  TWILLIO_TOKEN: process.env.TWILLIO_TOKEN || "",
  TWILLIO_NUMBER: process.env.TWILLIO_NUMBER || "",
};
