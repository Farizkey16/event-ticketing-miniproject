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
    const token = req.cookies.token
    //  const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return next(new AppError("Token not found. Login is required.", 401))
    }

    const payload = jwt.verify(token, process.env.JWT_TOKEN as string) as JwtPayload & {
        id: number;
        username: string;
        email: string;
        role: string;
    }

    res.locals.user = payload
    console.log(payload)

    return next();

  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
};


export default VerifyToken;