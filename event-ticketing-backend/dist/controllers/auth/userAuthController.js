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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma_1 = require("../../config/prisma");
const dayjs_1 = __importDefault(require("dayjs"));
const sql_1 = require("../../../prisma/generated/client/sql");
class UserAuthController {
    constructor() {
        // Registration
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                // Check availability
                const checkUser = yield prisma_1.prisma.user_account.findUnique({
                    where: {
                        email: req.body.email,
                        username: req.body.username,
                    },
                });
                if (checkUser) {
                    throw new Error("The user with this email or username has already exist.");
                }
                // Generating Referral Code
                const referralCodeGeneration = (username) => __awaiter(this, void 0, void 0, function* () {
                    const cleanUsername = (username || "").trim().toUpperCase();
                    const prefix = cleanUsername.slice(0, 4).toUpperCase();
                    for (let i = 0; i < 10; i++) {
                        const suffix = Math.random()
                            .toString(36)
                            .substring(2, 6)
                            .toUpperCase();
                        const code = `${prefix}${suffix}`;
                        const codeCheck = yield prisma_1.prisma.user_account.findUnique({
                            where: {
                                referral_code: code,
                            },
                        });
                        if (!codeCheck)
                            return code;
                    }
                    throw new Error("Failed to generate unique referral code after 10 attempts.");
                });
                const referralCode = yield referralCodeGeneration(req.body.username);
                // Registering User
                const { email, username, password, referred_by_code } = req.body;
                const newUser = yield prisma_1.prisma.user_account.create({
                    data: {
                        email,
                        username,
                        password: password,
                        role: "user",
                        referral_code: referralCode,
                        referred_by_code: referred_by_code || ""
                    },
                });
                // Rewarding Used Referral Code
                // Register with Referral Discount Coupon
                const referral_coupon = yield prisma_1.prisma.coupon_table.findUnique({
                    where: {
                        code: "REFERRAL10"
                    },
                    select: {
                        id: true,
                    }
                });
                if (!referral_coupon) {
                    throw new Error("Referral coupon not found");
                }
                if (req.body.referred_by_code) {
                    yield prisma_1.prisma.user_coupon.create({
                        data: {
                            user_id: newUser.id,
                            coupon_id: referral_coupon.id,
                        }
                    });
                }
                // Referral 10,000 points
                let referrer = null;
                if (req.body.referred_by_code) {
                    referrer = yield prisma_1.prisma.user_account.findUnique({
                        where: { referral_code: req.body.referred_by_code },
                        select: { id: true, username: true, referral_code: true },
                    });
                    if (!referrer) {
                        throw new Error("The referral code does not exist.");
                    }
                    const user_points_result = yield prisma_1.prisma.$queryRawTyped((0, sql_1.totalUserPoints)(referrer.id));
                    const user_points_remaining = Number((_b = (_a = user_points_result[0]) === null || _a === void 0 ? void 0 : _a.total_points) !== null && _b !== void 0 ? _b : 0);
                    yield prisma_1.prisma.user_points.create({
                        data: {
                            user_id: referrer.id,
                            points: 10000,
                            points_source_type: "referral",
                            points_source_id: 1,
                            earned_at: new Date(),
                            expires_at: (0, dayjs_1.default)().add(3, 'month').toDate(),
                            points_remaining: user_points_remaining + 10000,
                        }
                    });
                }
                // Sending response
                res.status(201).send({
                    success: true,
                    message: `New user for ${req.body.email} has been registered.`,
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // Check User
            const checkUser = yield prisma_1.prisma.user_account.findUnique({
                where: {
                    email: req.body.email
                }
            });
            if (!checkUser) {
                throw new Error("No account with that email exists.");
            }
            // Comparing Password
            const passwordCompare = (0, bcrypt_1.compare)(req.body.password, checkUser.password);
            if (!passwordCompare) {
                throw new Error("Your entered password is incorrect.");
            }
            // Token
            const token = (0, jsonwebtoken_1.sign)({ id: checkUser.id, email: checkUser.email, role: checkUser.role }, process.env.JWT_TOKEN, { expiresIn: '2h' });
            res.status(200).send({
                success: true,
                message: "Log in successful",
                data: checkUser,
                token: token,
            });
        });
    }
}
exports.default = UserAuthController;
