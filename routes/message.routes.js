import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { sendMessage, getMessages, deleteMessage, editMessage, clearChat } from "../controllers/message.controller.js";

const messageRoutes = express.Router();

messageRoutes.get("/:id", protectRoute, getMessages); // Get chat history with a specific user
messageRoutes.post("/send", protectRoute, sendMessage); // Send a message
messageRoutes.delete("/delete/:id", protectRoute, deleteMessage); // Delete a message
// Add these to routes/message.routes.js
messageRoutes.put("/edit/:id", protectRoute, editMessage); // Edit a specific message
messageRoutes.delete("/clear/:id", protectRoute, clearChat); // Clear all messages with a user

export default messageRoutes;