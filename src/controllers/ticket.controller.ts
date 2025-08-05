import { Request, Response } from "express";
import Ticket, { ITicket } from "../models/Ticket.model";
import User from "../models/User.model";
import { AuthRequest } from "../middlewares/auth.middleware";

//Creating ticket by CUSTOMER
export const createTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { subject, message, priority } = req.body;
    if (!subject || !message) {
      throw new Error("Subject and message are required");
    }
    const ticket = await Ticket.create({
      user: req.user!._id,
      subject,
      message,
      priority,
    });
    res.status(201).json({ ticket });
  } catch (err) {
    return res.status(400).json({ message: (err as Error).message });
  }
};

//================================================================================================================================//
// get my tickets for CUSTOMER

export const getMyTickets = async (req: AuthRequest, res: Response) => {
  try {
    const tickets = await Ticket.find({ user: req.user!._id });
    res.status(200).json({ tickets });
  } catch (err) {
    return res.status(400).json({ message: (err as Error).message });
  }
};

//================================================================================================================================//

// getting the assinged tickets for AGENTS

export const getAssignedTickets = async (req: AuthRequest, res: Response) => {
  try {
    const tickets = await Ticket.find({ assignedTo: req.user!._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ tickets });
  } catch (err) {
    return res.status(400).json({ message: (err as Error).message });
  }
};

//================================================================================================================================//
// getting all tickets to the admin

export const getAllTickets = async (req: AuthRequest, res: Response) => {
  try {
    const tickets = await Ticket.find()
      .populate("user", "name email")
      .populate("assignedTo", "name email");
    res.status(200).json(tickets);
  } catch (err) {
    return res.status(400).json({ message: (err as Error).message });
  }
};

//================================================================================================================================//

//assigning the ticket to agents by the  ADMIN

export const assignTicket = async (req: AuthRequest, res: Response) => {
  const { ticketId, agentId } = req.body;
  try {
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent") {
      return res.status(404).json({ message: "Agent not found" });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.assignedTo = agentId;
    ticket.status = "assigned";
    await ticket.save();

    const populated = await Ticket.findById(ticket._id)
      .populate("user", "name email")
      .populate("assignedTo", "name email");

    res
      .status(200)
      .json({ message: "Ticket assigned successfully", ticket: populated });
  } catch (err) {
    return res.status(400).json({ message: (err as Error).message });
  }
};

//================================================================================================================================//

// updating the ticket status
export const updateTicketStatus = async (req: AuthRequest, res: Response) => {
  const { ticketId } = req.params;
  const { status, priority } = req.body;

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;

    await ticket.save();
    res.status(200).json({ message: "Ticket updated successfully", ticket });
  } catch (err) {
    return res.status(400).json({ message: (err as Error).message });
  }
};
