import express from "express";
import { 
  getNotes, 
  getNoteById,
  createNote, 
  updateNote, 
  deleteNote 
} from '../controllers/NoteController.js';
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

// Note routes with authentication
router.get('/', verifyToken, getNotes);
router.get('/:id', verifyToken, getNoteById);
router.post('/', verifyToken, createNote);
router.put('/:id', verifyToken, updateNote);
router.delete('/:id', verifyToken, deleteNote);

// Alternative routes for frontend compatibility
router.post('/add-notes', verifyToken, createNote);
router.put('/update-notes/:id', verifyToken, updateNote);
router.delete('/delete-notes/:id', verifyToken, deleteNote);

export default router;