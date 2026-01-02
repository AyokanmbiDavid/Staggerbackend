import express from "express";
import { signup, login, logout, getMe } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const authRoutes = express.Router();

// Public routes
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

// Private route (Checks if user is authenticated)
authRoutes.get("/me", protectRoute, getMe);
router.get("/users", protectRoute, getUsers);

export default authRoutes;