const { Pool } = require("pg");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  console.error("\n[XATO] DATABASE_URL topilmadi. .env faylga Neon connection string qo'shing.\n");
}
// Neon TCP ulanish uchun SSL talab qilinadi (connection string'da sslmode=require bo'lsa ham)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || "") ? false : { rejectUnauthorized: false },
  max: 5,
});
module.exports = { pool };
