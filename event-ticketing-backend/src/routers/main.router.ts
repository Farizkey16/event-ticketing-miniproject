import { Router } from "express";
import userRouter from "./user.router";
import organizerRouter from "./organizer.router";
import eventRouter from "./event.router";
import couponRouter from "./coupon.router";
import transactionRouter from "./transaction.router"

const router = Router();

router.use("/user", userRouter);
router.use("/organizer", organizerRouter);
router.use("/event", eventRouter);
router.use("/coupon", couponRouter);
router.use("/transactions", transactionRouter)

export default router;
