import { Server, Socket } from 'socket.io';
import Message from '../../models/Message.mode';


const registerChatHandlers = (io: Server, socket: Socket) => {
    //joining the ticket room
    socket.on('joinRoom', (ticketId: string) => {
        socket.join(ticketId);
        console.log(`Socket ${socket.id} joined room ${ticketId}`)
    });


    // sending message
    socket.on(
        'sendMessage',
        async (
            data: { ticketId: string; sender: string; message: string },
            callback: (populatedMessage: any) => void
        ) => {
            try {
                // Saving the message in to the DB
                const saved = await Message.create({
                    ticketId: data.ticketId,
                    sender: data.sender,
                    message: data.message,
                });

                // Populating the sender field
                const populated = await saved.populate({
                    path: 'sender',
                    select: '_id name role',
                });

                // broadcasting to everyone
                io.to(data.ticketId).emit('newMessage', populated);


                callback(populated);
            } catch (err) {
                console.error('Socket sendMessage error:', err);
                callback({ error: 'Failed to save message' });
            }
        }
    );


    // typing indicator
    socket.on('typing', ({ ticketId, userId, name }) => {

        socket.to(ticketId).emit('typing', { userId, name });
    });

    socket.on('stopTyping', ({ ticketId, userId, name }) => {
        socket.to(ticketId).emit('stopTyping', { userId, name });
    });


}


export default registerChatHandlers;