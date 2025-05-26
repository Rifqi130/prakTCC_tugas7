import { DataTypes } from 'sequelize';

const NoteModel = (sequelize) => {
  const Note = sequelize.define('Note', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  return Note;
};

export default NoteModel;