import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log("in vendor routes");
  res.json({ message: "vendor route" });
});

export { router as vendorRoute };
