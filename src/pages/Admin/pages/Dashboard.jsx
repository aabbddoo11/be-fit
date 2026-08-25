import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaBan,
  FaBoxOpen,
  FaCalendarAlt,
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
  getAdminOrders,
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

const SALES_FILTERS = [
  {
    value: "Today",
    label: "Today",
  },
  {
    value: "Yesterday",
    label: "Yesterday",
  },
  {
    value: "Week",
    label: "This week",
  },
  {
    value: "Month",
    label: "This month",
  },
  {
    value: "Year",
    label: "This year",
  }
];

const CHART_WIDTH = 900;
const CHART_HEIGHT = 300;

const CHART_PADDING_LEFT = 18;
const CHART_PADDING_RIGHT = 18;
const CHART_PADDING_TOP = 20;
const CHART_PADDING_BOTTOM = 30;

const Dashboard = () => {
  const { token, user } = useAuth();

  const [dashboardData, setDashboardData] =
    useState(null);

  const [allOrders, setAllOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [salesFilter, setSalesFilter] =
    useState("Month");

  const [selectedDate, setSelectedDate] =
    useState("");

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  const [activePoint, setActivePoint] =
    useState(null);

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

        const [
          dashboardResult,
          ordersResult,
        ] = await Promise.all([
          getAdminDashboard(token),
          getAdminOrders(token),
        ]);

        setDashboardData(
          dashboardResult
        );

        setAllOrders(
          Array.isArray(
            ordersResult?.orders
          )
            ? ordersResult.orders
            : []
        );
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

  const deliveredOrders = useMemo(() => {
    return allOrders.filter(
      (order) =>
        order.status === "Delivered"
    );
  }, [allOrders]);

  const getStartOfDay = (date) => {
    const result = new Date(date);

    result.setHours(
      0,
      0,
      0,
      0
    );

    return result;
  };

  const getEndOfDay = (date) => {
    const result = new Date(date);

    result.setHours(
      23,
      59,
      59,
      999
    );

    return result;
  };

  const getStartOfWeek = (date) => {
    const result = new Date(date);

    const day = result.getDay();

    const daysFromMonday =
      day === 0 ? 6 : day - 1;

    result.setDate(
      result.getDate() -
        daysFromMonday
    );

    result.setHours(
      0,
      0,
      0,
      0
    );

    return result;
  };

  const getChartRange = useMemo(() => {
    if (selectedDate) {
      const customDate =
        new Date(
          `${selectedDate}T00:00:00`
        );

      if (
        !Number.isNaN(
          customDate.getTime()
        )
      ) {
        return {
          start:
            getStartOfDay(
              customDate
            ),
          end:
            getEndOfDay(
              customDate
            ),
          type: "hour",
        };
      }
    }

    const now = new Date();

    if (salesFilter === "Today") {
      return {
        start:
          getStartOfDay(now),
        end:
          getEndOfDay(now),
        type: "hour",
      };
    }

    if (salesFilter === "Yesterday") {
      const yesterday =
        new Date(now);

      yesterday.setDate(
        yesterday.getDate() - 1
      );

      return {
        start:
          getStartOfDay(
            yesterday
          ),
        end:
          getEndOfDay(
            yesterday
          ),
        type: "hour",
      };
    }

    if (salesFilter === "Week") {
      const start =
        getStartOfWeek(now);

      const end =
        new Date(start);

      end.setDate(
        end.getDate() + 6
      );

      return {
        start,
        end:
          getEndOfDay(end),
        type: "day",
      };
    }

    if (salesFilter === "Month") {
      const start =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );

      const end =
        new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0
        );

      return {
        start,
        end:
          getEndOfDay(end),
        type: "day",
      };
    }

    if (salesFilter === "Year") {
      const start =
        new Date(
          now.getFullYear(),
          0,
          1
        );

      const end =
        new Date(
          now.getFullYear(),
          11,
          31
        );

      return {
        start,
        end:
          getEndOfDay(end),
        type: "month",
      };
    }

    const firstOrder =
      deliveredOrders.length > 0
        ? deliveredOrders.reduce(
            (oldest, order) => {
              const current =
                new Date(
                  order.createdAt
                );

              return current <
                oldest
                ? current
                : oldest;
            },
            new Date()
          )
        : new Date();

    const start =
      new Date(
        firstOrder.getFullYear(),
        firstOrder.getMonth(),
        1
      );

    const end = new Date();

    return {
      start,
      end,
      type: "month",
    };
  }, [
    salesFilter,
    selectedDate,
    deliveredOrders,
  ]);

  const salesChartData = useMemo(() => {
    const {
      start,
      end,
      type,
    } = getChartRange;

    const points = [];

    if (type === "hour") {
      for (
        let hour = 0;
        hour < 24;
        hour += 1
      ) {
        const pointDate =
          new Date(start);

        pointDate.setHours(
          hour,
          0,
          0,
          0
        );

        const nextDate =
          new Date(pointDate);

        nextDate.setHours(
          hour + 1,
          0,
          0,
          0
        );

        const value =
          deliveredOrders
            .filter((order) => {
              const orderDate =
                new Date(
                  order.createdAt
                );

              return (
                orderDate >=
                  pointDate &&
                orderDate <
                  nextDate
              );
            })
            .reduce(
              (
                total,
                order
              ) =>
                total +
                Number(
                  order.totalPrice ||
                    0
                ),
              0
            );

        points.push({
          date: pointDate,
          value,
          label:
            pointDate.toLocaleTimeString(
              "en-EG",
              {
                hour: "numeric",
                hour12: true,
              }
            ),
          fullLabel:
            pointDate.toLocaleString(
              "en-EG",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
        });
      }

      return points;
    }

    if (type === "day") {
      const current =
        new Date(start);

      while (
        current <= end
      ) {
        const pointDate =
          new Date(current);

        const nextDate =
          new Date(current);

        nextDate.setDate(
          nextDate.getDate() + 1
        );

        const value =
          deliveredOrders
            .filter((order) => {
              const orderDate =
                new Date(
                  order.createdAt
                );

              return (
                orderDate >=
                  pointDate &&
                orderDate <
                  nextDate
              );
            })
            .reduce(
              (
                total,
                order
              ) =>
                total +
                Number(
                  order.totalPrice ||
                    0
                ),
              0
            );

        points.push({
          date: pointDate,
          value,
          label:
            pointDate.toLocaleDateString(
              "en-EG",
              {
                day: "2-digit",
                month: "short",
              }
            ),
          fullLabel:
            pointDate.toLocaleDateString(
              "en-EG",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            ),
        });

        current.setDate(
          current.getDate() + 1
        );
      }

      return points;
    }

    const current =
      new Date(
        start.getFullYear(),
        start.getMonth(),
        1
      );

    const lastMonth =
      new Date(
        end.getFullYear(),
        end.getMonth(),
        1
      );

    while (
      current <= lastMonth
    ) {
      const pointDate =
        new Date(current);

      const nextDate =
        new Date(
          current.getFullYear(),
          current.getMonth() + 1,
          1
        );

      const value =
        deliveredOrders
          .filter((order) => {
            const orderDate =
              new Date(
                order.createdAt
              );

            return (
              orderDate >=
                pointDate &&
              orderDate <
                nextDate
            );
          })
          .reduce(
            (
              total,
              order
            ) =>
              total +
              Number(
                order.totalPrice ||
                  0
              ),
            0
          );

      points.push({
        date: pointDate,
        value,
        label:
          pointDate.toLocaleDateString(
            "en-EG",
            {
              month: "short",
              year:
                salesFilter ===
                "All"
                  ? "numeric"
                  : undefined,
            }
          ),
        fullLabel:
          pointDate.toLocaleDateString(
            "en-EG",
            {
              month: "long",
              year: "numeric",
            }
          ),
      });

      current.setMonth(
        current.getMonth() + 1
      );
    }

    return points;
  }, [
    deliveredOrders,
    getChartRange,
    salesFilter,
  ]);

  const selectedPeriodOrders =
    useMemo(() => {
      const {
        start,
        end,
      } = getChartRange;

      return deliveredOrders.filter(
        (order) => {
          const orderDate =
            new Date(
              order.createdAt
            );

          return (
            orderDate >= start &&
            orderDate <= end
          );
        }
      );
    },
    [
      deliveredOrders,
      getChartRange,
    ]);

  const chartGeometry = useMemo(() => {
    if (
      !salesChartData.length
    ) {
      return {
        points: [],
        path: "",
        areaPath: "",
        maxValue: 0,
        stepX: 0,
      };
    }

    const maxValue =
      Math.max(
        ...salesChartData.map(
          (item) =>
            item.value
        ),
        1
      );

    const chartWidth =
      CHART_WIDTH -
      CHART_PADDING_LEFT -
      CHART_PADDING_RIGHT;

    const chartHeight =
      CHART_HEIGHT -
      CHART_PADDING_TOP -
      CHART_PADDING_BOTTOM;

    const stepX =
      salesChartData.length === 1
        ? 0
        : chartWidth /
          (salesChartData.length - 1);

    const points =
      salesChartData.map(
        (
          item,
          index
        ) => {
          const x =
            CHART_PADDING_LEFT +
            index * stepX;

          const y =
            CHART_PADDING_TOP +
            chartHeight -
            (item.value /
              maxValue) *
              chartHeight;

          return {
            ...item,
            x,
            y,
          };
        }
      );

    const path =
      points
        .map(
          (
            point,
            index
          ) =>
            `${
              index === 0
                ? "M"
                : "L"
            } ${point.x} ${point.y}`
        )
        .join(" ");

    const areaPath = `
      ${path}
      L ${
        points[
          points.length - 1
        ].x
      }
        ${
          CHART_HEIGHT -
          CHART_PADDING_BOTTOM
        }
      L ${points[0].x}
        ${
          CHART_HEIGHT -
          CHART_PADDING_BOTTOM
        }
      Z
    `;

    return {
      points,
      path,
      areaPath,
      maxValue,
      stepX,
    };
  }, [salesChartData]);

  const chartYAxis = useMemo(() => {
    const maxValue =
      chartGeometry.maxValue ||
      0;

    if (!maxValue) {
      return [
        0,
        0,
        0,
        0,
        0,
      ];
    }

    const roundedMax =
      Math.ceil(
        maxValue / 1000
      ) * 1000;

    const step =
      roundedMax / 4;

    return [
      roundedMax,
      step * 3,
      step * 2,
      step,
      0,
    ];
  }, [chartGeometry.maxValue]);

  const chartTotal = useMemo(() => {
    return selectedPeriodOrders.reduce(
      (
        total,
        order
      ) =>
        total +
        Number(
          order.totalPrice || 0
        ),
      0
    );
  }, [selectedPeriodOrders]);

  const chartFilterLabel =
    selectedDate
      ? new Date(
          `${selectedDate}T00:00:00`
        ).toLocaleDateString(
          "en-EG",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        )
      : SALES_FILTERS.find(
          (item) =>
            item.value ===
            salesFilter
        )?.label ||
        "This month";

  const handleSalesFilterChange = (
    value
  ) => {
    setSalesFilter(value);
    setSelectedDate("");
    setShowDatePicker(false);
    setActivePoint(null);
  };

  const handleDateChange = (
    event
  ) => {
    const value =
      event.target.value;

    if (!value) {
      return;
    }

    setSelectedDate(value);
    setSalesFilter("All");
    setShowDatePicker(false);
    setActivePoint(null);
  };

  const clearSelectedDate = () => {
    setSelectedDate("");
    setSalesFilter("Month");
    setShowDatePicker(false);
    setActivePoint(null);
  };

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
            {user?.name ||
              "Admin"}
          </h2>

          <p>
            Here is what's happening
            with your store today.
          </p>
        </div>
      </div>

      <div className="dashboard-stats dashboard-general-stats">
        {generalStats.map(
          (stat) => (
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
          )
        )}
      </div>

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
          {STATUS_CARDS.map(
            (card) => (
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
            )
          )}
        </div>
      </div>

      <div className="dashboard-main-grid">
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

            <div className="dashboard-sales-controls">
              <select
                className="dashboard-sales-filter"
                value={
                  selectedDate
                    ? "Custom"
                    : salesFilter
                }
                onChange={(
                  event
                ) => {
                  const value =
                    event.target
                      .value;

                  if (
                    value !==
                    "Custom"
                  ) {
                    handleSalesFilterChange(
                      value
                    );
                  }
                }}
              >
                {SALES_FILTERS.map(
                  (filter) => (
                    <option
                      key={
                        filter.value
                      }
                      value={
                        filter.value
                      }
                    >
                      {
                        filter.label
                      }
                    </option>
                  )
                )}

                {selectedDate && (
                  <option value="Custom">
                    Selected date
                  </option>
                )}
              </select>

              <div className="dashboard-calendar-wrapper">
                <button
                  type="button"
                  className={`dashboard-calendar-button ${
                    selectedDate
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setShowDatePicker(
                      (current) =>
                        !current
                    )
                  }
                  title="Select a specific date"
                  aria-label="Select a specific date"
                >
                  <FaCalendarAlt />
                </button>

                {showDatePicker && (
                  <div className="dashboard-calendar-popover">
                    <div className="dashboard-calendar-popover-header">
                      <span>
                        SELECT DATE
                      </span>

                      <strong>
                        Choose a day
                      </strong>
                    </div>

                    <input
                      type="date"
                      className="dashboard-calendar-input"
                      value={
                        selectedDate
                      }
                      max={
                        new Date()
                          .toISOString()
                          .split(
                            "T"
                          )[0]
                      }
                      onChange={
                        handleDateChange
                      }
                    />

                    {selectedDate && (
                      <button
                        type="button"
                        className="dashboard-calendar-clear"
                        onClick={
                          clearSelectedDate
                        }
                      >
                        Clear selected date
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sales-summary">
            <div>
              <span>
                {selectedDate
                  ? "Selected Date Sales"
                  : `${chartFilterLabel} Sales`}
              </span>

              <strong>
                {formatCurrency(
                  chartTotal
                )}
              </strong>
            </div>

            <div>
              <span>
                Delivered Orders
              </span>

              <strong>
                {Number(
                  selectedPeriodOrders.length
                ).toLocaleString()}
              </strong>
            </div>
          </div>

          <div className="sales-chart">
            <div className="sales-y-axis">
              {chartYAxis.map(
                (
                  value,
                  index
                ) => (
                  <span
                    key={`${value}-${index}`}
                  >
                    {Number(
                      value
                    ).toLocaleString(
                      "en-EG"
                    )}
                  </span>
                )
              )}
            </div>

            <div className="sales-chart-area">
              <div className="sales-grid-line line-1"></div>
              <div className="sales-grid-line line-2"></div>
              <div className="sales-grid-line line-3"></div>
              <div className="sales-grid-line line-4"></div>
              <div className="sales-grid-line line-5"></div>

              {salesChartData.length >
              0 ? (
                <svg
                  className="sales-chart-svg"
                  viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                  preserveAspectRatio="none"
                  onMouseLeave={() =>
                    setActivePoint(
                      null
                    )
                  }
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
                    d={
                      chartGeometry.areaPath
                    }
                    fill="url(#salesGradient)"
                  />

                  <path
                    d={
                      chartGeometry.path
                    }
                    fill="none"
                    stroke="var(--primary-color)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {chartGeometry.points.map(
                    (
                      point,
                      index
                    ) => (
                      <g
                        key={`${point.date.toISOString()}-${index}`}
                        onMouseEnter={() =>
                          setActivePoint(
                            index
                          )
                        }
                        onFocus={() =>
                          setActivePoint(
                            index
                          )
                        }
                        tabIndex={0}
                        role="button"
                        aria-label={`${point.fullLabel}: ${formatCurrency(
                          point.value
                        )}`}
                        style={{
                          outline:
                            "none",
                        }}
                      >
                        <circle
                          cx={
                            point.x
                          }
                          cy={
                            point.y
                          }
                          r="14"
                          fill="transparent"
                        />

                        <circle
                          cx={
                            point.x
                          }
                          cy={
                            point.y
                          }
                          r={
                            activePoint ===
                            index
                              ? 7
                              : 4
                          }
                          fill="var(--primary-color)"
                          stroke="#ffffff"
                          strokeWidth="3"
                          style={{
                            transition:
                              "all 0.15s ease",
                          }}
                        />
                      </g>
                    )
                  )}
                </svg>
              ) : (
                <div className="sales-chart-empty">
                  No delivered sales
                  data available
                  for this period.
                </div>
              )}

              {activePoint !==
                null &&
                chartGeometry
                  .points[
                  activePoint
                ] && (
                  <div
                    className="sales-chart-tooltip"
                    style={{
                      left: `${Math.min(
                        Math.max(
                          (chartGeometry
                            .points[
                            activePoint
                          ].x /
                            CHART_WIDTH) *
                            100,
                          8
                        ),
                        92
                      )}%`,
                      top: `${Math.max(
                        8,
                        (chartGeometry
                          .points[
                          activePoint
                        ].y /
                          CHART_HEIGHT) *
                          100 -
                          18
                      )}%`,
                    }}
                  >
                    <span>
                      {
                        chartGeometry
                          .points[
                          activePoint
                        ].fullLabel
                      }
                    </span>

                    <strong>
                      {formatCurrency(
                        chartGeometry
                          .points[
                          activePoint
                        ].value
                      )}
                    </strong>
                  </div>
                )}

              <div className="sales-x-axis">
                {chartGeometry
                  .points.length >
                0 ? (
                  chartGeometry.points.map(
                    (
                      point,
                      index
                    ) => {
                      const shouldShow =
                        chartGeometry
                          .points
                          .length <=
                          12 ||
                        index === 0 ||
                        index ===
                          chartGeometry
                            .points
                            .length -
                            1 ||
                        index %
                          Math.ceil(
                            chartGeometry
                              .points
                              .length /
                              8
                          ) ===
                          0;

                      return (
                        <span
                          key={`${point.date.toISOString()}-${index}`}
                          className={
                            shouldShow
                              ? ""
                              : "sales-x-axis-hidden"
                          }
                        >
                          {
                            point.label
                          }
                        </span>
                      );
                    }
                  )
                ) : (
                  <span>
                    No sales data
                  </span>
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
                    key={
                      order._id
                    }
                  >
                    <div className="recent-order-main">
                      <strong>
                        #
                        {
                          order.orderNumber
                        }
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