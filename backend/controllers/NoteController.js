import { where } from "sequelize";
import Note from "../models/NoteModel.js";

export const getNotes = async (req, res) => {
  try {
    const userId = req.userId;
    const notes = await Note.findAll({
      where: { userId },
      attributes: ['id', 'title', 'content', 'createdAt', 'updatedAt']
    });
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error getting notes:', error);
    res.status(500).json({ error: "Gagal mengambil catatan" });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const userId = req.userId;
    const note = await Note.findOne({
      where: {
        id: req.params.id,
        userId
      },
      attributes: ['id', 'title', 'content', 'createdAt', 'updatedAt']
    });

    if (!note) {
      return res.status(404).json({ error: "Catatan tidak ditemukan" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error('Error getting note by ID:', error);
    res.status(500).json({ error: "Gagal mengambil catatan" });
  }
};

export const createNote = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Judul dan konten harus diisi" });
    }

    const note = await Note.create({
      title,
      content,
      userId
    });

    res.status(201).json({
      message: "Catatan berhasil dibuat",
      note: {
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: "Gagal membuat catatan" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Judul dan konten harus diisi" });
    }

    const [updated] = await Note.update(
      { title, content },
      {
        where: {
          id: req.params.id,
          userId
        }
      }
    );

    if (updated === 0) {
      return res.status(404).json({ error: "Catatan tidak ditemukan" });
    }

    const updatedNote = await Note.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'title', 'content', 'updatedAt']
    });

    res.status(200).json({
      message: "Catatan berhasil diperbarui",
      note: updatedNote
    });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: "Gagal memperbarui catatan" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const userId = req.userId;
    const deleted = await Note.destroy({
      where: {
        id: req.params.id,
        userId
      }
    });

    if (deleted === 0) {
      return res.status(404).json({ error: "Catatan tidak ditemukan" });
    }

    res.status(200).json({ message: "Catatan berhasil dihapus" });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: "Gagal menghapus catatan" });
  }
};