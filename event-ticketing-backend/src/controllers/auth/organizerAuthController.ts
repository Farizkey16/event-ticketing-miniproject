import { NextFunction, Request, Response } from "express";
import { compare } from "bcrypt";
import { Jwt, sign } from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import dayjs from "dayjs";
import bcrypt from "bcrypt";

class OrganizerAuthController {
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check availability

      const email = req.body.email?.trim().toLowerCase();
      const username = req.body.username?.trim();
      const password = req.body.password;

      if (!email || !username || !password) {
        res.status(400).send({
          success: false,
          message: "Email, username, and password are required.",
        });
        return;
      }

      const checkOrganizer = await prisma.organizer_account.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (checkOrganizer) {
        res.status(400).send({
          success: false,
          message: "Email or username already exists.",
        });
        return;
      }

      // Registering User
      const hashedPassword = await bcrypt.hash(password, 10);
      const organizer = await prisma.organizer_account.create({
        data: {
          email,
          username,
          password: hashedPassword,
          role: "organizer",
          organizer_profile: {
            create: {
              organizer_name: "",
              organizer_address: "",
              organizer_phone: 0,
              organizer_profile_image: "",
            },
          },
        },
        include: {
          organizer_profile: true,
        },
      });

      // Sending response
      res.status(201).send({
        success: true,
        message: `New organizer for ${req.body.email} has been registered.`,
        data: {
          id: organizer.id,
          email: organizer.email,
          username: organizer.username,
          profile: organizer.organizer_profile,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Check Organizer
    const checkOrganizer = await prisma.organizer_account.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!checkOrganizer) {
      throw new Error("No account with that email exists.");
    }

    // Comparing Password
    const passwordCompare = compare(req.body.password, checkOrganizer.password);

    if (!passwordCompare) {
      throw new Error("Your entered password is incorrect.");
    }

    // Token
    const token = sign(
      {
        id: checkOrganizer.id,
        email: checkOrganizer.email,
        role: checkOrganizer.role,
      },
      process.env.JWT_TOKEN as string,
      { expiresIn: "2h" }
    );

    res.status(200).send({
      success: true,
      message: "Log in successful",
      data: checkOrganizer,
      token: token,
    });
  };
}

export default OrganizerAuthController;
