import express from "express";

import { adminRoute, vendorRoute } from "./routes";

const app = express();

/**
 * Config Routes
 */
app.use("/admin", adminRoute);
app.use("/vendor", vendorRoute);

app.listen(8000, () => {
  console.log(`Server running on port ${8000}`);
});
