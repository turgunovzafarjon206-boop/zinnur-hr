# Talant HR — Neon (PostgreSQL) bazasiga ulangan HR tizimi

Xodimlar, recruiting (qo'lda kiritiladigan suhbatlar), filiallar, ta'til, oylik,
hujjatlar, performance va HR moliyasini boshqaruvchi full-stack ilova.

- **Frontend:** bitta sahifali React ilova (`public/index.html`, React ichiga joylangan).
- **Backend:** Node.js + Express API (login, holatni o'qish/saqlash).
- **Baza:** Neon (PostgreSQL). Har bir jadval `id + doc(JSONB)` ko'rinishida +
  hisobot uchun tayyor `v_*` VIEW'lar.

---

## 1. Talablar
- Node.js 18+ (`node -v` bilan tekshiring)
- Bepul Neon hisobi → https://neon.tech

## 2. O'rnatish (5 qadam)

**1) Neon'da baza oching.** neon.tech → yangi Project → *Connection string* ni nusxa oling.
Misol:
```
postgresql://user:parol@ep-xxxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**2) `.env` faylini tayyorlang:**
```bash
cp .env.example .env
```
`.env` ichidagi `DATABASE_URL=` ga Neon string'ini qo'ying.

**3) Paketlarni o'rnating:**
```bash
npm install
```

**4) Bazani yarating va demo ma'lumotlarni yuklang:**
```bash
npm run migrate
```

**5) Serverni ishga tushiring:**
```bash
npm start
```
Brauzerda oching → http://localhost:3000

## 3. Demo loginlar
| Login | Parol | Rol |
|-------|-------|-----|
| `admin` | `admin123` | Super Admin (to'liq) |
| `hr` | `hr123` | HR Manager |
| `manager` | `manager123` | Bo'lim rahbari |
| `employee` | `employee123` | Xodim |

> Birinchi kirgandan keyin **Foydalanuvchilar** bo'limidan parollarni o'zgartiring.

## 4. Buyruqlar
| Buyruq | Vazifa |
|--------|--------|
| `npm run migrate` | Sxema + (bo'sh bo'lsa) demo seed |
| `npm run migrate:reset` | Hammasini tozalab qayta seed |
| `npm start` | Serverni ishga tushirish |

## 5. Ma'lumotlar bazasi
Jadvallar: `users, branches, employees, departments, positions, vacancies,
candidates, recruit_entries, adaptation, finance, payrolls, tasks, performance,
documents, leaves, notifications, audit_logs`.

Hisobot uchun tayyor VIEW'lar (SQL'da to'g'ridan-to'g'ri ishlatsa bo'ladi):
```sql
-- Har bir sana bo'yicha suhbatlar (rekruterlar jami)
SELECT date, sum(phone) AS telefon, sum(hired) AS qabul
FROM v_recruit_entries GROUP BY date ORDER BY date DESC;

-- Rekruterlar kesimida
SELECT recruiter, sum(phone) telefon, sum(hired) qabul
FROM v_recruit_entries GROUP BY recruiter;

-- Boshqa VIEW'lar: v_employees, v_vacancies, v_finance, v_branches
```

## 6. Arxitektura va saqlash
- Login serverda tekshiriladi; brauzerga 24 soatlik imzolangan token beriladi.
- Ilova ochilganda butun holat `GET /api/state` orqali yuklanadi.
- Har bir o'zgarish ~0.7s ichida `POST /api/sync` orqali bazaga yoziladi (upsert).
- O'chirish — "soft delete" (`_deleted=true`), shuning uchun tarix yo'qolmaydi.

## 7. Netlify'ga deploy (netlify.app)

Netlify oddiy Node serverni emas, **statik sayt + serverless funksiyalar**ni ishlatadi.
Loyiha shunga moslangan: frontend `public/` dan beriladi, backend esa
`netlify/functions/api.js` (Netlify Function) sifatida ishlaydi va Neon'ga ulanadi.
`netlify.toml` allaqachon sozlangan.

### A usul — GitHub orqali (tavsiya etiladi)
1. Loyihani GitHub'ga yuklang (yangi repozitoriy yarating va push qiling).
2. https://app.netlify.com → **Add new site → Import an existing project** → GitHub'ni tanlang → repozitoriyni tanlang.
3. Build sozlamalari `netlify.toml` dan avtomatik o'qiladi (Publish: `public`, Functions: `netlify/functions`). O'zgartirmang.
4. **Environment variables** qo'shing (Site settings → Environment variables):
   - `DATABASE_URL` = Neon **pooled** connection string (masalan `...-pooler...neon.tech/neondb?sslmode=require`)
   - `AUTH_SECRET` = uzun tasodifiy matn (masalan `openssl rand -hex 32` natijasi)
5. **Deploy site** bosing. Birinchi deploy paytida `npm run migrate` ishlab, Neon'da jadvallar va demo ma'lumotlar yaratiladi.
6. Sayt manzili: `https://SIZNING-NOMINGIZ.netlify.app` — oching va `admin / admin123` bilan kiring.

### B usul — Netlify CLI orqali (GitHub'siz)
```bash
npm install -g netlify-cli
netlify login
netlify init           # yangi sayt yaratadi
netlify env:set DATABASE_URL "postgresql://...-pooler...neon.tech/neondb?sslmode=require"
netlify env:set AUTH_SECRET "uzun-tasodifiy-matn"
netlify deploy --build --prod
```

> **Muhim:** oddiy "drag & drop" (faqat papkani tashlash) ishlamaydi — u funksiyalarning paketlarini o'rnatmaydi. Git yoki CLI ishlating.

> Agar birinchi deploy `DATABASE_URL` qo'yilmasdan oldin ishga tushib, migratsiya xato bersa: env'larni qo'ying va **Deploys → Trigger deploy → Clear cache and deploy** qiling.

### Neon connection string qayerdan?
Neon → Project → **Connection string** → **Pooled connection**ni tanlang (serverless uchun shu kerak), nusxa oling.

---

## 8. Xavfsizlik
- `DATABASE_URL` faqat `.env` faylda (serverda) turadi — hech qachon frontendga chiqmaydi.
- `.env` ni git'ga qo'shmang (`.gitignore`da bor).
