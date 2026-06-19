-- Talant HR — Neon (PostgreSQL) sxemasi
-- Har bir jadval: id (matn) + doc (JSONB to'liq obyekt) + updated_at.
-- Bu frontend obyektlari bilan 1:1 mos keladi va maydon qo'shilsa sxema o'zgarmaydi.

CREATE TABLE IF NOT EXISTS users          (id text PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS branches       (id text PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS employees      (id text PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS departments    (id text PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS positions      (id text PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS vacancies      (id text PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS candidates     (id text PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS recruit_entries(id text PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS adaptation     (id text PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS finance        (id text PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS payrolls       (id text PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS tasks          (id text PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS performance    (id text PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS documents      (id text PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS leaves         (id text PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS notifications  (id text PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS recruiters      (id text PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS audit_logs     (id text PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz DEFAULT now());

-- Tez-tez ishlatiladigan JSONB maydonlar bo'yicha indekslar
CREATE INDEX IF NOT EXISTS idx_users_username  ON users      ((doc->>'username'));
CREATE INDEX IF NOT EXISTS idx_emp_dept         ON employees  ((doc->>'dept'));
CREATE INDEX IF NOT EXISTS idx_emp_status       ON employees  ((doc->>'status'));
CREATE INDEX IF NOT EXISTS idx_re_date          ON recruit_entries ((doc->>'date'));
CREATE INDEX IF NOT EXISTS idx_re_recruiter     ON recruit_entries ((doc->>'recruiter'));
CREATE INDEX IF NOT EXISTS idx_fin_date         ON finance    ((doc->>'date'));

-- Hisobot / BI uchun qulay tekis ko'rinishlar (VIEW)
CREATE OR REPLACE VIEW v_employees AS
SELECT id, doc->>'firstName' AS first_name, doc->>'lastName' AS last_name, doc->>'dept' AS dept,
       doc->>'position' AS position, doc->>'status' AS status, (doc->>'salary')::numeric AS salary,
       doc->>'hireDate' AS hire_date, doc->>'email' AS email, doc->>'phone' AS phone
FROM employees WHERE COALESCE((doc->>'_deleted')::boolean,false)=false;

CREATE OR REPLACE VIEW v_recruit_entries AS
SELECT id, (doc->>'date')::date AS date, doc->>'recruiter' AS recruiter, doc->>'branch' AS branch, doc->>'position' AS position,
       COALESCE((doc->>'phone')::int,0) AS phone, COALESCE((doc->>'phonePassed')::int,0) AS phone_passed,
       COALESCE((doc->>'hr')::int,0) AS hr, COALESCE((doc->>'hrPassed')::int,0) AS hr_passed, COALESCE((doc->>'hired')::int,0) AS hired
FROM recruit_entries WHERE COALESCE((doc->>'_deleted')::boolean,false)=false;

CREATE OR REPLACE VIEW v_vacancies AS
SELECT id, doc->>'title' AS title, doc->>'branch' AS branch, doc->>'recruiter' AS recruiter,
       COALESCE((doc->>'needed')::int,0) AS needed, COALESCE((doc->>'hired')::int,0) AS hired, doc->>'status' AS status
FROM vacancies WHERE COALESCE((doc->>'_deleted')::boolean,false)=false;

CREATE OR REPLACE VIEW v_finance AS
SELECT id, (doc->>'date')::date AS date, doc->>'direction' AS direction, doc->>'category' AS category, (doc->>'amount')::numeric AS amount
FROM finance WHERE COALESCE((doc->>'_deleted')::boolean,false)=false;

CREATE OR REPLACE VIEW v_branches AS
SELECT id, doc->>'name' AS name, doc->>'city' AS city, doc->>'head' AS head, doc->>'status' AS status
FROM branches WHERE COALESCE((doc->>'_deleted')::boolean,false)=false;
