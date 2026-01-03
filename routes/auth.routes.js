import express from "express";
import { 
  signup, 
  login, 
  logout, 
  getMe, 
  getUsers, 
  updateProfile, 
  deleteAccount 
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const authRoutes = express.Router();

// Public routes
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

// Private routes (Checks if user is authenticated)
authRoutes.get("/me", protectRoute, getMe);
authRoutes.get("/users", protectRoute, getUsers);

// NEW: Profile Management
authRoutes.put("/update", protectRoute, updateProfile); // Updates username, email, or password
authRoutes.delete("/delete", protectRoute, deleteAccount); // Deletes the user account

export default authRoutes;