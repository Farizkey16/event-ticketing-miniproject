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
const bcrypt_2 = __importDefault(require("bcrypt"));
class OrganizerAuthController {
    constructor() {
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                // Check availability
                const email = (_a = req.body.email) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
                const username = (_b = req.body.username) === null || _b === void 0 ? void 0 : _b.trim();
                const password = req.body.password;
                if (!email || !username || !password) {
                    res.status(400).send({
                        success: false,
                        message: "Email, username, and password are required.",
                    });
                    return;
                }
                const checkOrganizer = yield prisma_1.prisma.organizer_account.findFirst({
                    where: {
                        OR: [{ email }, { username }],
                    },
                });
                if (checkOrganizer) {
                    res.status(400).send({
                        success: false,
                        message: "Email or username already exists.",
                    });
                    return;
                }
                // Registering User
                const hashedPassword = yield bcrypt_2.default.hash(password, 10);
                const organizer = yield prisma_1.prisma.organizer_account.create({
                    data: {
                        email,
                        username,
                        password: hashedPassword,
                        role: "organizer",
                        organizer_profile: {
                            create: {
                                organizer_name: "",
                                organizer_address: "",
                                organizer_phone: 0,
                                organizer_profile_image: "",
                            },
                        },
                    },
                    include: {
                        organizer_profile: true,
                    },
                });
                // Sending response
                res.status(201).send({
                    success: true,
                    message: `New organizer for ${req.body.email} has been registered.`,
                    data: {
                        id: organizer.id,
                        email: organizer.email,
                        username: organizer.username,
                        profile: organizer.organizer_profile,
                    },
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // Check Organizer
            const checkOrganizer = yield prisma_1.prisma.organizer_account.findUnique({
                where: {
                    email: req.body.email,
                },
            });
            if (!checkOrganizer) {
                throw new Error("No account with that email exists.");
            }
            // Comparing Password
            const passwordCompare = (0, bcrypt_1.compare)(req.body.password, checkOrganizer.password);
            if (!passwordCompare) {
                throw new Error("Your entered password is incorrect.");
            }
            // Token
            const token = (0, jsonwebtoken_1.sign)({
                id: checkOrganizer.id,
                email: checkOrganizer.email,
                role: checkOrganizer.role,
            }, process.env.JWT_TOKEN, { expiresIn: "2h" });
            res.status(200).send({
                success: true,
                message: "Log in successful",
                data: checkOrganizer,
                token: token,
            });
        });
    }
}
exports.default = OrganizerAuthController;
