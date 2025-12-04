import React from "react";

export default function Sidebar({ setActivePage }) {
  return (
    <div className="sidebar">
      <h2 className="logo">HARMONY-HR</h2>

      <ul>
        <li onClick={() => setActivePage("dashboard")}>📊 Dashboard</li>
        <li onClick={() => setActivePage("employees")}>👥 Employees</li>
        <li onClick={() => setActivePage("rewards")}>🏆 Rewards</li>
        <li onClick={() => setActivePage("attendance")}>🕒 Attendance</li>
      </ul>
    </div>
  );
}
