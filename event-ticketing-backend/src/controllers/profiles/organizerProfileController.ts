import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { compare } from "bcrypt";
import nodemailer from "nodemailer";
import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt"

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
        res.status(403).send("You are not allowed to access this page.");
        return;
      }

      const checkOrganizer = await prisma.organizer_account.findUnique({
        where: {
          id: organizer.id,
        },
      });

      if (!checkOrganizer) {
        res.status(404).send("This account does not exist.");
        return;
      }

      if (!organizer_name || !organizer_address || !organizer_phone) {
        res.status(400).send({
          message: "Missing required profile fields.",
        });
        return;
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
        res.status(403).send("You are not allowed to access this page.");
        return;
      }

      const checkOrganizer = await prisma.organizer_account.findUnique({
        where: {
          id: organizer.id,
        },
      });

      if (!checkOrganizer) {
        res.status(404).send("This account does not exist.");
        return;
      }

      if (!organizer_name || !organizer_address || !organizer_phone) {
        res.status(400).send({
          message: "Missing required profile fields.",
        });
        return;
      }

      const profile = await prisma.organizer_profile.findUnique({
        where: {
          organizer_id: organizer.id,
        },
      });

      if (!profile) {
        res.status(404).send("Organizer profile not found.");
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

      if (!old_password || !new_password) {
        res.status(400).send("Old and new passwords are required.");
      }

      const organizerReset = await prisma.organizer_account.findUnique({
        where: {
          id: organizer.id,
        },
      });

      if (!organizerReset) {
        res.status(404).send("No organizer account is found from the id.");
        return;
      }

      const isMatch = await compare(old_password, organizerReset.password);

      if (!isMatch) {
        res.status(401).send("Wrong password.");
        return;
      }

      await prisma.organizer_account.update({
        where: {
          id: organizer.id,
        },
        data: {
          password: new_password,
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
      const { email } = req.body

      if (!email) {
      res.status(400).send({ success: false, message: "Email required" });
      return;
    }

    const findOrganizer = await prisma.organizer_account.findUnique({
      where: {
        email
      }
    })

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
     
      const payload = jwt.verify(token, process.env.JWT_TOKEN as string) as JwtPayload & {
        id: number,
      }

      const organizerCheck = await prisma.organizer_account.findUnique({
        where: {
          id: payload.id
        }
      })

      if (!organizerCheck) {
        res.status(404).send("Organizer not found.")
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.organizer_account.update({
        where: {
          id: payload.id
        }, data: {
          password: hashedPassword
        }
      })

      res.status(200).send({
        success:true,
        message: "New password successfully created."
      })

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
      if (err.name === "TokenExpiredError"){
        res.status(401).send("Reset token expired.")
      } 
      res.status(500).send("Internal server error.")
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
        res.status(404).send("Profile not found.");
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
}

export default OrganizerProfile;
