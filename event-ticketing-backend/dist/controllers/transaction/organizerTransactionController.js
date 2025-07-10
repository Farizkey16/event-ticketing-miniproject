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
const mail_utils_1 = require("../../utils/mail.utils");
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
                    const transaction = yield tx.transactions_table.update({
                        where: {
                            id: transactionId,
                        },
                        data: {
                            status: "accepted",
                        },
                        include: {
                            ticket: {
                                include: {
                                    ticket_type: true,
                                },
                            },
                            user: true,
                            event: true,
                        },
                    });
                    if (!transaction)
                        throw new Error("TRANSACTION_NOT_FOUND");
                    // Checking Points per User, FE must pass user_point_id and used_points
                    const pointsUsed = req.body.pointsUsed;
                    if (!Array.isArray(pointsUsed) || pointsUsed.length === 0)
                        throw new Error("POINTSUSED_ARRAY_REQUIRED");
                    const userPointIds = pointsUsed.map((p) => p.user_point_id);
                    const userPoints = yield tx.user_points.findMany({
                        where: {
                            id: {
                                in: userPointIds,
                            },
                            user_id: transaction.user_id,
                        },
                        select: {
                            user_id: true,
                        },
                    });
                    if (userPoints.length !== userPointIds.length)
                        throw new Error("INVALID_USER_POINTS");
                    // Create redemption point log
                    const totalPoints = pointsUsed.reduce((sum, p) => sum + p.used_points, 0);
                    const redemption = yield tx.points_redemption.create({
                        data: {
                            user_id: transaction.user_id,
                            total_points: totalPoints,
                            redeemed_at: new Date(),
                        },
                    });
                    // Create redemption id + user_point, to log which points used for what
                    yield Promise.all(pointsUsed.map((p) => tx.points_redemption_items.create({
                        data: {
                            user_point_id: p.user_point_id,
                            redemption_id: redemption.id,
                        },
                    })));
                    // Update and decrease the points_remaining of a user by used_points
                    yield Promise.all(pointsUsed.map((p) => tx.user_points.update({
                        where: {
                            id: p.user_point_id,
                        },
                        data: {
                            points_remaining: {
                                decrement: p.used_points,
                            },
                        },
                    })));
                    return transaction;
                }));
                if (!transaction) {
                    res.status(404).json({ message: "Transaction not found." });
                    return;
                }
                const tixQty = transaction.ticket.reduce((sum, t) => sum + t.ticket_quantity, 0);
                const totalPaid = transaction.ticket.reduce((sum, t) => {
                    return sum + t.ticket_quantity * t.ticket_type.price;
                }, 0);
                yield prisma_1.prisma.event_attendees.upsert({
                    where: {
                        event_id_user_id: {
                            event_id: transaction.event_id,
                            user_id: transaction.user_id,
                        },
                    },
                    create: {
                        event_id: transaction.event_id,
                        user_id: transaction.user_id,
                        organizer_id: organizer.id,
                        ticket_quantity: tixQty,
                        total_price_paid: totalPaid,
                        status: "attending",
                    },
                    update: {
                        ticket_quantity: tixQty,
                        total_price_paid: totalPaid,
                        status: "attending",
                    },
                });
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
                yield (0, mail_utils_1.sendEmail)(user.email, "Your payment was accepted.", `<p> Congratulations! Your payment for the event ${transaction.event.name} was accepted. We will be waiting for your attendance at the event.</p>`);
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
                    const transaction = yield tx.transactions_table.update({
                        where: {
                            id: transactionId,
                        },
                        data: {
                            status: "rejected",
                        },
                        include: {
                            event: true,
                            user: true,
                        },
                    });
                    // Delete Points per User
                    const pointsUsed = req.body.pointsUsed;
                    if (!Array.isArray(pointsUsed) || pointsUsed.length === 0)
                        throw new Error("POINTSUSED_ARRAY_REQUIRED");
                    const userPointIds = pointsUsed.map((p) => p.user_point_id);
                    yield Promise.all(pointsUsed.map((p) => tx.user_points.update({
                        where: {
                            id: p.user_point_id,
                        },
                        data: {
                            points_remaining: {
                                increment: p.used_points,
                            },
                        },
                    })));
                    // Delete redemption point log
                    const totalPoints = pointsUsed.reduce((sum, p) => sum + p.used_points, 0);
                    const redemptionIds = yield tx.points_redemption_items.findMany({
                        where: {
                            user_point_id: {
                                in: userPointIds,
                            },
                        },
                        select: {
                            redemption_id: true,
                        },
                        distinct: ["redemption_id"],
                    });
                    const ids = redemptionIds.map((r) => r.redemption_id);
                    yield tx.points_redemption_items.deleteMany({
                        where: {
                            redemption_id: {
                                in: ids,
                            },
                        },
                    });
                    yield tx.points_redemption.deleteMany({
                        where: {
                            id: {
                                in: ids,
                            },
                        },
                    });
                    // Delete Ticket Holds
                    yield tx.ticket_holds.deleteMany({
                        where: {
                            transactions_id: transactionId,
                        },
                    });
                    return transaction;
                }));
                if (!rejection) {
                    res.status(404).json({ message: "Transaction not found." });
                    return;
                }
                // Notify User
                const user = rejection.user;
                if (!user) {
                    res.status(404).send("User not found.");
                    return;
                }
                yield (0, mail_utils_1.sendEmail)(user.email, "Your payment was rejected.", `<p> Unfortunately, your payment for the event ${rejection.event.name} was rejected. There might be insufficient proof, please try again.</p>`);
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
