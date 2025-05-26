import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

const UserModel = (sequelize) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Email sudah terdaftar'
      },
      validate: {
        isEmail: {
          msg: 'Format email tidak valid'
        },
        notEmpty: {
          msg: 'Email tidak boleh kosong'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password tidak boleh kosong'
        },
        len: {
          args: [6, 100],
          msg: 'Password minimal 6 karakter'
        }
      }
    },
    refresh_token: {
      type: DataTypes.TEXT
    }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        try {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        } catch (error) {
          throw new Error('Gagal mengenkripsi password');
        }
      }
    }
  });

  User.prototype.comparePassword = async function(password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw new Error('Gagal memverifikasi password');
    }
  };

  return User;
};

export default UserModel;