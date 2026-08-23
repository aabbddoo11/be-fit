import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaBan,
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaDollarSign,
  FaShippingFast,
  FaSpinner,
  FaShoppingBag,
  FaUsers,
} from "react-icons/fa";

import { useAuth } from "../../../context/AuthContext";

import {
  getAdminDashboard,
} from "../../../services/api";

import "./Dashboard.css";

const STATUS_CARDS = [
  {
    key: "Pending",
    title: "Pending",
    icon: <FaClock />,
    className: "pending",
  },
  {
    key: "Processing",
    title: "Processing",
    icon: <FaSpinner />,
    className: "processing",
  },
  {
    key: "Out for Delivery",
    title: "Out for Delivery",
    icon: <FaShippingFast />,
    className: "out-for-delivery",
  },
  {
    key: "Delivered",
    title: "Delivered",
    icon: <FaCheckCircle />,
    className: "delivered",
  },
  {
    key: "Canceled",
    title: "Canceled",
    icon: <FaBan />,
    className: "canceled",
  },
];

const Dashboard = () => {
  const { token, user } = useAuth();

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          throw new Error(
            "Authentication token not found"
          );
        }

        const data =
          await getAdminDashboard(token);

        setDashboardData(data);
      } catch (err) {
        setError(
          err.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboard();
    } else {
      setLoading(false);
      setError(
        "Authentication token not found"
      );
    }
  }, [token]);

  const formatCurrency = (value) => {
    return `${Number(
      value || 0
    ).toLocaleString("en-EG")} EGP`;
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .replace(/-/g, " ")
      .replace(
        /\b\w/g,
        (char) => char.toUpperCase()
      );
  };

  const getStatusClass = (status) => {
    if (!status) return "unknown";

    return status
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/_/g, "-");
  };

  const statusStats =
    dashboardData?.orderStatusStats || {
      Pending: 0,
      Processing: 0,
      "Out for Delivery": 0,
      Delivered: 0,
      Canceled: 0,
    };

  const recentOrders =
    dashboardData?.recentOrders || [];

  const salesOverview =
    dashboardData?.salesOverview || [];

  const generalStats = useMemo(
    () => [
      {
        title: "Delivered Sales",
        value: formatCurrency(
          dashboardData?.totalSales
        ),
        icon: <FaDollarSign />,
        className: "sales",
      },
      {
        title: "Total Orders",
        value: Number(
          dashboardData?.totalOrders || 0
        ).toLocaleString(),
        icon: <FaShoppingBag />,
        className: "orders",
      },
      {
        title: "Customers",
        value: Number(
          dashboardData?.totalUsers || 0
        ).toLocaleString(),
        icon: <FaUsers />,
        className: "customers",
      },
      {
        title: "Products",
        value: Number(
          dashboardData?.totalProducts || 0
        ).toLocaleString(),
        icon: <FaBoxOpen />,
        className: "products",
      },
    ],
    [dashboardData]
  );

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-loading">
          <div className="dashboard-loading-spinner"></div>

          <p>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-error">
          <h3>
            Unable to load dashboard
          </h3>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <span className="dashboard-subtitle">
            OVERVIEW
          </span>

          <h2>
            Welcome back,{" "}
            {user?.name || "Admin"}
          </h2>

          <p>
            Here is what's happening with
            your store today.
          </p>
        </div>
      </div>

      {/* General Statistics */}

      <div className="dashboard-stats dashboard-general-stats">
        {generalStats.map((stat) => (
          <div
            className={`dashboard-stat-card ${stat.className}`}
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

      {/* Order Status Statistics */}

      <div className="dashboard-status-section">
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-panel-label">
              ORDER STATUS
            </span>

            <h3>
              Orders Overview
            </h3>
          </div>

          <span className="dashboard-status-total">
            {Number(
              dashboardData?.totalOrders ||
                0
            ).toLocaleString()}{" "}
            total orders
          </span>
        </div>

        <div className="dashboard-status-grid">
          {STATUS_CARDS.map((card) => (
            <div
              className={`dashboard-status-card ${card.className}`}
              key={card.key}
            >
              <div className="dashboard-status-icon">
                {card.icon}
              </div>

              <div className="dashboard-status-content">
                <span>
                  {card.title}
                </span>

                <strong>
                  {Number(
                    statusStats[
                      card.key
                    ] || 0
                  ).toLocaleString()}
                </strong>

                <small>
                  {card.key ===
                  "Delivered"
                    ? "Completed orders"
                    : card.key ===
                      "Canceled"
                    ? "Canceled orders"
                    : "Current orders"}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-main-grid">

        {/* Sales Overview */}

        <section className="dashboard-panel sales-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-panel-label">
                PERFORMANCE
              </span>

              <h3>
                Delivered Sales Overview
              </h3>
            </div>

            <span className="dashboard-sales-note">
              Delivered orders only
            </span>
          </div>

          <div className="sales-summary">
            <div>
              <span>
                Total Delivered Sales
              </span>

              <strong>
                {formatCurrency(
                  dashboardData?.totalSales
                )}
              </strong>
            </div>

            <div>
              <span>
                Delivered Orders
              </span>

              <strong>
                {Number(
                  statusStats.Delivered ||
                    0
                ).toLocaleString()}
              </strong>
            </div>
          </div>

          <div className="sales-chart">
            <div className="sales-y-axis">
              <span>80k</span>
              <span>60k</span>
              <span>40k</span>
              <span>20k</span>
              <span>0</span>
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
                {salesOverview.length >
                0 ? (
                  salesOverview.map(
                    (item) => (
                      <span
                        key={`${item.year}-${item.month}`}
                      >
                        {new Date(
                          item.year,
                          item.month - 1
                        ).toLocaleString(
                          "en-US",
                          {
                            month:
                              "short",
                          }
                        )}
                      </span>
                    )
                  )
                ) : (
                  <span>
                    No delivered sales
                    data
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Recent Orders */}

        <section className="dashboard-panel orders-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-panel-label">
                ORDERS
              </span>

              <h3>
                Recent Orders
              </h3>
            </div>

            <span className="dashboard-recent-label">
              Latest 5
            </span>
          </div>

          <div className="recent-orders">
            {recentOrders.length >
            0 ? (
              recentOrders.map(
                (order) => (
                  <div
                    className="recent-order"
                    key={order._id}
                  >
                    <div className="recent-order-main">
                      <strong>
                        #{order.orderNumber}
                      </strong>

                      <span>
                        {order.user
                          ?.name ||
                          order
                            .shippingAddress
                            ?.firstName ||
                          "Unknown Customer"}
                      </span>

                      <small>
                        {order.user
                          ?.email ||
                          order
                            .shippingAddress
                            ?.email ||
                          "No email available"}
                      </small>
                    </div>

                    <div className="recent-order-right">
                      <strong>
                        {formatCurrency(
                          order.totalPrice
                        )}
                      </strong>

                      <span
                        className={`order-status ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {formatStatus(
                          order.status
                        )}
                      </span>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="dashboard-empty">
                <p>
                  No recent orders
                  found.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;