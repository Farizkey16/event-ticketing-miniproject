import { Router } from "express";
import OrganizerEventController from "../controllers/event/organizerEventController";
import { VerifyToken } from "../middlewares/VerifyToken";
import VerifyOrganizer from "../middlewares/VerifyOrganizer";
import {
  eventValidator,
  editEventValidator,
  deleteEventValidator,
} from "../middlewares/validator/auth";

const router = Router();
const eventCtrl = new OrganizerEventController();

router.post("/create", VerifyToken, VerifyOrganizer, eventValidator, eventCtrl.newEvent);
router.patch("/edit/:id", VerifyToken, VerifyOrganizer, editEventValidator, eventCtrl.editEvent);
router.delete("/delete/:id", VerifyToken, VerifyOrganizer, deleteEventValidator, eventCtrl.deleteEvent);

export default router;
