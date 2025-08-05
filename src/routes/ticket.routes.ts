import express from "express";

import { protect, authorize } from "../middlewares/auth.middleware";
import {
  assignTicket,
  createTicket,
  getAllTickets,
  getMyTickets,
  updateTicketStatus,
} from "../controllers/ticket.controller";

const router = express.Router();

//CUSTOMER
router.post("/", protect, authorize("customer"), createTicket);
router.get("/my", protect, authorize("customer"), getMyTickets);

//Agent
router.get("/assigned", protect, authorize("agent"), getMyTickets);

//admin
router.get("/all", protect, authorize("admin"), getAllTickets);
router.post("/assign", protect, authorize("admin"), assignTicket);

//shared route by admin/agent
router.put("/:ticketId/status",protect,authorize("admin", "agent"),updateTicketStatus);


export default router;