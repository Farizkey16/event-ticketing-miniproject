"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userAuthController_1 = __importDefault(require("../controllers/auth/userAuthController"));
const organizerAuthController_1 = __importDefault(require("../controllers/auth/organizerAuthController"));
const coupon_controller_1 = __importDefault(require("../controllers/coupon/coupon.controller"));
const organizerEventController_1 = __importDefault(require("../controllers/event/organizerEventController"));
const VerifyToken_1 = require("../middlewares/VerifyToken");
const express_1 = require("express");
const organizerProfileController_1 = __importDefault(require("../controllers/profiles/organizerProfileController"));
const VerifyOrganizer_1 = __importDefault(require("../middlewares/VerifyOrganizer"));
class TicketingRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.userAuthController = new userAuthController_1.default();
        this.organizerAuthController = new organizerAuthController_1.default();
        this.generateCoupon = new coupon_controller_1.default();
        this.organizerEventManagement = new organizerEventController_1.default();
        this.organizerProfile = new organizerProfileController_1.default();
        this.initializeRouters();
    }
    initializeRouters() {
        // User Routes
        this.route.post("/user/register", this.userAuthController.register);
        this.route.post("/user/login", this.userAuthController.login);
        // Organizer Routes
        this.route.post("/organizer/register", this.organizerAuthController.register);
        this.route.post("/organizer/login", this.organizerAuthController.login);
        this.route.get("/organizer/profile", VerifyToken_1.VerifyToken, VerifyOrganizer_1.default, this.organizerProfile.getProfile);
        this.route.patch("/organizer/profile", VerifyToken_1.VerifyToken, VerifyOrganizer_1.default, this.organizerProfile.editProfile);
        this.route.patch("/organizer/password/change", VerifyToken_1.VerifyToken, VerifyOrganizer_1.default, this.organizerProfile.changePassword);
        this.route.post("/organizer/reset-password", this.organizerProfile.resetPassword);
        this.route.patch("/organizer/reset-password/confirm", this.organizerProfile.confirmResetPassword);
        // Coupon Generator
        this.route.post("/coupon/create", VerifyToken_1.VerifyToken, VerifyOrganizer_1.default, this.generateCoupon.couponGenerator);
        // Event Management
        this.route.post("/event/create", VerifyToken_1.VerifyToken, VerifyOrganizer_1.default, this.organizerEventManagement.newEvent);
        this.route.patch("/event/edit/:id", VerifyToken_1.VerifyToken, VerifyOrganizer_1.default, this.organizerEventManagement.editEvent);
        this.route.delete("/event/delete/:id", VerifyToken_1.VerifyToken, VerifyOrganizer_1.default, this.organizerEventManagement.deleteEvent);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = TicketingRouter;
