import express from "express";
import bodyParser from "body-parser";

import { adminRoute, vendorRoute } from "./routes";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Config Routes
 */
app.use("/admin", adminRoute);
app.use("/vendor", vendorRoute);

app.listen(8000, () => {
  console.clear();
  console.log(`Server running on port ${8000}`);
});
