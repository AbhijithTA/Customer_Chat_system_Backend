import { Request, Response } from 'express';
import Message from '../models/Message.mode';
import { AuthRequest } from '../middlewares/auth.middleware';

//sending a message

export const sendMessage = async (req: AuthRequest, res: Response) => {
    const { ticketId, message } = req.body;


    if (!ticketId || !message) {
        return res.status(400).json({ message: 'Ticket ID and message are required' });

    }
    try {
        const newMessage = await Message.create({
            ticketId,
            sender: req.user!.id,
            message
        });

        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message })
    }
}


//get all messages in the ticket
export const getMessagesByTicket = async (req: AuthRequest, res: Response) => {
    const { ticketId } = req.params;

    try {
        const messages = await Message.find({ ticketId }).sort({ createdAt: 1 }).populate('sender', 'name email');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}