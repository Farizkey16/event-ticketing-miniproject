"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyOrganizer = void 0;
const VerifyOrganizer = (req, res, next) => {
    const user = res.locals.user;
    if (!user || user.role !== "organizer") {
        res.status(403).send("Only organizers are allowed.");
        return;
    }
    next();
};
exports.VerifyOrganizer = VerifyOrganizer;
// Refactor Notes
/**
 * 1. Role-agnostic: instead of "organizer", use role so it can be used for both users and organizers later
 * 2. Group middleware: const organizerAuth = [VerifyToken, VerifyOrganizer] --> use as middleware
 *
 */
exports.default = exports.VerifyOrganizer;
