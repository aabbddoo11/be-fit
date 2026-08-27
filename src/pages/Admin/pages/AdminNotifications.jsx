import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaBell,
  FaBoxOpen,
  FaCheck,
  FaClock,
  FaShoppingBag,
  FaTrash,
  FaUserPlus,
  FaFilter,
} from "react-icons/fa";

import { useAuth } from "../../../context/AuthContext";

import {
  deleteAdminNotification,
  getAdminNotifications,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
} from "../../../services/api";

import "./AdminNotifications.css";

const formatNotificationTime = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const now = new Date();

  const difference = Math.floor(
    (now.getTime() - parsedDate.getTime()) / 1000
  );

  if (difference < 60) {
    return "Just now";
  }

  if (difference < 3600) {
    const minutes = Math.floor(difference / 60);

    return `${minutes} minute${
      minutes === 1 ? "" : "s"
    } ago`;
  }

  if (difference < 86400) {
    const hours = Math.floor(difference / 3600);

    return `${hours} hour${
      hours === 1 ? "" : "s"
    } ago`;
  }

  if (difference < 604800) {
    const days = Math.floor(difference / 86400);

    return `${days} day${
      days === 1 ? "" : "s"
    } ago`;
  }

  return parsedDate.toLocaleDateString("en-EG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatFullDate = (date) => {
  if (!date) {
    return "Date unavailable";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-EG", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatFullTime = (date) => {
  if (!date) {
    return "Time unavailable";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Time unavailable";
  }

  return parsedDate.toLocaleTimeString("en-EG", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const getNotificationType = (type) => {
  switch (type) {
    case "new_order":
      return "order";

    case "order_status":
      return "order";

    case "low_stock":
      return "stock";

    case "new_user":
      return "user";

    default:
      return "other";
  }
};

const getNotificationTypeLabel = (type) => {
  switch (type) {
    case "new_order":
      return "New Order";

    case "order_status":
      return "Order Status";

    case "low_stock":
      return "Low Stock";
case "out_of_stock":
      return "Out Of Stock";
    case "new_user":
      return "New User";

    default:
      return "Notification";
  }
};

const getNotificationIcon = (type) => {
  switch (type) {
    case "new_order":
      return <FaShoppingBag />;

    case "order_status":
      return <FaClock className="faclock"/>;

    case "new_user":
      return <FaUserPlus />;

    case "low_stock":
      return <FaBoxOpen />;

    default:
      return <FaBoxOpen />;
  }
};

const getNotificationClass = (type) => {
  switch (type) {
    case "new_order":
      return "new-order";

    case "order_status":
      return "order-status";

    case "new_user":
      return "new-user";

    case "low_stock":
      return "low-stock";

    default:
      return "default";
  }
};

const AdminNotifications = () => {
  const { token } = useAuth();

  const [notifications, setNotifications] = useState([]);

  const [activeFilter, setActiveFilter] =
    useState("all");

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] =
    useState(null);

  const loadNotifications = useCallback(async () => {
    if (!token) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data =
        await getAdminNotifications(token);

      setNotifications(
        Array.isArray(data.notifications)
          ? data.notifications
          : []
      );
    } catch (error) {
      console.error(
        "Notifications error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") {
      return notifications;
    }

    return notifications.filter(
      (notification) =>
        getNotificationType(notification.type) ===
        activeFilter
    );
  }, [notifications, activeFilter]);

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) => !notification.read
    ).length;
  }, [notifications]);

  const filterCounts = useMemo(() => {
    return {
      all: notifications.length,

      order: notifications.filter(
        (notification) =>
          getNotificationType(notification.type) ===
          "order"
      ).length,

      user: notifications.filter(
        (notification) =>
          getNotificationType(notification.type) ===
          "user"
      ).length,

      stock: notifications.filter(
        (notification) =>
          getNotificationType(notification.type) ===
          "stock"
      ).length,
    };
  }, [notifications]);

  const handleMarkAsRead = async (
    notificationId
  ) => {
    try {
      setActionLoading(notificationId);

      await markAdminNotificationAsRead(
        token,
        notificationId
      );

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Mark notification as read error:",
        error
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      setActionLoading(notificationId);

      await deleteAdminNotification(
        token,
        notificationId
      );

      setNotifications((current) =>
        current.filter(
          (notification) =>
            notification._id !== notificationId
        )
      );
    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      setActionLoading("all");

      await markAllAdminNotificationsAsRead(token);

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="admin-notifications-page">
      <div className="admin-notifications-page-header">
        <div>
          <span className="admin-notifications-page-eyebrow">
            ADMIN CENTER
          </span>

          <h1>Notifications</h1>

          <p>
            Manage and review all your store
            notifications.
          </p>
        </div>

        <div className="admin-notifications-header-stats">
          <div className="admin-notifications-stat">
            <span>Total</span>

            <strong>
              {notifications.length}
            </strong>
          </div>

          <div className="admin-notifications-stat unread">
            <span>Unread</span>

            <strong>{unreadCount}</strong>
          </div>
        </div>
      </div>

      <div className="admin-notifications-toolbar">
        <div className="admin-notifications-filters">
          <div className="admin-notifications-filter-label">
            <FaFilter />

            <span>Filter by type</span>
          </div>

          <button
            type="button"
            className={
              activeFilter === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter("all")
            }
          >
            All

            <span>{filterCounts.all}</span>
          </button>

          <button
            type="button"
            className={
              activeFilter === "order"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter("order")
            }
          >
            Orders

            <span>{filterCounts.order}</span>
          </button>

          <button
            type="button"
            className={
              activeFilter === "user"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter("user")
            }
          >
            Users

            <span>{filterCounts.user}</span>
          </button>

          <button
            type="button"
            className={
              activeFilter === "stock"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter("stock")
            }
          >
            Stock

            <span>{filterCounts.stock}</span>
          </button>
        </div>

        <button
          type="button"
          className="admin-notifications-mark-all"
          onClick={handleMarkAllAsRead}
          disabled={
            unreadCount === 0 ||
            actionLoading === "all"
          }
        >
          <FaCheck />

          {actionLoading === "all"
            ? "Updating..."
            : "Mark all as read"}
        </button>
      </div>

      <div className="admin-notifications-content">
        {loading ? (
          <div className="admin-notifications-empty">
            <div className="admin-notifications-spinner" />

            <h3>Loading notifications</h3>

            <p>
              Please wait while we load your
              notifications.
            </p>
          </div>
        ) : filteredNotifications.length ===
          0 ? (
          <div className="admin-notifications-empty">
            <div className="admin-notifications-empty-icon">
              <FaBell />
            </div>

            <h3>No notifications found</h3>

            <p>
              There are no notifications in this
              category yet.
            </p>
          </div>
        ) : (
          <div className="admin-notifications-list">
            {filteredNotifications.map(
              (notification) => (
                <div
                  key={notification._id}
                  className={`admin-notification-card ${
                    notification.read
                      ? ""
                      : "unread"
                  }`}
                >
                  <div
                    className={`admin-notification-card-icon ${getNotificationClass(
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(
                      notification.type
                    )}
                  </div>

                  <div className="admin-notification-card-content">
                    <div className="admin-notification-card-top">
                      <div>
                        <div className="admin-notification-card-title-row">
                          <h3>
                            {notification.title}
                          </h3>

                          {!notification.read && (
                            <span className="admin-notification-unread-dot" />
                          )}
                        </div>

                        <span
                          className={`admin-notification-type ${getNotificationClass(
                            notification.type
                          )}`}
                        >
                          {getNotificationTypeLabel(
                            notification.type
                          )}
                        </span>
                      </div>

                      <span className="admin-notification-card-time">
                        {formatNotificationTime(
                          notification.createdAt
                        )}
                      </span>
                    </div>

                    <p className="admin-notification-card-message">
                      {notification.message}
                    </p>

                    <div className="admin-notification-card-footer">
                      <div className="admin-notification-date">
                        <span>
                          {formatFullDate(
                            notification.createdAt
                          )}
                        </span>

                        <span>
                          {formatFullTime(
                            notification.createdAt
                          )}
                        </span>
                      </div>

                      <div className="admin-notification-actions">
                        {!notification.read && (
                          <button
                            type="button"
                            className="notification-action-read"
                            onClick={() =>
                              handleMarkAsRead(
                                notification._id
                              )
                            }
                            disabled={
                              actionLoading ===
                              notification._id
                            }
                            title="Mark as read"
                          >
                            <FaCheck />

                            <span>
                              Mark as read
                            </span>
                          </button>
                        )}

                        <button
                          type="button"
                          className="notification-action-delete"
                          onClick={() =>
                            handleDelete(
                              notification._id
                            )
                          }
                          disabled={
                            actionLoading ===
                            notification._id
                          }
                          title="Delete notification"
                        >
                          <FaTrash />

                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {notification.order && (
                      <div className="admin-notification-reference">
                        <strong>Order:</strong>

                        <span>
                          #
                          {notification.order
                            .orderNumber ||
                            notification.order
                              ._id}
                        </span>

                        {notification.order.status && (
                          <span>
                            {
                              notification.order
                                .status
                            }
                          </span>
                        )}
                      </div>
                    )}

                    {notification.user && (
                      <div className="admin-notification-reference">
                        <strong>User:</strong>

                        <span>
                          {notification.user.name ||
                            notification.user.email ||
                            notification.user._id}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;