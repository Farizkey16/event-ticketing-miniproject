import { Request, Response } from "express";
import { customAlphabet } from "nanoid";
import { prisma } from "../config/prisma";

class GenerateCoupon {
  public couponGenerator = async (req: Request, res: Response) => {
    try {
      const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);
      const code = nanoid();
      const finalCode = req.body.code || code

      const {
        event_id,
        discount_type,
        discount_value,
        usage_limit,
        created_at,
        expires_at,
        used_at,
        used_count
      } = req.body;

      const newCoupon = await prisma.coupon_table.create({
        data: {
          event_id,
          code: finalCode,
          discount_type,
          discount_value,
          created_at,
          usage_limit,
          used_count,
          expires_at: new Date(expires_at),
          status: "active",
          issued_by: "system",
        },
      });

      res.status(201).send({
        success: true,
        message: "new coupon successfully created.",
        coupon: newCoupon,
      });
    } catch (err) {
      res.status(500).send(err);
      
    }
  };
}

export default GenerateCoupon;
