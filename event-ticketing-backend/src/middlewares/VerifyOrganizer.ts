import { Request, Response, NextFunction } from "express";

export const VerifyOrganizer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  if (!user || user.role !== "organizer") {
    res.status(403).send("Only organizers are allowed.");
    return;
  }

  next();
};

// Refactor Notes
/**
 * 1. Role-agnostic: instead of "organizer", use role so it can be used for both users and organizers later
 * 2. Group middleware: const organizerAuth = [VerifyToken, VerifyOrganizer] --> use as middleware
 * 
 */

export default VerifyOrganizer;
