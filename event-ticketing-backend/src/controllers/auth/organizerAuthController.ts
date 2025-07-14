import { NextFunction, Request, Response } from "express";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";
import AppError from "../../errors/AppError";
import { serialize } from "cookie";

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

      const existingOrganizer = await prisma.organizer_account.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingOrganizer) {
        throw new AppError(
          "There is already an organizer with this email/username",
          409
        );
      }

      // Registering organizer
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
              organizer_phone: "0",
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

    try{
    // Check Organizer
    const existingOrganizer = await prisma.organizer_account.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!existingOrganizer) {
      throw new AppError("No account with that email exists.", 404);
    }

    // Comparing Password
    const passwordCompare = await compare(
      req.body.password,
      existingOrganizer.password
    );

    if (!passwordCompare) {
      throw new AppError("Your entered password is incorrect.", 400);
    }

    // Token
    const token = sign(
      {
        id: existingOrganizer.id,
        email: existingOrganizer.email,
        role: existingOrganizer.role,
      },
      process.env.JWT_TOKEN as string,
      { expiresIn: "2h" }
    );

    // Set HTTP-only Cookie --> safer unlike localstorage, and immune to middle-man attacks
    // Stored in cookie in front-end
    // res.setHeader(
    //   "Set-Cookie",
    //   serialize("token", token, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "none",
    //     path: "/",
    //     maxAge: 60 * 60 * 2,
    //   })
    // );
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2 * 1000
    })

    res.status(200).send({
      success: true,
      message: "Log in successful",
      data: existingOrganizer,
      token: token,
    });
    return;

  } catch(err) {
    console.error(err);
    if (!res.headersSent) {
      return next(err)
    }
    return next(err)
  }
  };

  public logout = async (req: Request, res: Response) => {
    const cookie = serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    res.setHeader("Set-Cookie", cookie);
    res.status(200).json({ success: true, message: "Logged out." });
  };
}

export default OrganizerAuthController;
