import db from '../config/database.js';
import UserModel from './UserModel.js';
import NoteModel from './NoteModel.js';

const User = UserModel(db);
const Note = NoteModel(db);

// Setup associations
User.hasMany(Note, { foreignKey: 'userId' });
Note.belongsTo(User, { foreignKey: 'userId' });

export { User, Note };