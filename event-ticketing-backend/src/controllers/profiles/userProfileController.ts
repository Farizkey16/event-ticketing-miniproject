import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { compare } from "bcrypt";
import nodemailer from "nodemailer";
import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";
import { cloudinaryUpload } from "../../config/cloudinary";
import { hashPassword } from "../../utils/hash";
import AppError from "../../errors/AppError";
import { hash } from "crypto";

class UserProfile {
  public editProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = res.locals.user;
      const {
        user_fullname,
        user_date_of_birth,
        user_phone,
        user_profile_image,
      } = req.body;

      // Check authorization role user
      if (user.role !== "user") {
        throw new AppError("You are not allowed to access this page.", 403);
      }

      // Check existing user account
      const existingUser = await prisma.user_account.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!existingUser) {
        throw new AppError("This account does not exist.", 404);
      }

      if (!user_fullname || !user_date_of_birth || !user_phone) {
        throw new AppError("Missing required profile fields.", 400);
      }

      // Check existing user profile
      const profile = await prisma.user_profile.findUnique({
        where: {
          user_id: user.id,
        },
      });

      if (!profile) {
        throw new AppError("User profile not found", 404);
      }

      const updatedProfile = await prisma.user_profile.update({
        where: {
          id: profile.id,
        },
        data: {
          user_fullname,
          user_date_of_birth,
          user_phone,
          user_profile_image,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      res.status(200).send({
        success: true,
        message: "Your profile has been changed.",
        data: updatedProfile,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  public changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = res.locals.user;

      const { old_password, new_password } = req.body;

      const hashedPassword = await hashPassword(new_password, 10);

      const userReset = await prisma.user_account.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!userReset) {
        throw new AppError("No user account is found from the id.", 404);
      }

      const isMatch = await compare(old_password, userReset.password);

      if (!isMatch) {
        throw new AppError("Wrong password.", 401);
      }

      await prisma.user_account.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
        },
      });

      res.status(200).send({
        success: true,
        message: "Password has been changed successfully.",
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;

      if (!email) {
        throw new AppError("Email required.", 400);
      }

      const findUser = await prisma.user_account.findUnique({
        where: {
          email,
        },
      });

      if (!findUser) {
        throw new AppError("No account found with that email.", 404);
      }

      const token = jwt.sign(
        { id: findUser.id, role: "user" },
        process.env.JWT_TOKEN as string,
        { expiresIn: "20m" }
      );

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.MAIL_SENDER,
          pass: process.env.MAIL_PASS,
        },
      });

      const resetLink = process.env.FRONTEND_URL;

      await transporter.sendMail({
        from: process.env.MAIL_SENDER,
        to: findUser.email,
        subject: "Password Reset",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 20 minutes.</p>`,
      });

      res.status(200).send({
        success: true,
        message: "Password reset email sent.",
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  public confirmResetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { token, newPassword } = req.body;

      const payload = jwt.verify(
        token,
        process.env.JWT_TOKEN as string
      ) as JwtPayload & {
        id: number;
      };

      const userCheck = await prisma.user_account.findUnique({
        where: {
          id: payload.id,
        },
      });

      if (!userCheck) {
        throw new AppError("User not found.", 404);
      }

      const hashedPassword = await hashPassword(newPassword, 10);

      await prisma.user_account.update({
        where: {
          id: payload.id,
        },
        data: {
          password: hashedPassword,
        },
      });

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.MAIL_SENDER,
          pass: process.env.MAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.MAIL_SENDER,
        to: userCheck.email,
        subject: "Password Reset Successful",
        html: `Your password has been reset successfully`,
      });

      res.status(200).send({
        success: true,
        message: "New password successfully created.",
      });
    } catch (err: any) {
      console.error(err);
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Reset token expired.", 401));
      }
      return next(new AppError("Internal server error.", 500));
    }
  };

  public getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = res.locals.user;

      const profile = await prisma.user_profile.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!profile) {
        throw new AppError("Profile not found", 404);
      }

      res.status(200).send({
        success: true,
        data: profile,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  public uploadProfileImage = async (
    res: Response,
    req: Request,
    next: NextFunction
  ) => {
    try {
      const user = res.locals.user;

      if (user.role !== "user") {
        throw new AppError("You are not allowed to access this page.", 403);
      }

      if (!req.file) {
        throw new AppError("No profile image uploaded.", 400);
      }

      const upload = await cloudinaryUpload(req.file);

      await prisma.user_profile.update({
        where: {
          user_id: user.id,
        },
        data: {
          user_profile_image: upload.secure_url,
        },
      });

      res.status(200).send({
        success: true,
        message: "Update profile image successful.",
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

export default UserProfile;
