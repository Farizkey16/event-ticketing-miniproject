import { NextFunction, Request, Response } from "express";
import { compare } from "bcrypt";
import { Jwt } from "jsonwebtoken";
import { sign } from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import dayjs from "dayjs";
import { totalUserPoints } from "../../../prisma/generated/client/sql";

class UserAuthController {
  // Registration

  public register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
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

      // Generating Referral Code
      const referralCodeGeneration = async (username: string) => {
        const cleanUsername = (username || "").trim().toUpperCase();
        const prefix = cleanUsername.slice(0, 4).toUpperCase();

        for (let i = 0; i < 10; i++) {
          const suffix = Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase();
          const code = `${prefix}${suffix}`;

          const codeCheck = await prisma.user_account.findUnique({
            where: {
              referral_code: code,
            },
          });

          if (!codeCheck) return code;
        }

        throw new Error(
          "Failed to generate unique referral code after 10 attempts."
        );
      }

      const referralCode = await referralCodeGeneration(req.body.username);

      // Rewarding Used Referral Code
      let referrer = null;
      if (req.body.referred_by_code) {
        referrer = await prisma.user_account.findUnique({
          where: { referral_code: req.body.referred_by_code },
          select: { id: true, username: true, referral_code: true },
        });

        if (!referrer) {
          throw new Error("The referral code does not exist.");
        }

        const user_points_result = await prisma.$queryRawTyped(totalUserPoints(referrer.id))

        const user_points_remaining = Number(user_points_result[0]?.total_points ?? 0);

        await prisma.user_points.create({
          data: {
            user_id: referrer.id,
            points: 10000,
            points_source_type: "referral",
            points_source_id: 1,
            earned_at: new Date(),
            expires_at: dayjs().add(3, 'month').toDate(),
            points_remaining: user_points_remaining + 10000,
          }
        });
      }

      // Registering User
      const { email, username, password, role, referred_by_code } = req.body
      const registerUser = await prisma.user_account.create({
        data: {
          email,
          username,
          password: password,
          role: "user",
          referral_code: referralCode,
          referred_by_code: referred_by_code || ""
        },
      });

      // Sending response
      res.status(201).send({
        success: true,
        message: `New user for ${req.body.email} has been registered.`,
      });
    } catch (err) {
      next(err);
    }
  }

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Check User
    const checkUser = await prisma.user_account.findUnique({
      where: {
        email: req.body.email
      }
    })

    if (!checkUser) {
      throw new Error("No account with that email exists.")
    }

    // Comparing Password
    const passwordCompare = compare(req.body.password, checkUser.password)

    if (!passwordCompare){
      throw new Error("Your entered password is incorrect.")
    }

    // Token
    const token = sign({id: checkUser.id, email: checkUser.email}, process.env.JWT_TOKEN as string, { expiresIn: '2h'})

    res.status(200).send({
      success: true,
      message: "Log in successful",
      data: checkUser,
      token: token,
    })
    
  }

}

  
export default UserAuthController;
