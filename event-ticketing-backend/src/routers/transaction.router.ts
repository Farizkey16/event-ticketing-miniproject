import { Router } from "express";
import OrganizerTransaction from "../controllers/transaction/organizerTransactionController";
import VerifyToken from "../middlewares/VerifyToken";
import VerifyOrganizer from "../middlewares/VerifyOrganizer";



const router = Router();
const transactionCtrl = new OrganizerTransaction();

// Transaction Routes
router.patch("/:id/accept", VerifyToken, VerifyOrganizer, transactionCtrl.acceptPayment)
router.post("/:id/reject", VerifyToken, VerifyOrganizer, transactionCtrl.rejectPayment)
router.get("/:id/proof", VerifyToken, VerifyOrganizer, transactionCtrl.viewProof)
router.get("/get-transactions", VerifyToken, VerifyOrganizer, transactionCtrl.getTransactions)

export default router;