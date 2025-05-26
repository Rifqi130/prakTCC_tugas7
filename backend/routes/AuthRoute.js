import express from "express";
import { login, register, logout } from "../controllers/AuthController.js";

const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.delete('/logout', logout);

export default router;