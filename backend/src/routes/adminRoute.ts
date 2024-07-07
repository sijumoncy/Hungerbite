import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log("in admin route");
  res.json({message : 'admin route'})
});

export { router as adminRoute };
