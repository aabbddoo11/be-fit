
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaBoxOpen,
  FaShoppingBag,
  FaUsers,
  FaStore,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import "./AdminSidebar.css";
import { useAuth } from "../../../context/AuthContext";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
    {
      label: "Store",
      path: "/",
      icon: <FaStore />,
    },
  ];

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      logout();

      sessionStorage.setItem(
        "logoutSuccess",
        "You have been logged out successfully."
      );

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout error:", error);

      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {!isMobileOpen && (
        <button
          type="button"
          className="admin-mobile-menu-button"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open navigation"
        >
          <FaBars />
        </button>
      )}

      {isMobileOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`admin-sidebar ${
          isMobileOpen
            ? "admin-sidebar-mobile-open"
            : ""
        }`}
      >
        <button
          type="button"
          className="admin-sidebar-mobile-close"
          onClick={closeMobileSidebar}
          aria-label="Close sidebar"
        >
          <FaTimes />
        </button>

        <div className="admin-sidebar-logo">
          <h2>B-FIT</h2>
          <span>ADMIN PANEL</span>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="admin-sidebar-section-title">
            MAIN MENU
          </div>

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `admin-sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="admin-sidebar-icon">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="admin-sidebar-divider" />

          <div className="admin-sidebar-section-title">
            SYSTEM
          </div>

          <NavLink
            to="/account"
            onClick={closeMobileSidebar}
            className={({ isActive }) =>
              `admin-sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="admin-sidebar-icon">
              <FaCog />
            </span>

            <span>Account Settings</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-bottom">
          <button
            type="button"
            className="admin-sidebar-logout"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <span className="admin-sidebar-icon">
              {isLoggingOut ? (
                <span className="admin-logout-spinner" />
              ) : (
                <FaSignOutAlt />
              )}
            </span>

            <span>
              {isLoggingOut
                ? "Logging out..."
                : "Logout"}
            </span>
          </button>
        </div>
      </aside>

      {isLoggingOut && (
        <div className="admin-logout-overlay">
          <div className="admin-logout-loader">
            <div className="admin-logout-spinner-large" />

            <h3>Logging out</h3>

            <p>
              Please wait while we securely end your
              session...
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;

