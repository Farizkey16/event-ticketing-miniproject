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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
const nodemailer_1 = __importDefault(require("nodemailer"));
const prisma_1 = require("../../config/prisma");
const bcrypt_2 = __importDefault(require("bcrypt"));
class OrganizerProfile {
    constructor() {
        this.newProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { organizer_name, organizer_address, organizer_phone, organizer_profile_image, } = req.body;
                const organizer = res.locals.user;
                if (organizer.role !== "organizer") {
                    res.status(403).send("You are not allowed to access this page.");
                    return;
                }
                const checkOrganizer = yield prisma_1.prisma.organizer_account.findUnique({
                    where: {
                        id: organizer.id,
                    },
                });
                if (!checkOrganizer) {
                    res.status(404).send("This account does not exist.");
                    return;
                }
                if (!organizer_name || !organizer_address || !organizer_phone) {
                    res.status(400).send({
                        message: "Missing required profile fields.",
                    });
                    return;
                }
                const newProfile = yield prisma_1.prisma.organizer_profile.create({
                    data: {
                        organizer_name,
                        organizer_address,
                        organizer_phone,
                        organizer_profile_image,
                        organizer: {
                            connect: { id: organizer.id },
                        },
                    },
                });
                res.status(200).send({
                    success: true,
                    message: "Your profile has been created",
                    data: newProfile,
                });
            }
            catch (err) {
                console.error(err);
                next(err);
            }
        });
        this.editProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const organizer = res.locals.user;
                const { organizer_name, organizer_address, organizer_phone, organizer_profile_image, } = req.body;
                if (organizer.role !== "organizer") {
                    res.status(403).send("You are not allowed to access this page.");
                    return;
                }
                const checkOrganizer = yield prisma_1.prisma.organizer_account.findUnique({
                    where: {
                        id: organizer.id,
                    },
                });
                if (!checkOrganizer) {
                    res.status(404).send("This account does not exist.");
                    return;
                }
                if (!organizer_name || !organizer_address || !organizer_phone) {
                    res.status(400).send({
                        message: "Missing required profile fields.",
                    });
                    return;
                }
                const profile = yield prisma_1.prisma.organizer_profile.findUnique({
                    where: {
                        organizer_id: organizer.id,
                    },
                });
                if (!profile) {
                    res.status(404).send("Organizer profile not found.");
                }
                const updatedProfile = yield prisma_1.prisma.organizer_profile.update({
                    where: {
                        id: organizer.id,
                    },
                    data: {
                        organizer_name,
                        organizer_address,
                        organizer_phone,
                        organizer_profile_image,
                        organizer: {
                            connect: { id: organizer.id },
                        },
                    },
                });
                res.status(200).send({
                    success: true,
                    message: "Your profile has been created",
                    data: updatedProfile,
                });
            }
            catch (err) {
                console.error(err);
                next(err);
            }
        });
        this.changePassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const organizer = res.locals.user;
                const { old_password, new_password } = req.body;
                if (!old_password || !new_password) {
                    res.status(400).send("Old and new passwords are required.");
                }
                const organizerReset = yield prisma_1.prisma.organizer_account.findUnique({
                    where: {
                        id: organizer.id,
                    },
                });
                if (!organizerReset) {
                    res.status(404).send("No organizer account is found from the id.");
                    return;
                }
                const isMatch = yield (0, bcrypt_1.compare)(old_password, organizerReset.password);
                if (!isMatch) {
                    res.status(401).send("Wrong password.");
                    return;
                }
                yield prisma_1.prisma.organizer_account.update({
                    where: {
                        id: organizer.id,
                    },
                    data: {
                        password: new_password,
                    },
                });
                res.status(200).send({
                    success: true,
                    message: "password has been reset successfully.",
                });
            }
            catch (err) {
                console.error(err);
                next(err);
            }
        });
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email) {
                    res.status(400).send({ success: false, message: "Email required" });
                    return;
                }
                const findOrganizer = yield prisma_1.prisma.organizer_account.findUnique({
                    where: {
                        email
                    }
                });
                const token = jsonwebtoken_1.default.sign({ id: findOrganizer === null || findOrganizer === void 0 ? void 0 : findOrganizer.id, role: "organizer" }, process.env.JWT_TOKEN, { expiresIn: "20m" });
                const transporter = nodemailer_1.default.createTransport({
                    service: "Gmail",
                    auth: {
                        user: process.env.MAIL_SENDER,
                        pass: process.env.MAIL_PASS,
                    },
                });
                const resetLink = `http://localhost:3000/organizer/reset-password?token=${token}`;
                yield transporter.sendMail({
                    from: process.env.MAIL_SENDER,
                    to: findOrganizer === null || findOrganizer === void 0 ? void 0 : findOrganizer.email,
                    subject: "Password Reset",
                    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 20 minutes.</p>`,
                });
                res.status(200).send({
                    success: true,
                    message: "Password reset email sent.",
                });
            }
            catch (err) {
                console.error(err);
                next(err);
            }
        });
        this.confirmResetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, newPassword } = req.body;
                const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN);
                const organizerCheck = yield prisma_1.prisma.organizer_account.findUnique({
                    where: {
                        id: payload.id
                    }
                });
                if (!organizerCheck) {
                    res.status(404).send("Organizer not found.");
                }
                const hashedPassword = yield bcrypt_2.default.hash(newPassword, 10);
                yield prisma_1.prisma.organizer_account.update({
                    where: {
                        id: payload.id
                    }, data: {
                        password: hashedPassword
                    }
                });
                res.status(200).send({
                    success: true,
                    message: "New password successfully created."
                });
                const transporter = nodemailer_1.default.createTransport({
                    service: "Gmail",
                    auth: {
                        user: process.env.MAIL_SENDER,
                        pass: process.env.MAIL_PASS,
                    },
                });
                yield transporter.sendMail({
                    from: process.env.MAIL_SENDER,
                    to: organizerCheck === null || organizerCheck === void 0 ? void 0 : organizerCheck.email,
                    subject: "Password Reset Successful",
                    html: `Your password has been reset successfully.`,
                });
            }
            catch (err) {
                console.error(err);
                if (err.name === "TokenExpiredError") {
                    res.status(401).send("Reset token expired.");
                }
                res.status(500).send("Internal server error.");
            }
        });
        this.getProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const organizer = res.locals.user;
                const profile = yield prisma_1.prisma.organizer_account.findUnique({
                    where: {
                        id: organizer.id,
                    },
                });
                if (!profile) {
                    res.status(404).send("Profile not found.");
                }
                res.status(200).send({
                    success: true,
                    data: profile,
                });
            }
            catch (err) {
                console.error(err);
                next(err);
            }
        });
    }
}
exports.default = OrganizerProfile;
