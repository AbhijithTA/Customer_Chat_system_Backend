import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import http from "http";
import path from "path";
import { Server as SocketServer } from "socket.io";
const PORT = process.env.PORT;
import cookieparser from "cookie-parser";

//Loading the environment variable
dotenv.config();

//importing the routes
import authRoutes from "./routes/auth.routes";
import ticketRoutes from "./routes/ticket.routes";
// import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/message.route";
import connectDB from "./config/db";
import registerSocketHandlers from "./sockets";

//initialising the express
const app: Application = express();

//middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieparser());

//api routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
// app.use("/api/users", userRoutes);
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

registerSocketHandlers(io);




// starting the server when database is connected
connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
