// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// create/open DB file in ./db/employees.db
const dbPath = path.join(__dirname, 'db', 'employees.db');
const db = new Database(dbPath);

// initialize DB from init.sql if table missing
const initSqlPath = path.join(__dirname, 'db', 'init.sql');
const fs = require('fs');

function initDbIfNeeded() {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='employees'").get();
  if (!row) {
    console.log('Initializing database from init.sql ...');
    const sql = fs.readFileSync(initSqlPath, 'utf8');
    db.exec(sql);
    console.log('Database initialized.');
  } else {
    console.log('Table employees already exists.');
  }
}

initDbIfNeeded();

/* ---------- Helper statements ---------- */
const allStmt = db.prepare('SELECT * FROM employees ORDER BY id');
const getStmt = db.prepare('SELECT * FROM employees WHERE id = ?');
const insertStmt = db.prepare(`INSERT INTO employees
  (first_name,last_name,role,department,email,join_date,tenure_years,location)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

const updateStmt = db.prepare(`UPDATE employees SET
  first_name = ?, last_name = ?, role = ?, department = ?, email = ?, join_date = ?, tenure_years = ?, location = ?
  WHERE id = ?`);

const deleteStmt = db.prepare('DELETE FROM employees WHERE id = ?');

/* ---------- Routes ---------- */

// health
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// list all
app.get('/api/employees', (req, res) => {
  const rows = allStmt.all();
  res.json(rows);
});

// get one
app.get('/api/employees/:id', (req, res) => {
  const id = Number(req.params.id);
  const row = getStmt.get(id);
  if (!row) return res.status(404).json({ error: 'Employee not found' });
  res.json(row);
});

// create
app.post('/api/employees', (req, res) => {
  const { first_name, last_name, role, department, email, join_date, tenure_years, location } = req.body;
  try {
    const info = insertStmt.run(first_name, last_name, role, department, email, join_date, tenure_years, location);
    const created = getStmt.get(info.lastInsertRowid);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// update
app.put('/api/employees/:id', (req, res) => {
  const id = Number(req.params.id);
  const { first_name, last_name, role, department, email, join_date, tenure_years, location } = req.body;
  try {
    const info = updateStmt.run(first_name, last_name, role, department, email, join_date, tenure_years, location, id);
    if (info.changes === 0) return res.status(404).json({ error: 'Employee not found' });
    const updated = getStmt.get(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// delete
app.delete('/api/employees/:id', (req, res) => {
  const id = Number(req.params.id);
  const info = deleteStmt.run(id);
  if (info.changes === 0) return res.status(404).json({ error: 'Employee not found' });
  res.json({ success: true });
});

/* ---------- Start server ---------- */
app.listen(PORT, () => {
  console.log(`HRM backend running on http://localhost:${PORT}`);
});

// Mark Attendance
app.post("/api/attendance", (req, res) => {
  const { employee_id, date, status, note } = req.body;
  if (!employee_id || !date || !status) {
    return res.status(400).json({ error: "Missing fields" });
  }
  insertAttendanceStmt.run(employee_id, date, status, note || "");
  res.json({ message: "Attendance recorded!" });
});

// Attendance Summary
app.get("/api/attendance/summary", (req, res) => {
  const rows = attendanceSummaryStmt.all();
  res.json(rows);
});

// Individual Attendance History
app.get("/api/attendance/:id", (req, res) => {
  const rows = attendanceHistoryStmt.all(req.params.id);
  res.json(rows);
});
