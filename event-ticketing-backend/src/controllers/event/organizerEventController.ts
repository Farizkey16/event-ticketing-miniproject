import { NextFunction, Request, Response } from "express";
import { compare } from "bcrypt";
import AppError from "../../errors/AppError";
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
      throw new AppError("Unauthorized access.", 401);
    }

    if (!organizer.id) {
      throw new AppError("Organizer ID is required.", 400);
    }

    try {
      const { name, price, start_date, end_date, seat_capacity, event_type, slug } =
        req.body;

      const parsed_startDate = new Date(start_date);
      const parsed_endDate = new Date(end_date);

      if (
        !name ||
        !price ||
        !start_date ||
        !end_date ||
        !seat_capacity ||
        !event_type
      ) {
        throw new AppError("Missing fields required.", 400);
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
          slug
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
        throw new AppError("Unauthorized access.", 401);
      }

      if (!event) {
        throw new AppError("Event not found.", 404);
      }

      if (event.organizer_id !== organizer.id) {
        throw new AppError("Edit only your own event.", 403);
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
        throw new AppError("Unauthorized access.", 401);
      }

      if (!event) {
        throw new AppError("Event not found.", 404);
      }

      if (event.organizer_id !== organizer.id) {
        throw new AppError("Delete only your own event", 403)
      }

      // Delete Children 
      await prisma.event_attendees.deleteMany({
        where: {
          id: event.id
        }
      })

      // Delete Event
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

  public getEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    try{
      const organizer = res.locals.user

      if (!organizer) {
        return next (new AppError("You are not allowed to access this page.", 403))
      }
      
      const events = await prisma.event_table.findMany({
        where: {
          organizer_id: organizer.id
        }
      })

      if (!events || events.length === 0) {
        return next (new AppError("Events not found.", 404))
      }

      res.status(200).send({
        success: true,
        message: `Events from organizer ${organizer.username} successfully fetched.`,
        data: events
      })
    }catch(err){
      console.error(err);
      next(err)

    }
  };

  public getEventAttendees = async (req:Request,res:Response,next:NextFunction) => {
    try{

      const organizer = res.locals.user;

      if (!organizer) {
        return next (new AppError("You are not allowed to access this page.", 403))
      }

      const attendees = await prisma.event_attendees.findMany({
        where: {
          organizer_id: organizer.id
        },
        include: {
          event: {
            select: {
              name: true
            },
          },
          user: {
            select: {
              username: true
            }
          }
        }
      })

      if (!attendees || attendees.length === 0) {
        return next (new AppError("Attendees not found.", 404))
      }

      const formatted = attendees.map((a) => ({
        id: a.id,
        eventName: a.event.name,
        userName: a.user.username,
        ticketQuantity: a.ticket_quantity,
        totalPricePaid: a.total_price_paid,
        status: a.status
      }))

      res.status(200).send({
        success: true,
        message: `Events from organizer ${organizer.username} successfully fetched.`,
        data: formatted
      })


    }catch(err){
      console.error(err);
      next(err)

    }
  }
}

export default OrganizerEventManagement;
