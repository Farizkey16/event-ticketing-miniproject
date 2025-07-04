import { NextFunction, Request, Response } from "express";
import { compare } from "bcrypt";
import { Jwt, sign } from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import dayjs from "dayjs";

class OrganizerAuthController {
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check availability
      const checkOrganizer = await prisma.organizer_account.findUnique({
        where: {
          email: req.body.email,
          username: req.body.username,
        },
      });

       if (checkOrganizer) {
        throw new Error(
          "The organizer with this email or username has already exist."
        );
      }

      // Registering User
      const { email, username, password } = req.body
      await prisma.organizer_account.create({
        data: {
          email,
          username,
          password: password,
          role: "organizer"
        },
      });

      // Sending response
      res.status(201).send({
        success: true,
        message: `New organizer for ${req.body.email} has been registered.`,
      });

    } catch (err) {
        next(err)
    }
  };

   public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // Check Organizer
      const checkOrganizer = await prisma.organizer_account.findUnique({
        where: {
          email: req.body.email
        }
      })
  
      if (!checkOrganizer) {
        throw new Error("No account with that email exists.")
      }
  
      // Comparing Password
      const passwordCompare = compare(req.body.password, checkOrganizer.password)
  
      if (!passwordCompare){
        throw new Error("Your entered password is incorrect.")
      }
  
      // Token
      const token = sign({id: checkOrganizer.id, email: checkOrganizer.email, role: checkOrganizer.role}, process.env.JWT_TOKEN as string, { expiresIn: '2h'})
  
      res.status(200).send({
        success: true,
        message: "Log in successful",
        data: checkOrganizer,
        token: token,
      })
      
    }
}

export default OrganizerAuthController;
