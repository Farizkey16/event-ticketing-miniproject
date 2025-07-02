import UserAuthController from "../controllers/auth/userAuthController";
import OrganizerAuthController from "../controllers/auth/organizerAuthController";
import GenerateCoupon from "../controllers/coupon.controller";
import { Router } from "express";

class TicketingRouter {
  private route: Router;
  private userAuthController: UserAuthController;
  private organizerAuthController: OrganizerAuthController;
  private generateCoupon: GenerateCoupon;

  constructor() {
    this.route = Router();
    this.userAuthController = new UserAuthController();
    this.organizerAuthController = new OrganizerAuthController();
    this.generateCoupon = new GenerateCoupon();
    this.initializeRouters();
  }

  private initializeRouters(): void {
    // User Routes
    this.route.post("/register/user", this.userAuthController.register);
    this.route.post("/login/user", this.userAuthController.login)

    // Organizer Routes
    this.route.post(
      "/register/organizer",
      this.organizerAuthController.register
    );

    // Coupon Generator
    this.route.post("/coupon/create", this.generateCoupon.couponGenerator) // Jangan lupa ditambahin verifyToken

  }

  public getRouter(): Router {
    return this.route;
  }
}

export default TicketingRouter;
