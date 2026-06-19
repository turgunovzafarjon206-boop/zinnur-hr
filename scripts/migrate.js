/* Sxemani yaratadi va (bo'sh bo'lsa) demo ma'lumotlarni yuklaydi.
   Foydalanish:  npm run migrate         (sxema + bo'sh bo'lsa seed)
                 npm run migrate:reset    (hammasini tozalab qayta seed) */
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { pool } = require("../src/db");
const { buildSeed, TABLES } = require("../src/seed");

async function main() {
  const reset = process.argv.includes("--reset");
  const schema = fs.readFileSync(path.join(__dirname, "..", "schema.sql"), "utf8");
  const client = await pool.connect();
  try {
    console.log("→ Sxema yaratilmoqda…");
    await client.query(schema);

    if (reset) {
      console.log("→ Reset: jadvallar tozalanmoqda…");
      const list = Object.values(TABLES).join(", ");
      await client.query(`TRUNCATE ${list}`);
    }

    const { rows } = await client.query("SELECT count(*)::int AS n FROM users");
    if (rows[0].n > 0 && !reset) {
      console.log(`✓ Bazada allaqachon ma'lumot bor (${rows[0].n} foydalanuvchi). Seed o'tkazib yuborildi.`);
    } else {
      console.log("→ Demo ma'lumotlar yuklanmoqda…");
      const seed = buildSeed();
      await client.query("BEGIN");
      for (const [stateKey, table] of Object.entries(TABLES)) {
        const arr = seed[stateKey] || [];
        for (const row of arr) {
          await client.query(
            `INSERT INTO ${table}(id, doc) VALUES($1,$2)
             ON CONFLICT (id) DO UPDATE SET doc=EXCLUDED.doc, updated_at=now()`,
            [String(row.id), row]
          );
        }
        console.log(`   • ${table}: ${arr.length} ta`);
      }
      await client.query("COMMIT");
      console.log("✓ Seed tugadi.");
    }
    console.log("\n✅ Migratsiya muvaffaqiyatli. Endi: npm start");
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("❌ Migratsiya xatosi:", e.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}
main();
