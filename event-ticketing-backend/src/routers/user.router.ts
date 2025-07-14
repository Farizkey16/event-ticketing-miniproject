import { Router } from "express";
import UserAuthController from "../controllers/auth/userAuthController";
import { registValidation, loginValidation } from "../middlewares/validator/auth";

const router = Router();
const userAuthController = new UserAuthController();

// User Routes
router.post("/register", registValidation, userAuthController.register);
router.post("/login", loginValidation, userAuthController.login);

export default router;
