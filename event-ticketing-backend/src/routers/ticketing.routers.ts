import UserAuthController from "../controllers/auth/userAuthController";
import OrganizerAuthController from "../controllers/auth/organizerAuthController";
import GenerateCoupon from "../controllers/coupon/coupon.controller";
import OrganizerEventManagement from "../controllers/event/organizerEventController";
import { VerifyToken } from "../middlewares/VerifyToken";
import { Router } from "express";
import OrganizerProfile from "../controllers/profiles/organizerProfileController";
import VerifyOrganizer from "../middlewares/VerifyOrganizer";
import { Verify } from "crypto";

class TicketingRouter {
  private route: Router;
  private userAuthController: UserAuthController;
  private organizerAuthController: OrganizerAuthController;
  private generateCoupon: GenerateCoupon;
  private organizerEventManagement: OrganizerEventManagement;
  private organizerProfile: OrganizerProfile;

  constructor() {
    this.route = Router();
    this.userAuthController = new UserAuthController();
    this.organizerAuthController = new OrganizerAuthController();
    this.generateCoupon = new GenerateCoupon();
    this.organizerEventManagement = new OrganizerEventManagement();
    this.organizerProfile = new OrganizerProfile();
    this.initializeRouters();
  }

  private initializeRouters(): void {
    // User Routes
    this.route.post("/user/register", this.userAuthController.register);
    this.route.post("/user/login", this.userAuthController.login);

    // Organizer Routes
    this.route.post(
      "/organizer/register",
      this.organizerAuthController.register
    );
    this.route.post("/organizer/login", this.organizerAuthController.login);
    this.route.get("/organizer/profile", VerifyToken, VerifyOrganizer, this.organizerProfile.getProfile);
    this.route.patch("/organizer/profile", VerifyToken, VerifyOrganizer, this.organizerProfile.editProfile)
    this.route.patch("/organizer/password/change", VerifyToken, VerifyOrganizer, this.organizerProfile.changePassword)
    this.route.post("/organizer/reset-password", this.organizerProfile.resetPassword)
    this.route.patch("/organizer/reset-password/confirm", this.organizerProfile.confirmResetPassword)

    // Coupon Generator
    this.route.post("/coupon/create", VerifyToken, VerifyOrganizer, this.generateCoupon.couponGenerator); 

    // Event Management
    this.route.post(
      "/event/create",
      VerifyToken, VerifyOrganizer,
      this.organizerEventManagement.newEvent
    );

    this.route.patch(
      "/event/edit/:id",
      VerifyToken, VerifyOrganizer,
      this.organizerEventManagement.editEvent
    );
    this.route.delete(
      "/event/delete/:id",
      VerifyToken, VerifyOrganizer,
      this.organizerEventManagement.deleteEvent
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default TicketingRouter;
