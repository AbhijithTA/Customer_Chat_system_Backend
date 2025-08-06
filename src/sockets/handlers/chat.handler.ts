import { Server, Socket } from 'socket.io';
import Message from '../../models/Message.mode';


const registerChatHandlers = (io: Server, socket: Socket) => {
    //joining the ticket room
    socket.on('joinRoom', (ticketId: string) => {
        socket.join(ticketId);
        console.log(`Socket ${socket.id} joined room ${ticketId}`)
    });

    // sending the message
    socket.on('sendMessage', async (data: {
        ticketId: string;
        sender: string; // this should be userId
        message: string;
    }) => {
        const { ticketId, sender, message } = data;

        const savedMessage = await Message.create({
            ticketId,
            sender,
            message
        });

        const populatedMessage = await savedMessage.populate({
            path: 'sender',
            select: '_id name role'
        });

        io.to(ticketId).emit('newMessage', populatedMessage);
        console.log('Message sent to room:', ticketId, populatedMessage.message);
    });


    // typing indicator
    socket.on('typing', ({ ticketId, userId, name }) => {

        socket.to(ticketId).emit('typing', { userId, name });
    });

    socket.on('stopTyping', ({ ticketId, userId, name }) => {
        socket.to(ticketId).emit('stopTyping', { userId, name });
    });


}


export default registerChatHandlers;