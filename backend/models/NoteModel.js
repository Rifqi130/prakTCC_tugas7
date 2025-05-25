import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Note = db.define('notes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    timestamps: true,
    indexes: [
        {
            fields: ['userId'] // Index untuk mempercepat query berdasarkan userId
        }
    ]
});

// Hubungan antar tabel (User 1:N Note)
Note.associate = (models) => {
    Note.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
    });
};

// Sinkronkan model dengan database
(async () => {
    try {
        await Note.sync({ alter: true });
        console.log("Tabel Note berhasil disinkronkan");
    } catch (error) {
        console.error("Gagal mensinkronkan tabel Note:", error);
    }
})();

export default Note;