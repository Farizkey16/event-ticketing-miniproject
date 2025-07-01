import TicketingController from "../controllers/ticketing.controllers";
import { Router } from "express";

class TicketingRouter {
  private route: Router;
  private ticketingController: TicketingController;

  constructor() {
    this.route = Router();
    this.ticketingController = new TicketingController();
    this.initializeRouters();
  }

  private initializeRouters(): void {
    this.route.post("/register", this.ticketingController.register);
  }

  public getRouter(): Router {
    return this.route
  }
}

export default TicketingRouter;
