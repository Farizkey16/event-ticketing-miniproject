import { Router } from "express";
import OrganizerAuthController from "../controllers/auth/organizerAuthController";
import OrganizerProfileController from "../controllers/profiles/organizerProfileController";
import { VerifyToken } from "../middlewares/VerifyToken";
import VerifyOrganizer from "../middlewares/VerifyOrganizer";
import { uploaderMemory } from "../middlewares/uploader";
import {
  registValidation,
  loginValidation,
  passwordValidator,
  orgProfileValidator
} from "../middlewares/validator/auth";

const router = Router();
const organizerAuth = new OrganizerAuthController();
const organizerProfile = new OrganizerProfileController();

// Auth Routes
router.post("/register", registValidation, organizerAuth.register);
router.post("/login", loginValidation, organizerAuth.login);

// Profile Routes
router.get("/profile", VerifyToken, VerifyOrganizer, orgProfileValidator, organizerProfile.getProfile);
router.patch("/profile", VerifyToken, VerifyOrganizer, organizerProfile.editProfile);
router.patch("/password/change", VerifyToken, VerifyOrganizer, passwordValidator, organizerProfile.changePassword);
router.patch("/profile-img", VerifyToken, VerifyOrganizer, uploaderMemory().single("img"), organizerProfile.uploadProfileImage);
router.post("/reset-password", organizerProfile.resetPassword);
router.patch("/reset-password/confirm", organizerProfile.confirmResetPassword);

export default router;
