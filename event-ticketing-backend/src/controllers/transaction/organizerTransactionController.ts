import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";
import {
  transactionUpdate,
  notifyUserPaymentStatus,
  usePoint,
  upsertEventAttendees,
  voucherCouponCheck,
  updateSeatTicket,
  rollbackPoint,
} from "../../service/transaction/transaction.service";

class OrganizerTransaction {
  public acceptPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const organizer = res.locals.user;

      if (!organizer) {
        res.status(403).send("Unauthorized access.");
        return;
      }

      const transactionId = parseInt(req.params.id);

      if (isNaN(transactionId)) {
        res.status(400).json({ message: "Invalid transaction ID." });
        return;
      }

      // Prisma Batch Queries
      const transaction = await prisma.$transaction(async (tx) => {
        // Updating transaction status after acceptance
        const transaction = await transactionUpdate(
          tx,
          transactionId,
          "accepted"
        );

        // Check Voucher & Coupon Usage
        const { coupon_code, voucher_code } = req.body.vouchercoupon;
        await voucherCouponCheck(
          tx,
          { coupon_code, voucher_code },
          transaction,
          organizer
        );

        // Check Points, Create Redemption Point log, Redemption log, and Update Points
        await usePoint(tx, req.body.pointsUsed, transaction);

        // Update seat_capacity and delete ticket holds
        await updateSeatTicket(tx, transaction, "increment", transactionId);

        return transaction;
      });

      if (!transaction) {
        res.status(404).json({ message: "Transaction not found." });
        return;
      }

      // Upsert to Event Attendees
      await upsertEventAttendees(transaction, organizer);

      // Notify User
      const user = await prisma.user_account.findUnique({
        where: {
          id: transaction.user_id,
        },
        select: {
          email: true,
        },
      });

      if (!user) {
        res.status(404).send("User not found.");
        return;
      }

      await notifyUserPaymentStatus(
        user.email,
        transaction.event.name,
        "accepted"
      );

      // Sending Response
      res.status(200).json({
        message: "Payment accepted and attendee added successfully.",
      });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "TRANSACTION_NOT_FOUND") {
          res.status(404).json({ message: "Transaction not found." });
          return;
        }

        if (err.message === "INVALID_USER_POINTS") {
          res
            .status(400)
            .json({ message: "Some points do not belong to the user" });
          return;
        }

        if (err.message === "POINTSUSED_ARRAY_REQUIRED") {
          res.status(400).json({ message: "pointsUsed array is required." });
          return;
        }
      }
      res.status(500).json({ message: "Internal server error." });
      next(err);
    }
  };

  public rejectPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const organizer = res.locals.user;

      if (!organizer) {
        res.status(403).send("Unauthorized Access.");
        return;
      }

      const transactionId = parseInt(req.params.id);

      if (!transactionId) {
        res.status(404).send("Transaction not found");
        return;
      }

      if (isNaN(transactionId)) {
        res.status(400).json({ message: "Invalid transaction ID." });
        return;
      }

      const rejection = await prisma.$transaction(async (tx) => {
        const existingTransaction = await tx.transactions_table.findUnique({
          where: {
            id: transactionId,
          },
          select: {
            id: true,
          },
        });

        if (!existingTransaction) throw new Error("TRANSACTION_NOT_FOUND");

        // Update Transaction Status
        const transaction = await transactionUpdate(
          tx,
          transactionId,
          "rejected"
        );

        // Rolling back points, deletion of redemption point log, and redemption points items
        const { user_point_id, used_points } = req.body.pointsUsed;
        await rollbackPoint(tx, [{ user_point_id, used_points }]);

        // Decrease Seat Capacity
        await updateSeatTicket(tx, transaction, "decrement", transactionId);

        return transaction;
      });

      // Notify User

      const user = rejection.user;

      if (!user) {
        res.status(404).send("User not found.");
        return;
      }

      await notifyUserPaymentStatus(
        user.email,
        rejection.event.name,
        "rejected"
      );

      // Sending Response

      res
        .status(200)
        .json({ message: "Payment rejected and tickets released." });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "TRANSACTION_NOT_FOUND") {
          res.status(404).json({ message: "Transaction not found." });
          return;
        }

        if (err.message === "POINTSUSED_ARRAY_REQUIRED") {
          res.status(400).json({ message: "pointsUsed array is required." });
          return;
        }
      }
      res.status(500).json({ message: "Internal server error." });
      next(err);
    }
  };

  public viewProof = async (req: Request,
    res: Response,
    next: NextFunction) => {

    try{
      const organizer = res.locals.user

      if (!organizer) {
        res.status(403).send("Unauthorized access.");
        return;
      }

      // Find Transaction ID
      const { transactionId } = req.body
      const paymentProof = await prisma.transactions_table.findUnique({
        where: {
          id: transactionId
        }, select: {
          payment_proof_url: true
        }
      })

      if (!paymentProof){
        res.status(404).json({
          message: "Payment proof not found"
        })
        return;
      } 

      res.status(200).json({
        payment_proof_url: paymentProof.payment_proof_url
      })

    } catch(err) {
      console.error(err);
      next(err)
    }

  }
}

export default OrganizerTransaction;
