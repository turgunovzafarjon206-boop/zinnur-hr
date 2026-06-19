/* Talant HR — demo ma'lumotlar generatori (server tomonida) */
const pad = (n) => String(n).padStart(2, "0");
const nowD = () => new Date();
let _n = 1000;
const uid = () => `${++_n}_${Math.random().toString(36).slice(2, 6)}`;

const DEFAULT_BRANCHES = [
  { id: "b1", name: "Bosh ofis", city: "Toshkent", head: "Aziz Karimov", status: "Faol" },
  { id: "b2", name: "Chilonzor filial", city: "Toshkent", head: "Dilnoza Karimova", status: "Faol" },
  { id: "b3", name: "Yunusobod filial", city: "Toshkent", head: "Bekzod Soliyev", status: "Faol" },
  { id: "b4", name: "Samarqand filial", city: "Samarqand", head: "Otabek Ergashev", status: "Faol" },
];
const RECRUITERS = ["Madina Rashidova", "Kamola Saidova", "Otabek Ergashev"];
const POS_NAMES = ["Senior Dasturchi", "Junior Dasturchi", "Sotuv menejeri", "Marketolog", "Buxgalter", "Operator"];
const DEPTS = [
  { id: "d1", name: "Muhandislik", head: "Sardor Aliyev", desc: "Mahsulot ishlab chiqish", created: "2021-03-01", status: "Faol" },
  { id: "d2", name: "Sotuv", head: "Dilnoza Karimova", desc: "Mijozlar bilan ishlash", created: "2021-03-01", status: "Faol" },
  { id: "d3", name: "Marketing", head: "Jasur Tursunov", desc: "Brending va reklama", created: "2021-06-12", status: "Faol" },
  { id: "d4", name: "Moliya", head: "Gulnora Yusupova", desc: "Buxgalteriya", created: "2022-01-10", status: "Faol" },
  { id: "d5", name: "HR", head: "Madina Rashidova", desc: "Inson resurslari", created: "2021-03-01", status: "Faol" },
  { id: "d6", name: "Operatsiyalar", head: "Bekzod Soliyev", desc: "Logistika", created: "2022-09-05", status: "Faol" },
];
const POSITIONS = [
  { id: "p1", name: "Senior Dasturchi", dept: "Muhandislik", level: "Senior", min: 18000000, max: 30000000, desc: "Backend/Frontend", status: "Faol" },
  { id: "p2", name: "Junior Dasturchi", dept: "Muhandislik", level: "Junior", min: 7000000, max: 12000000, desc: "Kichik vazifalar", status: "Faol" },
  { id: "p3", name: "Sotuv menejeri", dept: "Sotuv", level: "Middle", min: 9000000, max: 16000000, desc: "Mijoz topish", status: "Faol" },
  { id: "p4", name: "Marketolog", dept: "Marketing", level: "Middle", min: 8000000, max: 14000000, desc: "Kampaniyalar", status: "Faol" },
  { id: "p5", name: "Buxgalter", dept: "Moliya", level: "Senior", min: 10000000, max: 17000000, desc: "Hisob-kitob", status: "Faol" },
  { id: "p6", name: "Operator", dept: "Operatsiyalar", level: "Junior", min: 6000000, max: 9000000, desc: "Jarayon", status: "Faol" },
];
const FN = ["Sardor", "Dilnoza", "Jasur", "Gulnora", "Madina", "Bekzod", "Aziz", "Nilufar", "Otabek", "Kamola", "Rustam", "Sevara", "Shahzod", "Malika"];
const LN = ["Aliyev", "Karimova", "Tursunov", "Yusupova", "Rashidova", "Soliyev", "Rahimov", "Tosheva", "Ergashev", "Saidova", "Nazarov", "Ismoilova", "Qodirov", "Yo'ldosheva"];
const EST = ["Faol", "Faol", "Faol", "Faol", "Sinov muddatida", "Ta'tilda", "Faol", "Ishdan bo'shagan"];

const ALL_KEYS = ["dashboard", "employees", "departments", "positions", "branches", "recruiting", "recentries", "vacancies", "candidates", "adaptation", "leaves", "payroll", "tasks", "performance", "documents", "hrfinance", "reports", "notifications", "users", "settings", "profile"];
const levelToCan = (l) => l === "full" ? { add: true, edit: true, delete: true } : l === "edit" ? { add: true, edit: true, delete: false } : { add: false, edit: false, delete: false };

function seedEmployees() {
  const arr = [];
  for (let i = 0; i < 14; i++) {
    const dp = DEPTS[i % DEPTS.length];
    const pos = POSITIONS.find(p => p.dept === dp.name) || POSITIONS[0];
    arr.push({ id: "e" + (i + 1), firstName: FN[i], lastName: LN[i], middleName: LN[(i + 3) % LN.length] + " o'g'li", gender: i % 3 === 0 ? "Ayol" : "Erkak", birthDate: `199${i % 9}-0${(i % 9) + 1}-1${i % 9}`, phone: `+998 9${i % 9} ${100 + i} ${10 + i} ${20 + i}`, email: `${FN[i].toLowerCase()}.${LN[i].toLowerCase().replace(/'/g, "")}@company.uz`, address: "Toshkent sh., Yunusobod t.", pinfl: `3${10000000000000 + i * 7654321}`, maritalStatus: i % 2 ? "Uylangan" : "Bo'ydoq", dept: dp.name, position: pos.name, hireDate: `202${i % 4}-0${(i % 9) + 1}-15`, contractType: i % 3 === 0 ? "Vaqtinchalik" : "Doimiy", status: EST[i % EST.length], salary: pos.min + (i % 5) * 1000000, bankAccount: `8600 **** **** ${1000 + i}`, notes: "" });
  }
  return arr;
}
function seedLeaves(e) {
  return [
    { id: "l1", employee: `${e[1].firstName} ${e[1].lastName}`, type: "Yillik ta'til", from: "2026-07-01", to: "2026-07-10", days: 10, reason: "Dam olish", status: "Kutilmoqda" },
    { id: "l2", employee: `${e[3].firstName} ${e[3].lastName}`, type: "Kasallik ta'tili", from: "2026-06-12", to: "2026-06-15", days: 4, reason: "Shamollash", status: "HR tasdiqladi" },
    { id: "l3", employee: `${e[5].firstName} ${e[5].lastName}`, type: "To'lanmaydigan ta'til", from: "2026-06-20", to: "2026-06-22", days: 3, reason: "Shaxsiy", status: "Manager tasdiqladi" },
  ];
}
function seedCandidates() {
  const out = []; let i = 0;
  const data = [
    ["Olim Hakimov", "Senior Dasturchi", "Bosh ofis", "Madina Rashidova", "HR suhbat", 25000000, "5 yil"],
    ["Zarina Mirzaeva", "Marketolog", "Chilonzor filial", "Kamola Saidova", "Yangi", 13000000, "3 yil"],
    ["Davron Eshonov", "Sotuv menejeri", "Yunusobod filial", "Otabek Ergashev", "Telefon suhbat", 14000000, "4 yil"],
    ["Nodira Saidova", "Buxgalter", "Bosh ofis", "Madina Rashidova", "Suhbatdan o'tdi", 15000000, "6 yil"],
    ["Sherzod Komilov", "Junior Dasturchi", "Samarqand filial", "Kamola Saidova", "Taklif yuborildi", 9000000, "1 yil"],
    ["Maftuna Aliyeva", "Senior Dasturchi", "Bosh ofis", "Otabek Ergashev", "Ishga qabul qilindi", 28000000, "7 yil"],
  ];
  data.forEach(d => out.push({ id: "c" + (++i), name: d[0], vacancy: d[1], branch: d[2], recruiter: d[3], status: d[4], expectedSalary: d[5], experience: d[6], phone: `+998 9${i} ${100 + i} ${10 + i} ${20 + i}`, email: `${d[0].split(" ")[0].toLowerCase()}@mail.uz`, interviewDate: "", notes: "" }));
  return out;
}
function seedVacancies() {
  const v = [
    ["Senior Dasturchi", "Bosh ofis", 4, 2, "Madina Rashidova"], ["Junior Dasturchi", "Bosh ofis", 6, 5, "Kamola Saidova"],
    ["Sotuv menejeri", "Chilonzor filial", 5, 1, "Otabek Ergashev"], ["Sotuv menejeri", "Samarqand filial", 3, 0, "Otabek Ergashev"],
    ["Marketolog", "Chilonzor filial", 2, 2, "Kamola Saidova"], ["Buxgalter", "Bosh ofis", 2, 1, "Madina Rashidova"],
    ["Operator", "Yunusobod filial", 8, 3, "Kamola Saidova"],
  ];
  return v.map((r, i) => ({ id: "v" + i, title: r[0], branch: r[1], needed: r[2], hired: r[3], recruiter: r[4], openDate: `2026-06-0${(i % 7) + 1}`, status: r[3] >= r[2] ? "Yopildi" : "Faol" }));
}
function seedRecruitEntries() {
  const d = nowD(), Y = d.getFullYear(), M = d.getMonth(), D = d.getDate();
  const ds = (day) => `${Y}-${pad(M + 1)}-${pad(Math.max(1, Math.min(D, day)))}`;
  const out = []; let id = 0;
  const days = [D, D - 1, D - 2, D - 4, D - 6, D - 9, D - 13].filter(x => x >= 1);
  const base = { "Madina Rashidova": [6, 4, 3, 2, 1], "Kamola Saidova": [5, 3, 2, 1, 1], "Otabek Ergashev": [4, 2, 2, 1, 0] };
  days.forEach((day, di) => {
    RECRUITERS.forEach((rec) => {
      const b = base[rec], jit = (di % 3);
      out.push({ id: "re" + (++id), date: ds(day), recruiter: rec, branch: DEFAULT_BRANCHES[(di + id) % 4].name, position: POS_NAMES[(di + id) % 6], phone: Math.max(0, b[0] - (di % 2)), phonePassed: Math.max(0, b[1] - (di % 2)), hr: Math.max(0, b[2] - jit), hrPassed: Math.max(0, b[3] - (jit > 1 ? 1 : 0)), hired: b[4], _deleted: false });
    });
  });
  return out;
}
function seedAdaptation(e) {
  const mk = (t) => ({ id: uid(), title: t, done: Math.random() < 0.5 });
  return [
    { id: "ad1", employee: `${e[6].firstName} ${e[6].lastName}`, position: "Senior Dasturchi", branch: "Bosh ofis", mentor: "Sardor Aliyev", startDate: "2026-06-02", status: "Jarayonda", tasks: [{ id: uid(), title: "Hujjatlarni rasmiylashtirish", done: true }, { id: uid(), title: "Ish stansiyasi sozlash", done: true }, { id: uid(), title: "Jamoaga tanishtirish", done: false }, { id: uid(), title: "Birinchi loyiha topshirig'i", done: false }] },
    { id: "ad2", employee: "Maftuna Aliyeva", position: "Senior Dasturchi", branch: "Bosh ofis", mentor: "Sardor Aliyev", startDate: "2026-06-09", status: "Jarayonda", tasks: [{ id: uid(), title: "Hujjatlar", done: true }, mk("Onboarding treningi"), mk("Mentorlik uchrashuvi")] },
    { id: "ad3", employee: "Sherzod Komilov", position: "Junior Dasturchi", branch: "Samarqand filial", mentor: "Otabek Ergashev", startDate: "2026-06-12", status: "Jarayonda", tasks: [mk("Hisob ochish"), mk("Kirish trening"), mk("Birinchi vazifa")] },
  ];
}
function seedFinance() {
  const d = nowD(), Y = d.getFullYear(), M = d.getMonth();
  const ms = (off) => new Date(Y, M - off, 5).toISOString().slice(0, 10);
  const rows = [];
  for (let off = 3; off >= 0; off--) {
    rows.push({ id: uid(), date: ms(off), direction: "Kirim", category: "HR byudjeti", amount: 25000000, note: "Oylik byudjet ajratmasi" });
    rows.push({ id: uid(), date: ms(off), direction: "Chiqim", category: "Ish e'lonlari", amount: 3000000 + off * 400000, note: "hh.uz / olx e'lonlari" });
    rows.push({ id: uid(), date: ms(off), direction: "Chiqim", category: "Rekruter bonusi", amount: 2000000 + off * 300000, note: "Yopilgan vakansiyalar" });
    rows.push({ id: uid(), date: ms(off), direction: "Chiqim", category: "Onboarding", amount: 1500000, note: "Yangi xodimlar" });
    if (off % 2 === 0) rows.push({ id: uid(), date: ms(off), direction: "Chiqim", category: "Trening", amount: 4000000, note: "Jamoa treningi" });
  }
  return rows;
}
function seedPayroll(e) {
  return e.slice(0, 12).map((x, i) => { const base = x.salary, bonus = i % 3 === 0 ? 1500000 : 0, penalty = i % 5 === 0 ? 300000 : 0, tax = Math.round(base * 0.12); return { id: "pr" + i, employee: `${x.firstName} ${x.lastName}`, base, bonus, penalty, tax, net: base + bonus - penalty - tax, payDate: "2026-05-31", status: ["To'landi", "To'landi", "Tasdiqlandi", "Hisoblandi"][i % 4] }; });
}
function seedTasks(e) {
  return [
    { id: "t1", title: "Q3 hisobotini tayyorlash", assignee: `${e[3].firstName} ${e[3].lastName}`, dept: "Moliya", deadline: "2026-06-25", priority: "Yuqori", status: "Jarayonda" },
    { id: "t2", title: "Yangi landing sahifa", assignee: `${e[2].firstName} ${e[2].lastName}`, dept: "Marketing", deadline: "2026-06-20", priority: "O'rta", status: "Tekshiruvda" },
    { id: "t3", title: "API refaktoring", assignee: `${e[0].firstName} ${e[0].lastName}`, dept: "Muhandislik", deadline: "2026-07-01", priority: "Yuqori", status: "Yangi" },
  ];
}
function seedDocs(e) {
  return [
    { id: "doc1", employee: `${e[0].firstName} ${e[0].lastName}`, type: "Shartnoma", name: "Mehnat shartnomasi.pdf", uploaded: "2024-01-15", expires: "2026-12-31", status: "Faol" },
    { id: "doc2", employee: `${e[1].firstName} ${e[1].lastName}`, type: "Pasport / ID", name: "ID karta.pdf", uploaded: "2023-05-10", expires: "2026-07-01", status: "Tasdiqlanishi kerak" },
    { id: "doc3", employee: `${e[3].firstName} ${e[3].lastName}`, type: "Sertifikat", name: "ACCA sertifikat.pdf", uploaded: "2024-03-20", expires: "2026-06-25", status: "Muddati tugagan" },
  ];
}
function seedUsers() {
  const hrMods = ["dashboard", "employees", "departments", "positions", "branches", "recruiting", "recentries", "vacancies", "candidates", "adaptation", "leaves", "payroll", "tasks", "documents", "hrfinance", "reports", "notifications", "profile"];
  const mgrMods = ["dashboard", "employees", "branches", "recruiting", "recentries", "vacancies", "candidates", "adaptation", "leaves", "tasks", "performance", "reports", "notifications", "profile"];
  const empMods = ["dashboard", "leaves", "payroll", "tasks", "documents", "notifications", "profile"];
  return [
    { id: "u1", username: "admin", password: "admin123", name: "Aziz Karimov", title: "Tizim administratori", email: "admin@talant.uz", role: "Super Admin", dept: "—", status: "Faol", access: { level: "full", modules: ALL_KEYS, can: levelToCan("full") } },
    { id: "u2", username: "hr", password: "hr123", name: "Madina Rashidova", title: "HR menejer", email: "hr@talant.uz", role: "HR Manager", dept: "HR", status: "Faol", access: { level: "full", modules: hrMods, can: levelToCan("full") } },
    { id: "u3", username: "manager", password: "manager123", name: "Sardor Aliyev", title: "Muhandislik rahbari", email: "manager@talant.uz", role: "Department Manager", dept: "Muhandislik", status: "Faol", access: { level: "edit", modules: mgrMods, can: levelToCan("edit") } },
    { id: "u4", username: "employee", password: "employee123", name: "Jasur Tursunov", title: "Marketolog", email: "employee@talant.uz", role: "Employee", dept: "Marketing", status: "Faol", access: { level: "view", modules: empMods, can: levelToCan("view") } },
  ];
}
function buildSeed() {
  const employees = seedEmployees();
  return {
    users: seedUsers(), branches: DEFAULT_BRANCHES.map(b => ({ ...b })), employees, leaves: seedLeaves(employees), candidates: seedCandidates(),
    vacancies: seedVacancies(), recruitEntries: seedRecruitEntries(), adaptation: seedAdaptation(employees), finance: seedFinance(),
    payrolls: seedPayroll(employees), tasks: seedTasks(employees), documents: seedDocs(employees), departments: DEPTS.map(d => ({ ...d })), positions: POSITIONS.map(p => ({ ...p })),
    performance: employees.slice(0, 10).map((e, i) => ({ id: "pf" + i, employee: e.firstName + " " + e.lastName, dept: e.dept, period: "2026 Q2", kpi: 60 + (i * 7) % 40, rating: ["A", "B", "B", "C", "A"][i % 5], reviewer: "Sardor Aliyev", status: ["Bajarildi", "Jarayonda", "Tekshiruvda"][i % 3] })),
    recruiters: [
      { id: "r1", name: "Madina Rashidova", status: "Faol" },
      { id: "r2", name: "Kamola Saidova", status: "Faol" },
      { id: "r3", name: "Otabek Ergashev", status: "Faol" },
    ],
    notifications: [
      { id: "n1", type: "candidates", title: "Yangi nomzod", body: "Zarina M. — Marketolog", time: "10 daqiqa oldin", read: false },
      { id: "n2", type: "payroll", title: "Oylik tayyor", body: "May oyligi hisoblandi", time: "1 soat oldin", read: false },
      { id: "n3", type: "documents", title: "Hujjat muddati", body: "Nodira S. sertifikati tugayapti", time: "3 soat oldin", read: false },
    ],
    auditLogs: [],
  };
}

/* state kaliti -> jadval nomi */
const TABLES = {
  users: "users", branches: "branches", employees: "employees", departments: "departments", positions: "positions",
  vacancies: "vacancies", candidates: "candidates", recruitEntries: "recruit_entries", adaptation: "adaptation",
  finance: "finance", payrolls: "payrolls", tasks: "tasks", performance: "performance", documents: "documents",
  leaves: "leaves", recruiters: "recruiters", notifications: "notifications", auditLogs: "audit_logs",
};

module.exports = { buildSeed, TABLES };
