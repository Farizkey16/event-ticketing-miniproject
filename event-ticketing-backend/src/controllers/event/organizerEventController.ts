import { NextFunction, Request, Response } from "express";
import { compare } from "bcrypt";
import { Jwt, sign } from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import dayjs from "dayjs";

class OrganizerEventManagement {
  // Create New Event
  public newEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const organizer = res.locals.user;
    const expiry = req.body.expires_at
      ? new Date(req.body.expires_at)
      : dayjs().add(3, "months").toDate();

    if (organizer?.role !== "organizer") {
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
      const { name, price, start_date, end_date, seat_capacity, event_type } =
        req.body;

      const parsed_startDate = new Date(start_date);
      const parsed_endDate = new Date(end_date);

      if (!name || !price || !start_date || !end_date || !seat_capacity || !event_type) {
      res.status(400).send({ message: "Missing required fields" });
      return;
      }

      await prisma.event_table.create({
        data: {
          name,
          organizer_id: organizer?.id,
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
    } catch (err) {
      next(err);
      console.log(err);
    }
  };

  // Edit Event
  public editEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const organizer = res.locals.user;
      const { id } = req.params;
      const { name, price, start_date, end_date, seat_capacity, event_type } =
        req.body;

      const parsed_startDate = new Date(start_date);
      const parsed_endDate = new Date(end_date);

      const event = await prisma.event_table.findUnique({
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

      const updatedEvent = await prisma.event_table.update({
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
    } catch (err) {
      console.log(err);
    }
  };

  public deleteEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const organizer = res.locals.user;
    const { id } = req.params;

    try {
      const event = await prisma.event_table.findUnique({
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

      await prisma.event_table.delete({
        where: {
          id: parseInt(id),
        },
      });

      res.status(200).send({
        success: true,
        message: `event "${event.name}" has been deleted.`,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export default OrganizerEventManagement;
