import express, { Application } from "express";
import bodyParser from "body-parser";

import { adminRoute, vendorRoute } from "./routes";
import path from "path";
import { shoppingRoute } from "./routes";

export default async (app: Application) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // image storage path config
  app.use("/images", express.static(path.join(__dirname, "images")));

  /**
   * Config Routes
   */
  app.use("/admin", adminRoute);
  app.use("/vendor", vendorRoute);
  app.use("/shopping", shoppingRoute);

  return app;
};
