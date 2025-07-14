import { JwtPayload, verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import AppError from "../errors/AppError";

export const VerifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new AppError("Token not found. Login is required.", 404)
    }

    const payload = jwt.verify(token, process.env.JWT_TOKEN as string) as JwtPayload & {
        id: number;
        email: string;
        role: string;
    }

    res.locals.user = payload
    console.log(payload)

    next();

  } catch (err) {
    throw new AppError("Invalid or expired token.", 403)
  }
};


export default VerifyToken;