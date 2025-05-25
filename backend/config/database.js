import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, // Nonaktifkan log SQL di console
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Tes koneksi
(async () => {
  try {
    await db.authenticate();
    console.log("✅ Koneksi ke database BERHASIL");
    console.log(`📁 Database: ${process.env.DB_NAME}`);
    console.log(`🖥️  Host: ${process.env.DB_HOST}`);
  } catch (error) {
    console.error("❌ Gagal terkoneksi ke database:", error.message);
    console.log("💡 Tips:");
    console.log("1. Pastikan MySQL server lokal aktif (XAMPP/WAMP/Laragon)");
    console.log("2. Buat database 'catetan' di phpMyAdmin");
    console.log("3. Pastikan user 'root' punya akses tanpa password");
  }
})();

export default db;