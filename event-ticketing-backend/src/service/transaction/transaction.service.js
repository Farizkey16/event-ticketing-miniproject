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
exports.updateSeatTicket = exports.notifyUserPaymentStatus = exports.upsertEventAttendees = exports.rollbackVoucherCoupon = exports.voucherCouponCheck = exports.rollbackPoint = exports.usePoint = exports.transactionUpdate = void 0;
const prisma_1 = require("../../config/prisma");
const mail_utils_1 = require("../../utils/mail.utils");
const calculateprice_utils_1 = require("../../utils/calculateprice.utils");
const transactionUpdate = (tx, txid, status) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield tx.transactions_table.update({
        where: {
            id: txid,
        },
        data: {
            status: status,
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
    return transaction;
});
exports.transactionUpdate = transactionUpdate;
const usePoint = (tx, pointsUsed, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    // Checking Points per User, FE must pass user_point_id and used_points
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
});
exports.usePoint = usePoint;
const rollbackPoint = (tx, pointsUsed) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.rollbackPoint = rollbackPoint;
const voucherCouponCheck = (tx, vouchercoupon, transaction, organizer) => __awaiter(void 0, void 0, void 0, function* () {
    const { coupon_code, voucher_code } = vouchercoupon;
    const totalPrice = transaction.ticket.reduce((sum, t) => {
        return sum + t.ticket_quantity * t.ticket_type.price;
    }, 0);
    // Check Voucher or Coupon usage
    if (vouchercoupon.coupon_code && vouchercoupon.voucher_code) {
        throw new Error("USE_VOUCHER_OR_COUPON");
    }
    // Coupon Lookup
    if (coupon_code) {
        const coupon = yield tx.coupon_table.findUnique({
            where: {
                code: vouchercoupon.coupon_code,
            },
        });
        if (!coupon)
            throw new Error("INVALID_COUPON");
        if (coupon.used_count >= coupon.usage_limit)
            throw new Error("COUPON_EXPIRED");
        const userCoupon = yield tx.user_coupon.findFirst({
            where: {
                user_id: transaction.user_id,
                coupon_id: coupon.id,
            },
        });
        if (userCoupon === null || userCoupon === void 0 ? void 0 : userCoupon.used_at)
            throw new Error("COUPON_ALREADY_USED");
        /**
         * 1. Check discount type
         * 2. If fixed, then the total price would be price - discountAmountCoupon
         * 3. If percentage, then the total price would be price * discountAmountCoupon
         */
        let discountAmount = (0, calculateprice_utils_1.calculateDiscount)(totalPrice, coupon.discount_type, coupon.discount_value);
        let finalPrice = Math.max(0, totalPrice - discountAmount);
        yield tx.transactions_table.update({
            where: {
                id: transaction.id,
            },
            data: {
                coupon_id: coupon.id,
                discount_applied: discountAmount,
                total_price: finalPrice,
            },
        });
        yield tx.coupon_table.update({
            where: {
                code: coupon_code,
            },
            data: {
                used_count: {
                    increment: 1,
                },
            },
        });
    }
    // Voucher Lookup
    if (voucher_code) {
        const voucher = yield tx.voucher_table.findFirst({
            where: {
                code: vouchercoupon.voucher_code,
            },
        });
        if (!voucher)
            throw new Error("INVALID_VOUCHER");
        if (voucher.organizer_id !== organizer.id)
            throw new Error("UNAUTHORIZED_VOUCHER");
        let discountAmount = (0, calculateprice_utils_1.calculateDiscount)(totalPrice, voucher.discount_type, voucher.discount_value);
        let finalPrice = Math.max(0, totalPrice - discountAmount);
        yield tx.transactions_table.update({
            where: {
                id: transaction.id,
            },
            data: {
                voucher_id: voucher.id,
                discount_applied: discountAmount,
                total_price: finalPrice,
            },
        });
        yield tx.voucher_table.update({
            where: {
                code: voucher_code,
            },
            data: {
                usage_limit: {
                    decrement: 1,
                },
            },
        });
    }
});
exports.voucherCouponCheck = voucherCouponCheck;
const rollbackVoucherCoupon = (tx, vouchercoupon, transaction, organizer) => __awaiter(void 0, void 0, void 0, function* () {
    const { coupon_code, voucher_code } = vouchercoupon;
    if (coupon_code) {
        const coupon = yield tx.coupon_table.findUnique({
            where: {
                code: vouchercoupon.coupon_code
            }
        });
        if (!coupon)
            throw new Error("INVALID_COUPON");
        if (coupon.used_count >= coupon.usage_limit)
            throw new Error("COUPON_EXPIRED");
        const userCoupon = yield tx.user_coupon.findFirst({
            where: {
                user_id: transaction.user_id,
                coupon_id: coupon.id
            }
        });
        if (userCoupon === null || userCoupon === void 0 ? void 0 : userCoupon.used_at)
            throw new Error("COUPON_ALREADY_USED");
    }
});
exports.rollbackVoucherCoupon = rollbackVoucherCoupon;
const upsertEventAttendees = (transaction, organizer) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.upsertEventAttendees = upsertEventAttendees;
const notifyUserPaymentStatus = (userEmail, eventName, status) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = status === "accepted" ? "Payment accepted." : "Payment rejected.";
    const message = status === "accepted"
        ? `<p> Congratulations! Your payment for the event ${eventName} was accepted. We will be waiting for your attendance at the event.</p>`
        : `<p> Unfortunately, your payment for the event ${eventName} was rejected. There might be insufficient proof, please try again.</p>`;
    yield (0, mail_utils_1.sendEmail)(userEmail, subject, message);
});
exports.notifyUserPaymentStatus = notifyUserPaymentStatus;
const updateSeatTicket = (tx, transaction, operation, txid) => __awaiter(void 0, void 0, void 0, function* () {
    const tixQty = transaction.ticket.reduce((sum, t) => sum + t.ticket_quantity, 0);
    yield tx.event_table.update({
        where: {
            id: transaction.event_id,
        },
        data: {
            seat_capacity: {
                [operation]: tixQty,
            },
        },
    });
    // Delete Ticket Holds
    yield tx.ticket_holds.deleteMany({
        where: {
            transactions_id: txid,
        },
    });
});
exports.updateSeatTicket = updateSeatTicket;
