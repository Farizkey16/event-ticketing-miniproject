import { JwtPayload, verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

export const VerifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new Error("Token is not found. Login is required.")
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
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }
};


export default VerifyToken;