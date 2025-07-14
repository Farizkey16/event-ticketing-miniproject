import { Request, Response, NextFunction } from "express";

export const CookieDebugger = (req: Request, res: Response, next: NextFunction) => {
  console.log("Cookies:", req.cookies);
  next();
};

