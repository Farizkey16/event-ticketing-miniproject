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
  orgProfileValidator,
} from "../middlewares/validator/auth";
import { Request, Response } from "express";
import { prisma } from "../config/prisma";

const router = Router();
const organizerAuth = new OrganizerAuthController();
const organizerProfile = new OrganizerProfileController();

// Auth Routes
router.post("/register", registValidation, organizerAuth.register);
router.post("/login", loginValidation, organizerAuth.login);
router.get("/logout", organizerAuth.logout);

// Profile Routes
router.get(
  "/profile",
  VerifyToken,
  VerifyOrganizer,
  orgProfileValidator,
  organizerProfile.getProfile
);
router.patch(
  "/profile",
  VerifyToken,
  VerifyOrganizer,
  organizerProfile.editProfile
);
router.patch(
  "/password/change",
  VerifyToken,
  VerifyOrganizer,
  passwordValidator,
  organizerProfile.changePassword
);
router.patch(
  "/profile-img",
  VerifyToken,
  VerifyOrganizer,
  uploaderMemory().single("img"),
  organizerProfile.uploadProfileImage
);
router.post("/reset-password", organizerProfile.resetPassword);
router.patch("/reset-password/confirm", organizerProfile.confirmResetPassword);

// Me (Passing ID to Front-end)
router.get("/me", VerifyToken, async (req: Request, res: Response) => {
  console.log("🔥 /me endpoint hit");
  const { id } = res.locals.user;
  console.log("User ID from token:", id);
  const organizer = await prisma.organizer_account.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  console.log(organizer)

  if (!organizer) {
    res.status(404).json({
      success: false,
      message: "Organizer not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: organizer,
  });

   
});

export default router;
