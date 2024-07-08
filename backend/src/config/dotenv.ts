import "dotenv/config";

export default {
  MONGO_URI: process.env.MONGO_URI || "",
  PORT: process.env.PORT || 8000,
};
