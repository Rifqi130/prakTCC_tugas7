import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ error: "Email dan password harus diisi" });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email sudah terdaftar" });
    }

    // Buat user baru
    const user = await User.create({ email, password });
    
    res.status(201).json({ 
      message: "Registrasi berhasil",
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error registrasi:', error);
    res.status(500).json({ 
      error: "Terjadi kesalahan saat registrasi",
      detail: error.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await user.comparePassword(password); // gunakan method dari model
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

    const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  await User.update({ refresh_token: null }, { where: { refresh_token: refreshToken } });
  res.clearCookie("refreshToken");
  res.sendStatus(200);
};
