import { RequestHandler, Router } from "express";
import UserAuthController from "../controllers/auth/userAuthController";
import { registValidation, loginValidation, passwordValidator } from "../middlewares/validator/auth";
import VerifyToken from "../middlewares/VerifyToken";
import UserProfile from "../controllers/profiles/userProfileController";
import { uploaderMemory } from "../middlewares/uploader";

const router = Router();
const userAuthController = new UserAuthController();
const userProfileController = new UserProfile()

// User Routes
router.post("/register", registValidation, userAuthController.register);
router.post("/login", loginValidation, userAuthController.login);

// Profile Routes
router.get(
  "/profile",
  VerifyToken,
  userProfileController.getProfile
);

router.patch(
  "/profile",
  VerifyToken,
  userProfileController.editProfile
);
router.patch(
  "/password/change",
  VerifyToken,
  passwordValidator,
  userProfileController.changePassword
);
router.patch(
  "/profile-img",
  VerifyToken,
  uploaderMemory().single("img"),
  userProfileController.uploadProfileImage
);
router.post("/reset-password", userProfileController.resetPassword);
router.patch("/reset-password/confirm", userProfileController.confirmResetPassword);

export default router;
