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
import AppError from "../../errors/AppError";

class OrganizerTransaction {
  public acceptPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const organizer = res.locals.user;

      if (!organizer) {
        throw new AppError("Unauthorized access.", 403);
      }

      const transactionId = parseInt(req.params.id);

      if (isNaN(transactionId)) {
        throw new AppError("Invalid transaction ID.", 400);
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
        throw new AppError("Transaction not found.", 404);
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
        throw new AppError("User not found.", 404);
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
          return next(new AppError("Transaction not found.", 404));
        }

        if (err.message === "INVALID_USER_POINTS") {
          return next(
            new AppError("Some points do not belong to the user.", 400)
          );
        }

        if (err.message === "POINTSUSED_ARRAY_REQUIRED") {
          return next(new AppError("pointsUsed array is required.", 400));
        }
      }
      return next(new AppError("Internal server error.", 500));
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
        throw new AppError("Unauthorized Access.", 403);
      }

      const transactionId = parseInt(req.params.id);

      if (!transactionId) {
        throw new AppError("Transaction not found", 404);
      }

      if (isNaN(transactionId)) {
        throw new AppError("Invalid transaction ID.", 400);
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
          return next(new AppError("Transaction not found.", 404));
        }

        if (err.message === "POINTSUSED_ARRAY_REQUIRED") {
          return next(new AppError("pointsUsed array is required.", 400));
        }
      }
      return next(new AppError("Internal server error.", 500));
    }
  };

  public viewProof = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const organizer = res.locals.user;

      if (!organizer) {
        throw new AppError("Unauthorized access.", 403);
      }

      // Find Transaction ID
      const { transactionId } = req.body;
      const paymentProof = await prisma.transactions_table.findUnique({
        where: {
          id: transactionId,
        },
        select: {
          payment_proof_url: true,
        },
      });

      if (!paymentProof) {
        throw new AppError("Payment proof not found", 404);
      }

      res.status(200).json({
        payment_proof_url: paymentProof.payment_proof_url,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  public getTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const organizer = res.locals.user;
      if (!organizer) {
        throw new AppError("Unauthorized access.", 403);
      }

      // Find Transactions
      const transactions = await prisma.transactions_table.findMany({
        where: {
          event: {
            organizer_id: organizer.id,
          },
        },
        include: {
          event: true,
          user: true,
        },
      });

      if (transactions.length === 0) {
        return next(new AppError("No transactions found.", 404));
      }

      const formatted = transactions.map((trx) => ({
        id: trx.id,
        eventName: trx.event.name,
        buyerName: trx.user.username,
        created_at: trx.created_at,
        total_price: trx.total_price,
        discount_applied: trx.discount_applied,
        payment_proof_url: trx.payment_proof_url,
        status: trx.status

      }))

      res.status(200).json({
        success: true,
        message: `All transactions for ${organizer.name} are successfully fetched.`,
        data: formatted,
      });
    } catch (err) {
      console.error(err), next(err);
    }
  };
}

export default OrganizerTransaction;
