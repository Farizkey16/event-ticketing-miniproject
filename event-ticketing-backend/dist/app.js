"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const ticketing_routers_1 = __importDefault(require("./routers/ticketing.routers"));
dotenv_1.default.config();
const PORT = process.env.PORT || "4000";
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configure();
        this.route();
    }
    configure() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
    }
    route() {
        const ticketingRouter = new ticketing_routers_1.default();
        this.app.get("/", (req, res) => {
            res.status(200).json("<h1>Welcome to Mini Project</h1>");
        });
        this.app.use("/ticket", ticketingRouter.getRouter());
    }
    start() {
        this.app.listen(PORT, () => {
            console.log(`API RUNNING AT: http://localhost:${PORT}`);
        });
    }
}
exports.default = App;
