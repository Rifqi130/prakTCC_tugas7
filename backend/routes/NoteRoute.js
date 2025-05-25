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

// GET /notes - Get all notes for logged in user
router.get('/', verifyToken, getNotes);

// GET /notes/:id - Get single note by ID (only owner)
router.get('/:id', verifyToken, getNoteById);

// POST /notes - Create new note
router.post('/', verifyToken, createNote);

// PUT /notes/:id - Update existing note (only owner)
router.put('/:id', verifyToken, updateNote);

// DELETE /notes/:id - Delete note (only owner)
router.delete('/:id', verifyToken, deleteNote);

// Alternatif jika ingin sesuai dengan frontend yang ada:
router.post('/add-notes', verifyToken, createNote);
router.put('/update-notes/:id', verifyToken, updateNote);
router.delete('/delete-notes/:id', verifyToken, deleteNote);

export default router;