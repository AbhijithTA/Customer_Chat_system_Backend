import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import http from "http";
import path from "path";
import { Server as SocketServer } from "socket.io";
import mongoose from "mongoose";
const PORT = process.env.PORT

//Loading the environment variable
dotenv.config();

//importing the routes
import authRoutes from 
import ticketRoutes from "./routes/ticketRoutes";
import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";
import connectDB from "./config/db";

//initialising the express
const app: Application = express();

//middlewares
app.use(cors());
app.use(express.json());

//api routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

//root endpoint
app.get("/", (req: Request, res: Response) => {
    res.send("Chat system application as started running  ");
});

//creating the http server
const server = http.createServer(app);

//initialising the socket server
const io = new SocketServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
});

//socket server connection
io.on('connection',(socket) =>{
    console.log(`User connected ${socket.id}`);

    socket.on('joinRoom', (ticketId: string) =>{
        socket.join(ticketId);
        console.log(`User with id: ${socket.id} joined room: ${ticketId}`);
    });

    socket.on('sendMessage', ({ticketId, message}) =>{
        console.log('Message received', message);
        io.to(ticketId).emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected ${socket.id}`);
    });
});



// starting the server when database is connected
connectDB().then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((error) => console.log(error));
