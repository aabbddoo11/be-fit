import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaBell,
  FaBoxOpen,
  FaCheck,
  FaClock,
  FaShoppingBag,
  FaTrash,
  FaUserCircle,
  FaUserPlus,
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";

import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  deleteAdminNotification,
  getAdminNotifications,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
} from "../../../services/api";

import "./AdminTopbar.css";

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

const formatFullNotificationDate = (date) => {
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

const formatFullNotificationTime = (date) => {
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

const getNotificationTypeLabel = (type) => {
  switch (type) {
    case "new_order":
      return "New Order";

    case "order_status":
      return "Order Status Update";

    case "new_user":
      return "New User";

    case "new_product":
      return "New Product";

    case "low_stock":
      return "Low Stock";

    case "out_of_stock":
      return "Out Of Stock";

    default:
      return "Store Notification";
  }
};

const getNotificationIcon = (type) => {
  switch (type) {
    case "new_order":
      return <FaShoppingBag />;

    case "order_status":
      return <FaClock />;

    case "new_user":
      return <FaUserPlus />;

    case "new_product":
      return <FaBoxOpen />;

    default:
      return <FaBell />;
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

    case "new_product":
      return "new-product";

    case "low_stock":
      return "low-stock";

    default:
      return "default";
  }
};

const AdminTopbar = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [selectedNotification, setSelectedNotification] =
    useState(null);

  const [loading, setLoading] = useState(false);

  const notificationRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);

      const data = await getAdminNotifications(token);

      setNotifications(
        Array.isArray(data.notifications)
          ? data.notifications
          : []
      );

      setUnreadCount(Number(data.unreadCount || 0));
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

  useEffect(() => {
    if (!token) {
      return;
    }

    const interval = setInterval(() => {
      loadNotifications();
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, [token, loadNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedNotification(null);
        setShowNotifications(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  const handleNotificationClick = async (
    notification
  ) => {
    setSelectedNotification(notification);

    if (!notification.read && token) {
      try {
        await markAdminNotificationAsRead(
          token,
          notification._id
        );

        setNotifications((current) =>
          current.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  read: true,
                }
              : item
          )
        );

        setUnreadCount((current) =>
          Math.max(current - 1, 0)
        );

        setSelectedNotification((current) =>
          current?._id === notification._id
            ? {
                ...current,
                read: true,
              }
            : current
        );
      } catch (error) {
        console.error(
          "Mark notification error:",
          error
        );
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!token || unreadCount === 0) {
      return;
    }

    try {
      await markAllAdminNotificationsAsRead(
        token
      );

      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          read: true,
        }))
      );

      setUnreadCount(0);

      setSelectedNotification((current) =>
        current
          ? {
              ...current,
              read: true,
            }
          : current
      );
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );
    }
  };

  const handleDeleteNotification = async (
    event,
    notificationId
  ) => {
    event.stopPropagation();

    if (!token) {
      return;
    }

    try {
      await deleteAdminNotification(
        token,
        notificationId
      );

      setNotifications((current) =>
        current.filter(
          (item) =>
            item._id !== notificationId
        )
      );

      setUnreadCount((current) => {
        const deletedNotification =
          notifications.find(
            (item) =>
              item._id === notificationId
          );

        if (
          deletedNotification &&
          !deletedNotification.read
        ) {
          return Math.max(current - 1, 0);
        }

        return current;
      });

      setSelectedNotification((current) =>
        current?._id === notificationId
          ? null
          : current
      );
    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );
    }
  };

  return (
    <>
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <div className="admin-page-title">
            <span>ADMIN</span>

            <h1>Dashboard</h1>
          </div>
        </div>

        <div className="admin-topbar-right">
          <div
            className="admin-notification-wrapper"
            ref={notificationRef}
          >
            <button
              className={`admin-notification-btn ${
                unreadCount > 0
                  ? "has-notifications"
                  : ""
              }`}
              type="button"
              onClick={() =>
                setShowNotifications(
                  (current) => !current
                )
              }
              aria-label="Notifications"
            >
              <FaBell />

              {unreadCount > 0 && (
                <span className="admin-notification-count">
                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="admin-notifications-dropdown">
                <div className="admin-notifications-header">
                  <div>
                    <span>ADMIN</span>

                    <h3>Notifications</h3>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      className="admin-mark-all-btn"
                      onClick={
                        handleMarkAllAsRead
                      }
                    >
                      <FaCheck />

                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="admin-notifications-body">
                  {loading &&
                  notifications.length === 0 ? (
                    <div className="admin-notifications-loading">
                      <div className="admin-notifications-spinner" />

                      <span>
                        Loading notifications...
                      </span>
                    </div>
                  ) : notifications.length ===
                    0 ? (
                    <div className="admin-notifications-empty">
                      <div className="admin-notifications-empty-icon">
                        <FaBell />
                      </div>

                      <strong>
                        No notifications
                      </strong>

                      <span>
                        New activity on your
                        store will appear here.
                      </span>
                    </div>
                  ) : (
                    notifications.map(
                      (notification) => (
                        <div
                          key={
                            notification._id
                          }
                          className={`admin-notification-item ${
                            notification.read
                              ? "read"
                              : "unread"
                          }`}
                          onClick={() =>
                            handleNotificationClick(
                              notification
                            )
                          }
                        >
                          <div
                            className={`admin-notification-icon ${getNotificationClass(
                              notification.type
                            )}`}
                          >
                            {getNotificationIcon(
                              notification.type
                            )}
                          </div>

                          <div className="admin-notification-content">
                            <div className="admin-notification-title-row">
                              <strong>
                                {
                                  notification.title
                                }
                              </strong>

                              {!notification.read && (
                                <span className="admin-notification-unread-dot" />
                              )}
                            </div>

                            <p>
                              {
                                notification.message
                              }
                            </p>

                            <small>
                              {formatNotificationTime(
                                notification.createdAt
                              )}
                            </small>
                          </div>

                          <button
                            type="button"
                            className="admin-notification-delete"
                            onClick={(event) =>
                              handleDeleteNotification(
                                event,
                                notification._id
                              )
                            }
                            aria-label="Delete notification"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )
                    )
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="admin-notifications-footer">
                    <button
                      type="button"
                      className="admin-show-all-notifications-btn"
                      onClick={() => {
                        setShowNotifications(false);
                        navigate("/admin/notifications");
                      }}
                    >
                      Show all notifications
                    </button>

                    <div className="admin-notifications-footer-info">
                      <span>
                        {notifications.length}{" "}
                        notification
                        {notifications.length ===
                        1
                          ? ""
                          : "s"}
                      </span>

                      {unreadCount > 0 && (
                        <strong>
                          {unreadCount} unread
                        </strong>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="admin-profile">
            <div className="admin-profile-icon">
              <FaUserCircle />
            </div>

            <div className="admin-profile-info">
              <strong>Admin</strong>

              <span>
                Administrator
              </span>
            </div>
          </div>
        </div>
      </header>

      {selectedNotification && (
        <div
          className="admin-notification-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedNotification(null);
            }
          }}
        >
          <article
            className="admin-notification-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-modal-title"
          >
            <header className="admin-notification-modal-header">
              <div
                className={`admin-notification-modal-icon ${getNotificationClass(
                  selectedNotification.type
                )}`}
              >
                {getNotificationIcon(
                  selectedNotification.type
                )}
              </div>

              <button
                type="button"
                className="admin-notification-modal-close"
                onClick={() =>
                  setSelectedNotification(null)
                }
                aria-label="Close notification"
              >
                <FaTimes />
              </button>
            </header>

            <div className="admin-notification-modal-body">
              <span className="admin-notification-modal-label">
                {getNotificationTypeLabel(
                  selectedNotification.type
                )}
              </span>

              <h2 id="notification-modal-title">
                {selectedNotification.title}
              </h2>

              <p className="admin-notification-modal-message">
                {selectedNotification.message}
              </p>

              <div className="admin-notification-modal-meta">
                <div className="admin-notification-modal-meta-item">
                  <FaCalendarAlt />

                  <div>
                    <span>
                      Date
                    </span>

                    <strong>
                      {formatFullNotificationDate(
                        selectedNotification.createdAt
                      )}
                    </strong>
                  </div>
                </div>

                <div className="admin-notification-modal-meta-item">
                  <FaClock />

                  <div>
                    <span>
                      Time
                    </span>

                    <strong>
                      {formatFullNotificationTime(
                        selectedNotification.createdAt
                      )}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="admin-notification-modal-status">
                <span>Status</span>

                <strong
                  className={
                    selectedNotification.read
                      ? "read"
                      : "unread"
                  }
                >
                  {selectedNotification.read
                    ? "Read"
                    : "Unread"}
                </strong>
              </div>
            </div>

            <footer className="admin-notification-modal-footer">
              <button
                type="button"
                className="admin-notification-modal-delete"
                onClick={async () => {
                  if (!token) {
                    return;
                  }

                  try {
                    await deleteAdminNotification(
                      token,
                      selectedNotification._id
                    );

                    setNotifications(
                      (current) =>
                        current.filter(
                          (item) =>
                            item._id !==
                            selectedNotification._id
                        )
                    );

                    if (
                      !selectedNotification.read
                    ) {
                      setUnreadCount(
                        (current) =>
                          Math.max(
                            current - 1,
                            0
                          )
                      );
                    }

                    setSelectedNotification(
                      null
                    );
                  } catch (error) {
                    console.error(
                      "Delete notification error:",
                      error
                    );
                  }
                }}
              >
                <FaTrash />

                Delete
              </button>

              <button
                type="button"
                className="admin-notification-modal-close-btn"
                onClick={() =>
                  setSelectedNotification(null)
                }
              >
                Close
              </button>
            </footer>
          </article>
        </div>
      )}
    </>
  );
};

export default AdminTopbar;