import { prisma } from "../../config/prisma";
import { Prisma } from "@prisma/client";
import { organizer_account } from "../../../prisma/generated/client";
import { sendEmail } from "../../utils/mail.utils";
import { calculateDiscount } from "../../utils/calculateprice.utils";
import { throwMappedError } from "../../utils/errorMapper";

type TransactionWithRelations = Awaited<ReturnType<typeof transactionUpdate>>;
type SeatCapacityUpdate = "increment" | "decrement";

export const transactionUpdate = async (
  tx: Prisma.TransactionClient,
  txid: number,
  status: "accepted" | "rejected"
) => {
  const transaction = await tx.transactions_table.update({
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
      total_price: true,
    },
  });

  return transaction;
};

export const usePoint = async (
  tx: Prisma.TransactionClient,
  pointsUsed: { user_point_id: number; used_points: number }[],
  transaction: TransactionWithRelations
) => {
  // Checking Points per User, FE must pass user_point_id and used_points

  if (!Array.isArray(pointsUsed) || pointsUsed.length === 0)
    throwMappedError("POINTSUSED_ARRAY_REQUIRED");

  const userPointIds = pointsUsed.map((p) => p.user_point_id);

  const userPoints = await tx.user_points.findMany({
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
    throwMappedError("INVALID_USER_POINTS");

  // Create redemption point log
  const totalPoints = pointsUsed.reduce((sum, p) => sum + p.used_points, 0);
  const redemption = await tx.points_redemption.create({
    data: {
      user_id: transaction.user_id,
      total_points: totalPoints,
      redeemed_at: new Date(),
    },
  });

  // Create redemption id + user_point, to log which points used for what
  await Promise.all(
    pointsUsed.map((p) =>
      tx.points_redemption_items.create({
        data: {
          user_point_id: p.user_point_id,
          redemption_id: redemption.id,
        },
      })
    )
  );

  // Update and decrease the points_remaining of a user by used_points
  await Promise.all(
    pointsUsed.map((p) =>
      tx.user_points.update({
        where: {
          id: p.user_point_id,
        },
        data: {
          points_remaining: {
            decrement: p.used_points,
          },
        },
      })
    )
  );
};

export const rollbackPoint = async (
  tx: Prisma.TransactionClient,
  pointsUsed: { user_point_id: number; used_points: number }[]
) => {
  if (!Array.isArray(pointsUsed) || pointsUsed.length === 0)
    throwMappedError("POINTSUSED_ARRAY_REQUIRED");

  const userPointIds = pointsUsed.map((p) => p.user_point_id);

  await Promise.all(
    pointsUsed.map((p) =>
      tx.user_points.update({
        where: {
          id: p.user_point_id
        },
        data: {
          points_remaining: {
            increment: p.used_points,
          },
        },
      })
    )
  );

  // Delete redemption point log
  const redemptionIds = await tx.points_redemption_items.findMany({
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

  const ids = redemptionIds.map((r: any) => r.redemption_id);

  await tx.points_redemption_items.deleteMany({
    where: {
      redemption_id: {
        in: ids,
      },
    },
  });

  await tx.points_redemption.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const voucherCouponCheck = async (
  tx: Prisma.TransactionClient,
  vouchercoupon: { coupon_code: string; voucher_code: string },
  transaction: TransactionWithRelations,
  organizer: organizer_account
) => {
  const { coupon_code, voucher_code } = vouchercoupon;
  const totalPrice = transaction.ticket.reduce(
    (
      sum: number,
      t: { ticket_quantity: number; ticket_type: { price: number } }
    ) => {
      return sum + t.ticket_quantity * t.ticket_type.price;
    },
    0
  );

  // Check Voucher or Coupon usage
  if (vouchercoupon.coupon_code && vouchercoupon.voucher_code) {
    throwMappedError("USE_VOUCHER_OR_COUPON");
  }

  // Coupon Lookup

  if (coupon_code) {
    const coupon = await tx.coupon_table.findUnique({
      where: {
        code: vouchercoupon.coupon_code,
      },
    });

    if (!coupon) throwMappedError("INVALID_COUPON");

    if (coupon.usage_limit <= 0) throwMappedError("COUPON_EXPIRED");

    const userCoupon = await tx.user_coupon.findFirst({
      where: {
        user_id: transaction.user_id,
        coupon_id: coupon.id,
      },
    });

    if (userCoupon?.used_at) throwMappedError("COUPON_ALREADY_USED");

    let discountAmount: number = calculateDiscount(
      totalPrice,
      coupon.discount_type,
      coupon.discount_value
    );
    let finalPrice: number = Math.max(0, totalPrice - discountAmount);

    await tx.transactions_table.update({
      where: {
        id: transaction.id,
      },
      data: {
        coupon_id: coupon.id,
        discount_applied: discountAmount,
        total_price: finalPrice,
      },
    });

    await tx.user_coupon.update({
      where: {
        id: userCoupon.id,
      },
      data: {
        used_at: new Date(),
      },
    });

    await tx.coupon_table.update({
      where: {
        code: coupon_code,
      },
      data: {
        usage_limit: {
          decrement: 1,
        },
      },
    });
  }

  // Voucher Lookup

  if (voucher_code) {
    const voucher = await tx.voucher_table.findUnique({
      where: {
        code: vouchercoupon.voucher_code,
      },
    });

    if (!voucher) throwMappedError("INVALID_VOUCHER");

    if (voucher.organizer_id !== organizer.id)
      throwMappedError("UNAUTHORIZED_VOUCHER");

    let discountAmount: number = calculateDiscount(
      totalPrice,
      voucher.discount_type,
      voucher.discount_value
    );
    let finalPrice: number = Math.max(0, totalPrice - discountAmount);

    await tx.transactions_table.update({
      where: {
        id: transaction.id,
      },
      data: {
        voucher_id: voucher.id,
        discount_applied: discountAmount,

        total_price: finalPrice,
      },
    });

    await tx.voucher_table.update({
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
};

export const rollbackVoucherCoupon = async (
  tx: Prisma.TransactionClient,
  vouchercoupon: { coupon_code: string; voucher_code: string },
  transaction: TransactionWithRelations,
  organizer: organizer_account
) => {
  const { coupon_code, voucher_code } = vouchercoupon;

  if (coupon_code) {
    const coupon = await tx.coupon_table.findUnique({
      where: {
        code: vouchercoupon.coupon_code,
      },
    });

    if (!coupon) throwMappedError("INVALID_COUPON");

    const userCoupon = await tx.user_coupon.findFirst({
      where: {
        user_id: transaction.user_id,
        coupon_id: coupon.id,
      },
    });

    if (!userCoupon || !userCoupon.used_at) throwMappedError("COUPON_NOT_USED");

    await tx.user_coupon.update({
      where: {
        id: userCoupon.id,
      },
      data: {
        used_at: null,
      },
    });

    await tx.coupon_table.update({
      where: {
        code: coupon_code,
      },
      data: {
        usage_limit: {
          increment: 1,
        },
      },
    });
  }

  if (voucher_code) {
    const voucher = await tx.voucher_table.findUnique({
      where: {
        code: vouchercoupon.voucher_code,
      },
    });

    if (!voucher) throwMappedError("INVALID_VOUCHER");

    if (voucher.organizer_id !== organizer.id)
      throwMappedError("UNAUTHORIZED_VOUCHER");

    await tx.voucher_table.update({
      where: {
        code: voucher_code,
      },
      data: {
        usage_limit: {
          increment: 1,
        },
      },
    });
  }
};

export const upsertEventAttendees = async (
  transaction: TransactionWithRelations,
  organizer: organizer_account
) => {
  const tixQty = transaction.ticket.reduce(
    (sum: number, t: { ticket_quantity: number }) => sum + t.ticket_quantity,
    0
  );
  const totalPaid = transaction.total_price;

  await prisma.event_attendees.upsert({
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
};

export const notifyUserPaymentStatus = async (
  userEmail: string,
  eventName: string,
  status: "accepted" | "rejected"
) => {
  const subject =
    status === "accepted" ? "Payment accepted." : "Payment rejected.";
  const message =
    status === "accepted"
      ? `<p> Congratulations! Your payment for the event ${eventName} was accepted. We will be waiting for your attendance at the event.</p>`
      : `<p> Unfortunately, your payment for the event ${eventName} was rejected. There might be insufficient proof, please try again.</p>`;

  await sendEmail(userEmail, subject, message);
};

export const updateSeatTicket = async (
  tx: Prisma.TransactionClient,
  transaction: TransactionWithRelations,
  operation: SeatCapacityUpdate,
  txid: number
) => {
  const tixQty = transaction.ticket.reduce(
    (sum: number, t: { ticket_quantity: number }) => sum + t.ticket_quantity,
    0
  );
  await tx.event_table.update({
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
  await tx.ticket_holds.deleteMany({
    where: {
      transactions_id: txid,
    },
  });
};
