import express from "express";
import bodyParser from "body-parser";

import { adminRoute, vendorRoute } from "./routes";
import { connectDB } from "./config/db";
import dotenv from "./config/dotenv";

const PORT = dotenv.PORT;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Config Routes
 */
app.use("/admin", adminRoute);
app.use("/vendor", vendorRoute);

/**
 * Connect database
 */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
