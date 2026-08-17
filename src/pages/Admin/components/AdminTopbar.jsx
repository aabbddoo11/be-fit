import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import "./AdminTopbar.css";

const AdminTopbar = () => {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <div className="admin-page-title">
          <span>ADMIN</span>
          <h1>Dashboard</h1>
        </div>
      </div>

      <div className="admin-topbar-right">
        <button className="admin-notification-btn" type="button">
          <FaBell />
          <span className="admin-notification-dot"></span>
        </button>

        <div className="admin-profile">
          <div className="admin-profile-icon">
            <FaUserCircle />
          </div>

          <div className="admin-profile-info">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;