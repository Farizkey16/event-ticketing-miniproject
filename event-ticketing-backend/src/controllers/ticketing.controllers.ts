import { NextFunction, Request, Response } from "express";
import { compare } from "bcrypt";
import { Jwt } from "jsonwebtoken";
import { prisma } from "../config/prisma";

class TicketingController {
  // Registration

  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Check availability
      const checkUser = await prisma.user_account.findUnique({
        where: {
          email: req.body.email,
          username: req.body.username,
        },
      });

      if (checkUser) {
        throw new Error(
          "The user with this email or username has already exist."
        );
      }

      // Registering User
      const registerUser = await prisma.user_account.create({
        data: {
          ...req.body,
          password: req.body.password,
          role: req.body.role || "user",
        },
      });

      // Sending response
      res.status(201).send({
        success: true,
        message: `New user for ${req.body.email} has been registered.`,
        data: registerUser,
      });
    } catch (err) {
        next(err)
    }
  }
}

export default TicketingController;
