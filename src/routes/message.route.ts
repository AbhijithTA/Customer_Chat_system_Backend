import express from 'express';
import { protect } from '../middlewares/auth.middleware';
import { getMessagesByTicket, sendMessage } from '../controllers/message.controller';


const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:ticketId', protect, getMessagesByTicket);

export default router;