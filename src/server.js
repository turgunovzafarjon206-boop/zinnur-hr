const path = require("path");
const crypto = require("crypto");
const express = require("express");
require("dotenv").config();
const { pool } = require("./db");
const { buildSeed, TABLES } = require("./seed");

const app = express();
app.use(express.json({ limit: "8mb" }));
app.use(express.static(path.join(__dirname, "..", "public")));

const SECRET = process.env.AUTH_SECRET || "talant-hr-dev-secret";
const DAY = 24 * 60 * 60 * 1000;

/* ---- oddiy imzolangan token (HMAC) ---- */
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const sign = (payload) => { const body = b64(payload); const mac = crypto.createHmac("sha256", SECRET).update(body).digest("base64url"); return body + "." + mac; };
function verify(token) {
  if (!token || !token.includes(".")) return null;
  const [body, mac] = token.split(".");
  const exp = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  if (mac !== exp) return null;
  try { const p = JSON.parse(Buffer.from(body, "base64url").toString()); if (p.exp < Date.now()) return null; return p; } catch { return null; }
}
function auth(req, res, next) {
  const h = req.headers.authorization || "";
  const p = verify(h.replace(/^Bearer\s+/i, ""));
  if (!p) return res.status(401).json({ error: "Avtorizatsiya talab qilinadi" });
  req.auth = p; next();
}
const stripPw = (u) => { const c = { ...u }; if (c.access) c.access = u.access; delete c.password; return c; };

/* ---- health ---- */
app.get("/api/health", async (_req, res) => {
  try { await pool.query("SELECT 1"); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

/* ---- login ---- */
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Login va parol kiriting" });
  try {
    const { rows } = await pool.query("SELECT doc FROM users WHERE doc->>'username'=$1 LIMIT 1", [String(username).trim()]);
    const u = rows[0]?.doc;
    if (!u || u._deleted || u.password !== password || u.status !== "Faol") return res.status(401).json({ error: "Login yoki parol noto'g'ri" });
    const token = sign({ u: u.username, id: u.id, exp: Date.now() + DAY });
    res.json({ token, user: stripPw(u) });
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
});

/* ---- butun holatni o'qish ---- */
app.get("/api/state", auth, async (_req, res) => {
  try {
    const state = {};
    for (const [key, table] of Object.entries(TABLES)) {
      const { rows } = await pool.query(`SELECT doc FROM ${table} ORDER BY updated_at ASC`);
      state[key] = rows.map(r => r.doc);
    }
    res.json(state);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ---- holatni saqlash (upsert) ---- */
app.post("/api/sync", auth, async (req, res) => {
  const state = req.body?.state;
  if (!state || typeof state !== "object") return res.status(400).json({ error: "state kerak" });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const [key, table] of Object.entries(TABLES)) {
      const arr = Array.isArray(state[key]) ? state[key] : null;
      if (!arr) continue;
      for (const row of arr) {
        if (!row || row.id == null) continue;
        await client.query(
          `INSERT INTO ${table}(id, doc) VALUES($1,$2)
           ON CONFLICT (id) DO UPDATE SET doc=EXCLUDED.doc, updated_at=now()`,
          [String(row.id), row]
        );
      }
    }
    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (e) { await client.query("ROLLBACK").catch(() => {}); res.status(500).json({ error: e.message }); }
  finally { client.release(); }
});

/* ---- demo holatga tiklash (faqat Super Admin) ---- */
app.post("/api/reset", auth, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT doc FROM users WHERE id=$1", [req.auth.id]);
    if (rows[0]?.doc?.role !== "Super Admin") return res.status(403).json({ error: "Faqat Super Admin tiklay oladi" });
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`TRUNCATE ${Object.values(TABLES).join(", ")}`);
      const seed = buildSeed();
      for (const [key, table] of Object.entries(TABLES)) {
        for (const row of (seed[key] || []))
          await client.query(`INSERT INTO ${table}(id,doc) VALUES($1,$2)`, [String(row.id), row]);
      }
      await client.query("COMMIT");
      const state = {};
      for (const [key, table] of Object.entries(TABLES)) { const r = await client.query(`SELECT doc FROM ${table}`); state[key] = r.rows.map(x => x.doc); }
      res.json(state);
    } catch (e) { await client.query("ROLLBACK").catch(()=>{}); throw e; } finally { client.release(); }
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ---- SPA fallback ---- */
app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(__dirname, "..", "public", "index.html")));

function startServer() {
  const PORT = process.env.PORT || 3000;
  return app.listen(PORT, () => console.log(`✅ Talant HR ${PORT}-portda ishlamoqda → http://localhost:${PORT}`));
}
if (require.main === module) startServer();
module.exports = { app, startServer };
