import { Server, Socket } from 'socket.io';
import registerChatHandlers from './handlers/chat.handler';



const registerSocketHandlers = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('New client connected:', socket.id);

        registerChatHandlers(io, socket);

        socket.on('disconnect', () => {
            console.log('Client disconnected', socket.id);
        });
    });
};

export default registerSocketHandlers