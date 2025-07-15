import express, { Application, Response, Request, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import MainRouter from "./routers/main.router";
import logger from "./utils/logger";
dotenv.config();
import cookieParser from "cookie-parser"

const PORT: string = process.env.PORT || "4000";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.route();
    this.errorHandler();
  }

  private configure(): void {
    this.app.use(cors({
      origin: "http://localhost:3000",
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true
    }));
    this.app.use(express.json());
    this.app.use(cookieParser())
  }

  private route(): void {
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).json("<h1>Welcome to Mini Project</h1>");
    });

    this.app.use("/api", MainRouter);
  }

  private errorHandler(): void {
    this.app.use((error:any, req:Request, res:Response, next:NextFunction) => {
      logger.error(`${req.method} ${req.path}: ${error.message} ${JSON.stringify(error)}`)

      if (res.headersSent) {
        return next(error)
      }

      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
      })
    })
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`API RUNNING AT: http://localhost:${PORT}`);
    });
  }
}

export default App;
