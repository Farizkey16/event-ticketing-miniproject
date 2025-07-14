// src/utils/errorMapper.ts
import AppError from "../errors/AppError";

const errorMap: Record<string, { message: string; status: number }> = {
  POINTSUSED_ARRAY_REQUIRED: {
    message: "You must provide an array of used points.",
    status: 400,
  },
  INVALID_USER_POINTS: {
    message: "Some points do not belong to the user.",
    status: 400,
  },
  TRANSACTION_NOT_FOUND: {
    message: "Transaction not found.",
    status: 404,
  },
  INVALID_COUPON: {
    message: "Coupon is invalid.",
    status: 400,
  },
  COUPON_EXPIRED: {
    message: "Coupon has expired.",
    status: 400,
  },
  COUPON_ALREADY_USED: {
    message: "You’ve already used this coupon.",
    status: 400,
  },
  INVALID_VOUCHER: {
    message: "Voucher is invalid.",
    status: 400,
  },
  UNAUTHORIZED_VOUCHER: {
    message: "You’re not allowed to use this voucher.",
    status: 403,
  },
};

export const throwMappedError = (code: string): never => {
  const mapped = errorMap[code];
  if (!mapped) throw new AppError("Unexpected error occurred", 500);
  throw new AppError(mapped.message, mapped.status);
};
