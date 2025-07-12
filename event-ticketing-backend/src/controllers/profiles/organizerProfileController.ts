import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { compare } from "bcrypt";
import nodemailer from "nodemailer";
import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";
import { cloudinaryUpload } from "../../config/cloudinary";
import { hashPassword } from "../../utils/hash";
import AppError from "../../errors/AppError";

class OrganizerProfile {
  public newProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        organizer_name,
        organizer_address,
        organizer_phone,
        organizer_profile_image,
      } = req.body;

      const organizer = res.locals.user;

      if (organizer.role !== "organizer") {
        throw new AppError("You are not allowed to access this page.", 403);
      }

      const checkOrganizer = await prisma.organizer_account.findUnique({
        where: {
          id: organizer.id,
        },
      });

      if (!checkOrganizer) {
        throw new AppError("This account does not exist.", 404);
      }

      if (!organizer_name || !organizer_address || !organizer_phone) {
        throw new AppError("Missing required profile fields.", 400);
      }

      const newProfile = await prisma.organizer_profile.create({
        data: {
          organizer_name,
          organizer_address,
          organizer_phone,
          organizer_profile_image,
          organizer: {
            connect: { id: organizer.id },
          },
        },
      });

      res.status(200).send({
        success: true,
        message: "Your profile has been created",
        data: newProfile,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  public editProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const organizer = res.locals.user;
      const {
        organizer_name,
        organizer_address,
        organizer_phone,
        organizer_profile_image,
      } = req.body;

      if (organizer.role !== "organizer") {
        throw new AppError("You are not allowed to access this page.", 403);
      }

      const checkOrganizer = await prisma.organizer_account.findUnique({
        where: {
          id: organizer.id,
        },
      });

      if (!checkOrganizer) {
        throw new AppError("This account does not exist.", 404);
      }

      if (!organizer_name || !organizer_address || !organizer_phone) {
        throw new AppError("Missing required profile fields.", 400);
      }

      const profile = await prisma.organizer_profile.findUnique({
        where: {
          organizer_id: organizer.id,
        },
      });

      if (!profile) {
        throw new AppError("Organizer profile not found.", 404);
      }

      const updatedProfile = await prisma.organizer_profile.update({
        where: {
          id: organizer.id,
        },
        data: {
          organizer_name,
          organizer_address,
          organizer_phone,
          organizer_profile_image,
          organizer: {
            connect: { id: organizer.id },
          },
        },
      });

      res.status(200).send({
        success: true,
        message: "Your profile has been created",
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
      const organizer = res.locals.user;
      const { old_password, new_password } = req.body;

      const hashedPassword = await hashPassword(new_password, 10);

      const organizerReset = await prisma.organizer_account.findUnique({
        where: {
          id: organizer.id,
        },
      });

      if (!organizerReset) {
        throw new AppError("No organizer account is found from the id.", 404);
      }

      const isMatch = await compare(old_password, organizerReset.password);

      if (!isMatch) {
        throw new AppError("Wrong password.", 401);
      }

      await prisma.organizer_account.update({
        where: {
          id: organizer.id,
        },
        data: {
          password: hashedPassword,
        },
      });

      res.status(200).send({
        success: true,
        message: "password has been reset successfully.",
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
        throw new AppError("Email required", 400);
      }

      const findOrganizer = await prisma.organizer_account.findUnique({
        where: {
          email,
        },
      });

      if (!findOrganizer) {
        throw new AppError("No account found with that email.", 404);
      }

      const token = jwt.sign(
        { id: findOrganizer?.id, role: "organizer" },
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

      const resetLink = `http://localhost:3000/organizer/reset-password?token=${token}`;

      await transporter.sendMail({
        from: process.env.MAIL_SENDER,
        to: findOrganizer?.email,
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

      const organizerCheck = await prisma.organizer_account.findUnique({
        where: {
          id: payload.id,
        },
      });

      if (!organizerCheck) {
        throw new AppError("Organizer not found.", 404);
      }

      const hashedPassword = await hashPassword(newPassword, 10);

      await prisma.organizer_account.update({
        where: {
          id: payload.id,
        },
        data: {
          password: hashedPassword,
        },
      });

      res.status(200).send({
        success: true,
        message: "New password successfully created.",
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
        to: organizerCheck?.email,
        subject: "Password Reset Successful",
        html: `Your password has been reset successfully.`,
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
      const organizer = res.locals.user;

      const profile = await prisma.organizer_account.findUnique({
        where: {
          id: organizer.id,
        },
      });

      if (!profile) {
        throw new AppError("Profile not found.", 404);
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
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const organizer = res.locals.user;

      if (organizer.role !== "organizer") {
        throw new AppError("You are not allowed to access this page.", 403);
      }

      if (!req.file) {
        throw new AppError("No profile image uploaded.", 400);
      }
      const upload = await cloudinaryUpload(req.file);

      await prisma.organizer_profile.update({
        where: {
          organizer_id: organizer.id,
        },
        data: {
          organizer_profile_image: upload.secure_url,
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

export default OrganizerProfile;
