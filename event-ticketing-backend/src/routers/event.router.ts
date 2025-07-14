import { Router } from "express";
import OrganizerEventController from "../controllers/event/organizerEventController";
import { VerifyToken } from "../middlewares/VerifyToken";
import VerifyOrganizer from "../middlewares/VerifyOrganizer";
import {
  eventValidator,
  editEventValidator,
  deleteEventValidator,
} from "../middlewares/validator/auth";
import { CookieDebugger } from "../middlewares/CookieDebugger";

const router = Router();
const eventCtrl = new OrganizerEventController();

router.post("/create", VerifyToken, VerifyOrganizer, eventValidator, eventCtrl.newEvent);
router.patch("/edit/:id", VerifyToken, VerifyOrganizer, editEventValidator, eventCtrl.editEvent);
router.delete("/delete/:id", VerifyToken, VerifyOrganizer, deleteEventValidator, eventCtrl.deleteEvent);
router.get("/fetch", VerifyToken, VerifyOrganizer, eventCtrl.getEvent)
router.get("/get-attendees", CookieDebugger, VerifyToken, VerifyOrganizer, eventCtrl.getEventAttendees)
router.get("/check-cookie", (req, res) => {
  console.log("Cookies:", req.cookies); // <- should log token if sent from client
  res.send(req.cookies);
});


export default router;
