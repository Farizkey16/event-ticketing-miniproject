import { Router } from "express";
import GenerateCoupon from "../controllers/coupon/coupon.controller";
import { VerifyToken } from "../middlewares/VerifyToken";
import VerifyOrganizer from "../middlewares/VerifyOrganizer";
import { couponValidator } from "../middlewares/validator/auth";

const router = Router();
const couponCtrl = new GenerateCoupon();

router.post("/create", VerifyToken, VerifyOrganizer, couponValidator, couponCtrl.couponGenerator);

export default router;
