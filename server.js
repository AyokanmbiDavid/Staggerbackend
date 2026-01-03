import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();
const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.io

// 1. Setup Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: ["https://stagger-beta.vercel.app","http://localhost:5174"] // Your Vite frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

// 2. Online Users Tracking
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Tell everyone who is online
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // 3. Handle Real-time Messaging
  socket.on("send_message", (newMessage) => {
    const receiverSocketId = userSocketMap[newMessage.receiverId];
    if (receiverSocketId) {
      // Send only to the specific receiver
      io.to(receiverSocketId).emit("receive_message", newMessage);
    }
  });

  // 4. Handle Disconnect
  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

// 5. Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});