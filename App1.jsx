 import { useState } from "react";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="layout">
      <Sidebar setActivePage={setActivePage} />

      <main className="main">
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "employees" && <Employees />}
        {activePage === "rewards" && <Rewards />}
        {activePage === "attendance" && <Attendance />}
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <section className="card">
      <h3>Dashboard</h3>
      <p>Quick insights about employees, performance and HR activities.</p>
    </section>
  );
}

function Employees() {
  const [employees] = useState([
    { id: 1, name: "Aarav Mehta", role: "Software Engineer" },
    { id: 2, name: "Neha Sharma", role: "HR Manager" },
  ]);

  return (
    <section className="card">
      <h3>Employees</h3>
      <ul>
        {employees.map((e) => (
          <li key={e.id}>
            {e.name} – <strong>{e.role}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Rewards() {
  return (
    <section className="card">
      <h3>Rewards</h3>
      <p>Appreciate top performers every month.</p>
    </section>
  );
}

function Attendance() {
  return (
    <section className="card">
      <h3>Attendance</h3>
      <p>Daily attendance and punctuality tracking.</p>
    </section>
  );
}

export default App;
