import express from "express";
import AuthRoute from "./AuthRoute.js";
import NoteRoute from "./NoteRoute.js";
import { refreshToken } from "../controllers/RefreshTokenController.js";

const router = express.Router();
router.use('/auth', AuthRoute);
router.use('/notes', NoteRoute);
router.get('/token', refreshToken); // Endpoint refresh token

export default router;