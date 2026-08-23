import React, { useEffect, useState } from "react";
import {
  FaDollarSign,
  FaShoppingBag,
  FaUsers,
  FaBoxOpen,
  FaClock,
  FaCog,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
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
        setError(
          err.message || "Failed to load dashboard"
        );
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

  /*
    =========================
    Helpers
  =========================
  */

  const formatCurrency = (value) => {
    return `${Number(value || 0).toLocaleString()} LE`;
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const getStatusClass = (status) => {
    if (!status) return "unknown";

    return status
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/_/g, "-");
  };

  /*
    =========================
    Loading
  =========================
  */

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

  /*
    =========================
    Error
  =========================
  */

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

  /*
    =========================
    Data
  =========================
  */

  const totalSales =
    dashboardData?.totalSales || 0;

  const totalOrders =
    dashboardData?.totalOrders || 0;

  const totalUsers =
    dashboardData?.totalUsers || 0;

  const totalProducts =
    dashboardData?.totalProducts || 0;

  const pendingOrders =
    dashboardData?.pendingOrders || 0;

  const processingOrders =
    dashboardData?.processingOrders || 0;

  const outForDeliveryOrders =
    dashboardData?.outForDeliveryOrders || 0;

  const deliveredOrders =
    dashboardData?.deliveredOrders || 0;

  const canceledOrders =
    dashboardData?.canceledOrders || 0;

  const recentOrders =
    dashboardData?.recentOrders || [];

  const salesOverview =
    dashboardData?.salesOverview || [];

  /*
    =========================
    Main Statistics
  =========================
  */

  const stats = [
    {
      title: "Total Sales",
      value: formatCurrency(totalSales),
      icon: <FaDollarSign />,
      className: "sales",
    },

    {
      title: "Total Orders",
      value: Number(
        totalOrders
      ).toLocaleString(),
      icon: <FaShoppingBag />,
      className: "orders",
    },

    {
      title: "Customers",
      value: Number(
        totalUsers
      ).toLocaleString(),
      icon: <FaUsers />,
      className: "customers",
    },

    {
      title: "Products",
      value: Number(
        totalProducts
      ).toLocaleString(),
      icon: <FaBoxOpen />,
      className: "products",
    },
  ];

  /*
    =========================
    Order Status Statistics
  =========================
  */

  const orderStatuses = [
    {
      title: "Pending",
      value: pendingOrders,
      icon: <FaClock />,
      className: "pending",
    },

    {
      title: "Processing",
      value: processingOrders,
      icon: <FaCog />,
      className: "processing",
    },

    {
      title: "Out for Delivery",
      value: outForDeliveryOrders,
      icon: <FaTruck />,
      className: "out-for-delivery",
    },

    {
      title: "Delivered",
      value: deliveredOrders,
      icon: <FaCheckCircle />,
      className: "delivered",
    },

    {
      title: "Canceled",
      value: canceledOrders,
      icon: <FaTimesCircle />,
      className: "canceled",
    },
  ];

  /*
    =========================
    Latest Sales
  =========================
  */

  const latestSales =
    salesOverview.length > 0
      ? salesOverview[
          salesOverview.length - 1
        ]
      : null;

  /*
    =========================
    Render
  =========================
  */

  return (
    <div className="admin-dashboard">

      {/* =========================
          Header
      ========================= */}

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
            Here is what's happening
            with your store today.
          </p>

        </div>

      </div>

      {/* =========================
          Main Statistics
      ========================= */}

      <div className="dashboard-stats">

        {stats.map((stat) => (

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

      {/* =========================
          Order Status
      ========================= */}

      <section className="dashboard-panel status-panel">

        <div className="dashboard-panel-header">

          <div>

            <span className="dashboard-panel-label">
              ORDER STATUS
            </span>

            <h3>
              Orders Overview
            </h3>

          </div>

        </div>

        <div className="order-status-grid">

          {orderStatuses.map(
            (status) => (

              <div
                className={`order-status-card ${status.className}`}
                key={status.title}
              >

                <div className="order-status-card-icon">
                  {status.icon}
                </div>

                <div className="order-status-card-content">

                  <span>
                    {status.title}
                  </span>

                  <strong>
                    {Number(
                      status.value
                    ).toLocaleString()}
                  </strong>

                  <small>
                    {status.value === 1
                      ? "Order"
                      : "Orders"}
                  </small>

                </div>

              </div>

            )
          )}

        </div>

      </section>

      {/* =========================
          Main Dashboard Grid
      ========================= */}

      <div className="dashboard-main-grid">

        {/* =========================
            Sales Overview
        ========================= */}

        <section className="dashboard-panel sales-panel">

          <div className="dashboard-panel-header">

            <div>

              <span className="dashboard-panel-label">
                PERFORMANCE
              </span>

              <h3>
                Sales Overview
              </h3>

            </div>

            <select
              className="dashboard-period-select"
              defaultValue="all"
            >

              <option value="month">
                Current Month
              </option>

              <option value="all">
                All Time
              </option>

            </select>

          </div>

          {/* Sales Summary */}

          <div className="sales-summary">

            <div>

              <span>
                Delivered Sales
              </span>

              <strong>
                {formatCurrency(
                  totalSales
                )}
              </strong>

            </div>

            <div>

              <span>
                Delivered Orders
              </span>

              <strong>
                {Number(
                  deliveredOrders
                ).toLocaleString()}
              </strong>

            </div>

          </div>

          {/* Sales Chart */}

          <div className="sales-chart">

            <div className="sales-y-axis">

              <span>
                Sales
              </span>

              <span>
                80k
              </span>

              <span>
                60k
              </span>

              <span>
                40k
              </span>

              <span>
                20k
              </span>

              <span>
                0
              </span>

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
                    No delivered sales data
                  </span>

                )}

              </div>

            </div>

          </div>

        </section>

        {/* =========================
            Recent Orders
        ========================= */}

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
                        #
                        {
                          order.orderNumber
                        }
                      </strong>

                      <span>
                        {order.user?.name ||
                          "Unknown Customer"}
                      </span>

                      <small>
                        {order.user?.email ||
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
                  No recent orders found.
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