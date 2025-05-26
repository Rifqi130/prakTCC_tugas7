import express from "express";
import AuthRoute from "./AuthRoute.js";
import NoteRoute from "./NoteRoute.js";
import { refreshToken } from "../controllers/RefreshTokenController.js";

const router = express.Router();

// API Routes
router.use('/auth', AuthRoute);
router.use('/notes', NoteRoute);

// Token refresh endpoint
router.get('/token', refreshToken);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default router;