import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaChartPie,
  FaBoxOpen,
  FaTags,
  FaShoppingBag,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaChartPie />,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: <FaBoxOpen />,
    },
    
    {
      label: "Orders",
      path: "/admin/orders",
      icon: <FaShoppingBag />,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: <FaUsers />,
    },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <h2>B-FIT</h2>
        <span>ADMIN PANEL</span>
      </div>

      <nav className="admin-sidebar-nav">
        <div className="admin-sidebar-section-title">MAIN MENU</div>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="admin-sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="admin-sidebar-divider" />

        <div className="admin-sidebar-section-title">SYSTEM</div>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `admin-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="admin-sidebar-icon">
            <FaCog />
          </span>
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="admin-sidebar-bottom">
        <button className="admin-sidebar-logout">
          <span className="admin-sidebar-icon">
            <FaSignOutAlt />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;