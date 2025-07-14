"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../config/prisma");
const dayjs_1 = __importDefault(require("dayjs"));
class OrganizerEventManagement {
    constructor() {
        // Create New Event
        this.newEvent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const organizer = res.locals.user;
            const expiry = req.body.expires_at
                ? new Date(req.body.expires_at)
                : (0, dayjs_1.default)().add(3, "months").toDate();
            if ((organizer === null || organizer === void 0 ? void 0 : organizer.role) !== "organizer") {
                res
                    .status(403)
                    .json({ message: "You need to be the organizer to access this page." });
                return;
            }
            if (!organizer.id) {
                res.status(400).json({ message: "Organizer ID is required." });
                return;
            }
            try {
                const { name, price, start_date, end_date, seat_capacity, event_type } = req.body;
                const parsed_startDate = new Date(start_date);
                const parsed_endDate = new Date(end_date);
                if (!name || !price || !start_date || !end_date || !seat_capacity || !event_type) {
                    res.status(400).send({ message: "Missing required fields" });
                    return;
                }
                yield prisma_1.prisma.event_table.create({
                    data: {
                        name,
                        organizer_id: organizer === null || organizer === void 0 ? void 0 : organizer.id,
                        price,
                        start_date: parsed_startDate,
                        end_date: parsed_endDate,
                        seat_capacity,
                        event_type,
                        expires_at: expiry,
                    },
                });
                // Sending response
                res.status(201).send({
                    success: true,
                    message: `New event "${name}" has been created.`,
                });
            }
            catch (err) {
                next(err);
                console.log(err);
            }
        });
        // Edit Event
        this.editEvent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const organizer = res.locals.user;
                const { id } = req.params;
                const { name, price, start_date, end_date, seat_capacity, event_type } = req.body;
                const parsed_startDate = new Date(start_date);
                const parsed_endDate = new Date(end_date);
                const event = yield prisma_1.prisma.event_table.findUnique({
                    where: {
                        id: parseInt(id, 10),
                    },
                });
                if (organizer.role !== "organizer") {
                    res.status(403).send("You are not allowed to access this page.");
                    return;
                }
                if (!event) {
                    res.status(404).send("Event not found.");
                    return;
                }
                if (event.organizer_id !== organizer.id) {
                    res.status(403).send("you can only edit your own events.");
                    return;
                }
                const updatedEvent = yield prisma_1.prisma.event_table.update({
                    where: {
                        id: parseInt(id, 10),
                    },
                    data: {
                        name,
                        price,
                        start_date: parsed_startDate,
                        end_date: parsed_endDate,
                        seat_capacity,
                        event_type,
                    },
                });
                res.status(200).send({
                    success: true,
                    message: `Event "${updatedEvent.name}" has been updated.`,
                    event: updatedEvent,
                });
            }
            catch (err) {
                console.log(err);
            }
        });
        this.deleteEvent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const organizer = res.locals.user;
            const { id } = req.params;
            try {
                const event = yield prisma_1.prisma.event_table.findUnique({
                    where: {
                        id: parseInt(id, 10),
                    },
                });
                if (organizer.role !== "organizer") {
                    res.status(403).send("You are not allowed to access this page.");
                    return;
                }
                if (!event) {
                    res.status(404).send("Event not found.");
                    return;
                }
                if (event.organizer_id !== organizer.id) {
                    res.status(403).send("you can only delete your own events.");
                    return;
                }
                yield prisma_1.prisma.event_table.delete({
                    where: {
                        id: parseInt(id),
                    },
                });
                res.status(200).send({
                    success: true,
                    message: `event "${event.name}" has been deleted.`,
                });
            }
            catch (err) {
                console.log(err);
            }
        });
        this.getEvent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = OrganizerEventManagement;
