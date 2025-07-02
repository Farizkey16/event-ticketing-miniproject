import UserAuthController from "../controllers/auth/userAuthController";
import OrganizerAuthController from "../controllers/auth/organizerAuthController";
import { Router } from "express";

class TicketingRouter {
  private route: Router;
  private userAuthController: UserAuthController;
  private organizerAuthController: OrganizerAuthController;

  constructor() {
    this.route = Router();
    this.userAuthController = new UserAuthController();
    this.organizerAuthController = new OrganizerAuthController();
    this.initializeRouters();
  }

  private initializeRouters(): void {
    this.route.post("/register/user", this.userAuthController.register);
    this.route.post("/login/user", this.userAuthController.login)
    this.route.post(
      "/register/organizer",
      this.organizerAuthController.register
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default TicketingRouter;
