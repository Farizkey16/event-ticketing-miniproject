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
const nanoid_1 = require("nanoid");
const prisma_1 = require("../../config/prisma");
class GenerateCoupon {
    constructor() {
        this.couponGenerator = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const nanoid = (0, nanoid_1.customAlphabet)("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);
                const code = nanoid();
                const finalCode = req.body.code || code;
                const { event_id, discount_type, discount_value, usage_limit, created_at, expires_at, used_at, used_count } = req.body;
                const newCoupon = yield prisma_1.prisma.coupon_table.create({
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
            }
            catch (err) {
                res.status(500).send(err);
            }
        });
    }
}
exports.default = GenerateCoupon;
