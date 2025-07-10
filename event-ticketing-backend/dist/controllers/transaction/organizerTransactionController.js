"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../config/prisma");
const transaction_service_1 = require("../../service/transaction/transaction.service");
class OrganizerTransaction {
    constructor() {
        this.acceptPayment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
                const transaction = yield prisma_1.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    // Updating transaction status after acceptance
                    const transaction = yield (0, transaction_service_1.transactionUpdate)(tx, transactionId, "accepted");
                    // Check Voucher & Coupon Usage
                    const { coupon_code, voucher_code } = req.body.vouchercoupon;
                    yield (0, transaction_service_1.voucherCouponCheck)(tx, { coupon_code, voucher_code }, transaction, organizer);
                    // Check Points, Create Redemption Point log, Redemption log, and Update Points
                    yield (0, transaction_service_1.usePoint)(tx, req.body.pointsUsed, transaction);
                    // Update seat_capacity and delete ticket holds
                    yield (0, transaction_service_1.updateSeatTicket)(tx, transaction, "increment", transactionId);
                    return transaction;
                }));
                if (!transaction) {
                    res.status(404).json({ message: "Transaction not found." });
                    return;
                }
                // Upsert to Event Attendees
                yield (0, transaction_service_1.upsertEventAttendees)(transaction, organizer);
                // Notify User
                const user = yield prisma_1.prisma.user_account.findUnique({
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
                yield (0, transaction_service_1.notifyUserPaymentStatus)(user.email, transaction.event.name, "accepted");
                // Sending Response
                res.status(200).json({
                    message: "Payment accepted and attendee added successfully.",
                });
            }
            catch (err) {
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
        });
        this.rejectPayment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
                const rejection = yield prisma_1.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const existingTransaction = yield tx.transactions_table.findUnique({
                        where: {
                            id: transactionId,
                        },
                        select: {
                            id: true,
                        },
                    });
                    if (!existingTransaction)
                        throw new Error("TRANSACTION_NOT_FOUND");
                    // Update Transaction Status
                    const transaction = yield (0, transaction_service_1.transactionUpdate)(tx, transactionId, "rejected");
                    // Rolling back points, deletion of redemption point log, and redemption points items
                    const { user_point_id, used_points } = req.body.pointsUsed;
                    yield (0, transaction_service_1.rollbackPoint)(tx, { user_point_id, used_points });
                    // Decrease Seat Capacity
                    yield (0, transaction_service_1.updateSeatTicket)(tx, transaction, "decrement", transactionId);
                    return transaction;
                }));
                // Notify User
                const user = rejection.user;
                if (!user) {
                    res.status(404).send("User not found.");
                    return;
                }
                yield (0, transaction_service_1.notifyUserPaymentStatus)(user.email, rejection.event.name, "rejected");
                // Sending Response
                res
                    .status(200)
                    .json({ message: "Payment rejected and tickets released." });
            }
            catch (err) {
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
        });
    }
}
exports.default = OrganizerTransaction;
