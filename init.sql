-- create table
CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  join_date TEXT NOT NULL, -- ISO date yyyy-mm-dd
  tenure_years INTEGER,
  location TEXT
);

-- seed 20 employees
INSERT INTO employees (first_name,last_name,role,department,email,join_date,tenure_years,location) VALUES
('Aarav','Mehta','Software Engineer','Engineering','aarav.mehta@example.com','2021-06-15',4,'Chennai'),
('Neha','Sharma','HR Manager','Human Resources','neha.sharma@example.com','2019-04-01',6,'Chennai'),
('Vikram','Singh','DevOps Engineer','Engineering','vikram.singh@example.com','2022-01-20',3,'Bengaluru'),
('Nisha','Patel','Data Scientist','Data','nisha.patel@example.com','2023-02-10',2,'Hyderabad'),
('Rahul','Kumar','QA Engineer','Quality','rahul.kumar@example.com','2020-09-05',4,'Chennai'),
('Pooja','Rao','Product Manager','Product','pooja.rao@example.com','2018-11-12',6,'Mumbai'),
('Siddharth','Roy','UX Designer','Design','siddharth.roy@example.com','2022-08-01',2,'Pune'),
('Lakshmi','Iyer','Finance Analyst','Finance','lakshmi.iyer@example.com','2017-07-23',8,'Chennai'),
('Karan','Joshi','Fullstack Engineer','Engineering','karan.joshi@example.com','2021-12-16',3,'Delhi'),
('Meera','Nair','Recruiter','Human Resources','meera.nair@example.com','2019-03-11',6,'Kochi'),
('Aditi','Kapur','Support Engineer','Customer Success','aditi.kapur@example.com','2020-06-30',4,'Noida'),
('Harish','Menon','Security Analyst','Security','harish.menon@example.com','2018-09-17',7,'Bengaluru'),
('Ritu','Verma','Learning & Development','HR','ritu.verma@example.com','2022-03-01',2,'Lucknow'),
('Saket','Chopra','Business Analyst','Business','saket.chopra@example.com','2020-02-24',5,'Gurgaon'),
('Ananya','Sen','Frontend Engineer','Engineering','ananya.sen@example.com','2023-05-05',1,'Kolkata'),
('Gautam','Shah','Mobile Engineer','Engineering','gautam.shah@example.com','2021-10-01',3,'Ahmedabad'),
('Divya','Reddy','Operations Manager','Ops','divya.reddy@example.com','2016-01-20',9,'Hyderabad'),
('Tarun','Bansal','Data Engineer','Data','tarun.bansal@example.com','2020-11-10',4,'Bengaluru'),
('Priya','Gupta','Content Strategist','Marketing','priya.gupta@example.com','2019-08-09',6,'Delhi'),
('Sameer','Khan','Intern','Engineering','sameer.khan@example.com','2024-07-01',0,'Chennai');

db.exec(`
  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Present', 'Absent', 'Late')),
    note TEXT,
    FOREIGN KEY(employee_id) REFERENCES employees(id)
  );
`);

const insertAttendanceStmt = db.prepare(`INSERT INTO attendance (employee_id, date, status, note) VALUES (?, ?, ?, ?)`);
const attendanceSummaryStmt = db.prepare(`
  SELECT e.id, e.first_name, e.last_name,
    SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS presentDays,
    SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS absentDays,
    SUM(CASE WHEN a.status = 'Late' THEN 1 ELSE 0 END) AS lateDays
  FROM employees e
  LEFT JOIN attendance a ON e.id = a.employee_id
  GROUP BY e.id
`);
const attendanceHistoryStmt = db.prepare(`
  SELECT date, status, note
  FROM attendance
  WHERE employee_id = ?
  ORDER BY date DESC
`);

