import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from './routes/message.route.js' // New

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes); // New

// Socket.io (Updated for sending messages)
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" }
});

io.on("connection", (socket) => {
  socket.on("join_chat", (userId) => socket.join(userId));
  
  socket.on("send_new_message", (data) => {
    // data should have receiverId, text, mediaUrl, etc.
    io.to(data.receiverId).emit("receive_message", data);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));