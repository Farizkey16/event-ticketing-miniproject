import express, { Application, Response, Request, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import TicketingRouter from "./routers/ticketing.routers";
dotenv.config();

const PORT: string = process.env.PORT || "4000";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.route();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private route(): void {
    const ticketingRouter = new TicketingRouter;
    this.app.use("/ticket", ticketingRouter.getRouter())
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`API RUNNING AT: http://localhost:${PORT}`);
    });
  }
}

export default App;
