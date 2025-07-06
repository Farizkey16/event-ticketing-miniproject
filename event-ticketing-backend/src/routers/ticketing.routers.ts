import UserAuthController from "../controllers/auth/userAuthController";
import OrganizerAuthController from "../controllers/auth/organizerAuthController";
import GenerateCoupon from "../controllers/coupon.controller";
import OrganizerEventManagement from "../controllers/event/organizerEventController";
import { VerifyToken } from "../middlewares/VerifyToken";
import { Router } from "express";
import OrganizerProfile from "../controllers/profiles/organizerProfileController";

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
    this.route.post("/organizer/profile", VerifyToken, this.organizerProfile.newProfile)

    // Coupon Generator
    this.route.post("/coupon/create", VerifyToken, this.generateCoupon.couponGenerator); 

    // Event Management
    this.route.post(
      "/event/create",
      VerifyToken,
      this.organizerEventManagement.newEvent
    );

    this.route.patch(
      "/event/edit/:id",
      VerifyToken,
      this.organizerEventManagement.editEvent
    );
    this.route.delete(
      "/event/delete/:id",
      VerifyToken,
      this.organizerEventManagement.deleteEvent
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default TicketingRouter;
