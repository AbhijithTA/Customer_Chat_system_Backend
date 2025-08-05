import { Server, Socket } from 'socket.io';
import Message from '../../models/Message.mode';


const registerChatHandlers = (io: Server, socket: Socket) => {
    //joining the ticket room
    socket.on('joinRoom', (ticketId: string) => {
        socket.join(ticketId);
        console.log(`Socket ${socket.id} joined room ${ticketId}`)
    });

    //sending the message
    socket.on('sendMessage', async (data: {
        ticketId: string;
        sender: string;
        message: string;
    }) => {
        const { ticketId, sender, message } = data;

        //saving the message into the db
        const savedMessage = await Message.create({
            ticketId,
            sender,
            message
        });

        //broadcasting to all clients in the room
        io.to(ticketId).emit('newMessage', savedMessage);
        console.log('Message send to room:', ticketId, savedMessage.message);


    });

    // typing indicator
    socket.on('typing', ({ ticketId, userId }) => {
        socket.to(ticketId).emit('typing', { userId });
    });

    socket.on('stopTyping', ({ ticketId, userId }) => {
        socket.to(ticketId).emit('stopTyping', { userId });
    });


}


export default registerChatHandlers;