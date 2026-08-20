
import React, { useEffect, useState } from "react";
import {
  FaDollarSign,
  FaShoppingBag,
  FaUsers,
  FaBoxOpen,
} from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { getAdminDashboard } from "../../../services/api";
import "./Dashboard.css";

const Dashboard = () => {
const { token, user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const data = await getAdminDashboard(token);
        setDashboardData(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboard();
    } else {
      setLoading(false);
      setError("Authentication token not found");
    }
  }, [token]);

  const formatCurrency = (value) => {
    return `${Number(value || 0).toLocaleString()}.LE`;
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStatusClass = (status) => {
    if (!status) return "unknown";

    return status
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/_/g, "-");
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-loading">
          <div className="dashboard-loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-error">
          <h3>Unable to load dashboard</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Sales",
      value: formatCurrency(dashboardData?.totalSales),
      icon: <FaDollarSign />,
    },
    {
      title: "Total Orders",
      value: Number(dashboardData?.totalOrders || 0).toLocaleString(),
      icon: <FaShoppingBag />,
    },
    {
      title: "Customers",
      value: Number(dashboardData?.totalUsers || 0).toLocaleString(),
      icon: <FaUsers />,
    },
    {
      title: "Products",
      value: Number(dashboardData?.totalProducts || 0).toLocaleString(),
      icon: <FaBoxOpen />,
    },
  ];

  const recentOrders = dashboardData?.recentOrders || [];
  const salesOverview = dashboardData?.salesOverview || [];

  const latestSales =
    salesOverview.length > 0
      ? salesOverview[salesOverview.length - 1]
      : null;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <span className="dashboard-subtitle">OVERVIEW</span>

<h2>Welcome back, {user?.name || "Admin"}</h2>
          <p>
            Here is what's happening with your store today.
          </p>
        </div>
      </div>

      <div className="dashboard-stats">
        {stats.map((stat) => (
          <div
            className="dashboard-stat-card"
            key={stat.title}
          >
            <div className="dashboard-stat-top">
              <div className="dashboard-stat-icon">
                {stat.icon}
              </div>
            </div>

            <span className="dashboard-stat-title">
              {stat.title}
            </span>

            <strong className="dashboard-stat-value">
              {stat.value}
            </strong>
          </div>
        ))}
      </div>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel sales-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-panel-label">
                PERFORMANCE
              </span>

              <h3>Sales Overview</h3>
            </div>

            <select
              className="dashboard-period-select"
              defaultValue="month"
            >
              <option value="month">Current Month</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="sales-summary">
            <div>
              <span>Total Sales</span>

              <strong>
                {formatCurrency(
                  latestSales?.sales || dashboardData?.totalSales
                )}
              </strong>
            </div>

            <div>
              <span>Orders</span>

              <strong>
                {latestSales?.orders ||
                  dashboardData?.totalOrders ||
                  0}
              </strong>
            </div>
          </div>

          <div className="sales-chart">
            <div className="sales-y-axis">
              <span>$80k</span>
              <span>$60k</span>
              <span>$40k</span>
              <span>$20k</span>
              <span>$0</span>
            </div>

            <div className="sales-chart-area">
              <div className="sales-grid-line line-1"></div>
              <div className="sales-grid-line line-2"></div>
              <div className="sales-grid-line line-3"></div>
              <div className="sales-grid-line line-4"></div>
              <div className="sales-grid-line line-5"></div>

              <svg
                className="sales-chart-svg"
                viewBox="0 0 700 260"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="salesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="rgba(255,107,0,0.28)"
                    />

                    <stop
                      offset="100%"
                      stopColor="rgba(255,107,0,0)"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="M0 220 C140 220, 260 220, 400 220 S560 100, 700 25 L700 260 L0 260 Z"
                  fill="url(#salesGradient)"
                />

                <path
                  d="M0 220 C140 220, 260 220, 400 220 S560 100, 700 25"
                  fill="none"
                  stroke="var(--primary-color)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>

              <div className="sales-x-axis">
                {salesOverview.length > 0 ? (
                  salesOverview.map((item) => (
                    <span
                      key={`${item.year}-${item.month}`}
                    >
                      {new Date(
                        item.year,
                        item.month - 1
                      ).toLocaleString("en-US", {
                        month: "short",
                      })}
                    </span>
                  ))
                ) : (
                  <span>No data</span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-panel orders-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-panel-label">
                ORDERS
              </span>

              <h3>Recent Orders</h3>
            </div>

            <button className="dashboard-view-all">
              View All
            </button>
          </div>

          <div className="recent-orders">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  className="recent-order"
                  key={order._id}
                >
                  <div className="recent-order-main">
                    <strong>
                      #{order.orderNumber}
                    </strong>

                    <span>
                      {order.user?.name || "Unknown Customer"}
                    </span>

                    <small>
                      {order.user?.email ||
                        "No email available"}
                    </small>
                  </div>

                  <div className="recent-order-right">
                    <strong>
                      {formatCurrency(order.totalPrice)}
                    </strong>

                    <span
                      className={`order-status ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="dashboard-empty">
                <p>No recent orders found.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
