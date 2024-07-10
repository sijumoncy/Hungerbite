import express, { Application } from "express";

import { adminRoute, vendorRoute, shoppingRoute, userRoute } from "./routes";
import path from "path";

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // image storage path config
  app.use("/images", express.static(path.join(__dirname, "images")));

  /**
   * Config Routes
   */
  app.use("/admin", adminRoute);
  app.use("/vendor", vendorRoute);
  app.use("/shopping", shoppingRoute);
  app.use("/user", userRoute);

  return app;
};
