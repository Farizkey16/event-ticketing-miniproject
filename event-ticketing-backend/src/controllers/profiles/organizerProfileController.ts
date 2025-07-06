import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";

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
}

export default OrganizerProfile;