// components/SidebarLayout.jsx
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./SidebarLayout.css";

export default function SidebarLayout() {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard/home" },
    { label: "Add Schedule", path: "/dashboard/add-schedule" },
    { label: "Check Bookings", path: "/dashboard/bookings" },
    { label: "Profile Details", path: "/dashboard/profile" },
    { label: "Logout", path: "/mentor-login" },
  ];

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">Mentor Panel</div>
        <nav className="menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-link ${location.pathname === item.path ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
