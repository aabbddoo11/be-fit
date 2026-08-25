import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaArrowRight,
  FaBoxOpen,
  FaCreditCard,
  FaExclamationTriangle,
  FaEye,
  FaMapMarkerAlt,
  FaPhone,
  FaCalendarAlt,
  FaSearch,
  FaShoppingBag,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import {
  getAdminOrders,
  updateAdminOrderStatus,
} from "../../../services/api";
import "./AdminOrders.css";

const STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "Out for Delivery",
  "Delivered",
  "Canceled",
];

const getStatusClass = (status) =>
  String(status || "unknown")
    .toLowerCase()
    .replace(/\s+/g, "-");

const formatCurrency = (value) =>
  `${Number(value || 0).toLocaleString("en-EG")} EGP`;

const formatOrderNumber = (order) =>
  order.orderNumber
    ? `#${order.orderNumber}`
    : `#${String(order._id || "").slice(-6).toUpperCase()}`;

const formatOrderDateTime = (date) => {
  if (!date) {
    return {
      date: "Date unavailable",
      time: "",
    };
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return {
      date: "Date unavailable",
      time: "",
    };
  }

  return {
    date: parsedDate.toLocaleDateString("en-EG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: parsedDate.toLocaleTimeString("en-EG", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const getShippingName = (order) => {
  const shipping = order.shippingAddress;

  if (shipping && typeof shipping === "object") {
    const firstName = shipping.firstName || "";
    const lastName = shipping.lastName || "";

    const fullName = `${firstName} ${lastName}`.trim();

    return (
      fullName ||
      order.user?.name ||
      "Customer name unavailable"
    );
  }

  return order.user?.name || "Customer name unavailable";
};

const getShippingPhone = (order) => {
  const shipping = order.shippingAddress;

  if (shipping && typeof shipping === "object") {
    return (
      shipping.phone ||
      order.user?.phone ||
      "Phone unavailable"
    );
  }

  return order.user?.phone || "Phone unavailable";
};

const getShippingEmail = (order) => {
  const shipping = order.shippingAddress;

  if (shipping && typeof shipping === "object") {
    return (
      shipping.email ||
      order.user?.email ||
      "No email available"
    );
  }

  return order.user?.email || "No email available";
};

const getShippingAddress = (order) => {
  const shipping = order.shippingAddress;

  if (shipping && typeof shipping === "object") {
    return shipping.address || "Address unavailable";
  }

  return shipping || "Address unavailable";
};

const AdminOrders = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusChange, setStatusChange] = useState(null);
  const [updating, setUpdating] = useState(false);

  const loadOrders = useCallback(async () => {
    if (!token) {
      setOrders([]);
      setError("Authentication token not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getAdminOrders(token);

      setOrders(
        Array.isArray(data.orders)
          ? data.orders
          : []
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      if (!term) {
        return matchesStatus;
      }

      const shippingAddress =
        order.shippingAddress;

      const searchableValues = [
        order.orderNumber,
        order._id,
        order.user?.name,
        order.user?.email,
        order.user?.phone,
        shippingAddress?.firstName,
        shippingAddress?.lastName,
        shippingAddress?.phone,
        shippingAddress?.email,
        shippingAddress?.address,
        shippingAddress,
        order.status,
      ];

      return (
        matchesStatus &&
        searchableValues.some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(term)
        )
      );
    });
  }, [
    orders,
    search,
    statusFilter,
  ]);

  const requestStatusChange = (
    order,
    nextStatus
  ) => {
    if (
      nextStatus === order.status ||
      order.status === "Canceled"
    ) {
      return;
    }

    setStatusChange({
      order,
      nextStatus,
    });
  };

  const confirmStatusChange = async () => {
    if (!statusChange || !token) {
      return;
    }

    const {
      order,
      nextStatus,
    } = statusChange;

    try {
      setUpdating(true);

      const data =
        await updateAdminOrderStatus(
          token,
          order._id,
          nextStatus
        );

      const updatedOrder =
        data.order;

      setOrders(
        (currentOrders) =>
          currentOrders.map(
            (currentOrder) =>
              currentOrder._id ===
              updatedOrder._id
                ? updatedOrder
                : currentOrder
          )
      );

      setSelectedOrder(
        (currentOrder) =>
          currentOrder?._id ===
          updatedOrder._id
            ? updatedOrder
            : currentOrder
      );

      setStatusChange(null);

      toast.success(
        "Order status updated successfully."
      );
    } catch (err) {
      toast.error(
        err.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdating(false);
    }
  };

  const getItemCount = (order) =>
    (order.products || []).reduce(
      (total, item) =>
        total +
        Number(
          item.quantity || 0
        ),
      0
    );

  return (
    <section className="admin-orders">
      <header className="admin-orders-header">
        <div>
          <span className="admin-orders-subtitle">
            STORE MANAGEMENT
          </span>

          <h2>Orders</h2>

          <p>
            Review customer orders and keep
            their delivery status up to date.
          </p>
        </div>

        <button
          className="admin-orders-refresh"
          type="button"
          onClick={loadOrders}
          disabled={loading}
        >
          Refresh orders
        </button>
      </header>

      <div className="admin-orders-toolbar">
        <div className="admin-orders-search">
          <FaSearch />

          <input
            type="search"
            placeholder="Search by order, customer, email..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />
        </div>

        <select
          className="admin-orders-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >
          <option value="All">
            All statuses
          </option>

          {STATUS_OPTIONS.map(
            (status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            )
          )}
        </select>

        <span className="admin-orders-count">
          {filteredOrders.length} order
          {filteredOrders.length === 1
            ? ""
            : "s"}
        </span>
      </div>

      {error && (
        <div className="admin-orders-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-orders-state">
          <div className="admin-orders-spinner" />

          <p>
            Loading orders...
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="admin-orders-state">
          <FaShoppingBag />

          <h3>
            No orders found
          </h3>

          <p>
            {search ||
            statusFilter !== "All"
              ? "Try changing your search or filter."
              : "New customer orders will appear here."}
          </p>
        </div>
      ) : (
        <div className="admin-orders-table-wrap">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Order Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map(
                (order) => {
                  const orderDate =
                    formatOrderDateTime(
                      order.createdAt
                    );

                  return (
                    <tr key={order._id}>
                      <td>
                        <strong className="admin-order-number">
                          {formatOrderNumber(
                            order
                          )}
                        </strong>

                        <span className="admin-order-payment">
                          {order.paymentMethod ||
                            "Payment method unavailable"}
                        </span>
                      </td>

                      <td>
                        <div className="admin-order-date">
                          <strong>
                            {orderDate.date}
                          </strong>

                          {orderDate.time && (
                            <span>
                              {orderDate.time}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="admin-order-customer">
                          <strong>
                            {getShippingName(
                              order
                            )}
                          </strong>

                          <span>
                            {getShippingEmail(
                              order
                            )}
                          </span>
                        </div>
                      </td>

                      <td>
                        {getItemCount(
                          order
                        )}{" "}
                        item
                        {getItemCount(
                          order
                        ) === 1
                          ? ""
                          : "s"}
                      </td>

                      <td>
                        <strong className="admin-order-total">
                          {formatCurrency(
                            order.totalPrice
                          )}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`admin-order-status ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status ||
                            "Unknown"}
                        </span>
                      </td>

                      <td>
                        <div className="admin-order-actions">
                          <select
                            aria-label={`Change status for ${formatOrderNumber(
                              order
                            )}`}
                            className="admin-order-status-select"
                            value={
                              order.status
                            }
                            disabled={
                              order.status ===
                              "Canceled"
                            }
                            onChange={(event) =>
                              requestStatusChange(
                                order,
                                event.target
                                  .value
                              )
                            }
                          >
                            {STATUS_OPTIONS.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </option>
                              )
                            )}
                          </select>

                          <button
                            type="button"
                            className="admin-order-details-btn"
                            onClick={() =>
                              setSelectedOrder(
                                order
                              )
                            }
                            title="View order details"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div
          className="admin-order-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedOrder(
                null
              );
            }
          }}
        >
          <article
            className="admin-order-details-modal"
            role="dialog"
            aria-modal="true"
          >
            <header className="admin-order-modal-header">
              <div>
                <span>
                  ORDER DETAILS
                </span>

                <h3>
                  Order Number <br />
                  {formatOrderNumber(
                    selectedOrder
                  )}
                </h3>
              </div>

              <button
                type="button"
                className="admin-order-close-btn"
                onClick={() =>
                  setSelectedOrder(
                    null
                  )
                }
                aria-label="Close order details"
              >
                <FaTimes />
              </button>
            </header>

            <div className="admin-order-details-summary">
              <div>
                <FaUser />

                <span>
                  Customer Name
                </span>

                <strong>
                  {getShippingName(
                    selectedOrder
                  )}
                </strong>
              </div>

              <div>
                <FaPhone />

                <span>
                  Customer Phone Number
                </span>

                <strong>
                  {getShippingPhone(
                    selectedOrder
                  )}
                </strong>
              </div>

              <div>
                <FaCreditCard />

                <span>
                  Payment
                </span>

                <strong>
                  {selectedOrder.paymentMethod ||
                    "N/A"}
                </strong>
              </div>

              <div className="admin-order-date-details">
              
                <strong>Order Date :</strong>

                {(() => {
                  const orderDate =
                    formatOrderDateTime(
                      selectedOrder.createdAt
                    );

                  return (
                   <>
                      <strong>
                        {orderDate.date}
                      </strong>
<strong>Order Time :</strong>
                      {orderDate.time && (
                       
                       <strong> {orderDate.time}</strong>
                          
                        
                      )}
                   
                 </> );
                })()}
              </div>

              <div className="admin-order-shipping-address">
                <span>
                  <FaMapMarkerAlt /> Shipping Address
                </span>

                <strong>
                  {getShippingAddress(
                    selectedOrder
                  )}
                </strong>
              </div>

              <div className="admin-order-shipping-email">
                <FaUser />

                <span>
                  User Email
                </span>

                <strong>
                  {getShippingEmail(
                    selectedOrder
                  )}
                </strong>
              </div>
            </div>

            <div className="admin-order-items-title">
              <h4>
                Purchased items
              </h4>

              <span>
                {getItemCount(
                  selectedOrder
                )}{" "}
                item
                {getItemCount(
                  selectedOrder
                ) === 1
                  ? ""
                  : "s"}
              </span>
            </div>

            <div className="admin-order-items">
              {(
                selectedOrder.products ||
                []
              ).map(
                (item, index) => (
                  <div
                    className="admin-order-item"
                    key={
                      item._id ||
                      `${selectedOrder._id}-${index}`
                    }
                  >
                    <div className="admin-order-item-image">
                      {item.product
                        ?.image ? (
                        <img
                          src={
                            item.product
                              .image
                          }
                          alt={
                            item.product
                              .name
                          }
                        />
                      ) : (
                        <FaBoxOpen />
                      )}
                    </div>

                    <div className="admin-order-item-info">
                      <strong>
                        {item.product
                          ?.name ||
                          "Deleted product"}
                      </strong>

                      <span>
                        Quantity:{" "}
                        {item.quantity}
                      </span>
                    </div>

                    <strong>
                      {formatCurrency(
                        Number(
                          item.priceAtPurchase ||
                            0
                        ) *
                          Number(
                            item.quantity ||
                              0
                          )
                      )}
                    </strong>
                  </div>
                )
              )}
            </div>

            <footer className="admin-order-details-footer">
              <div>
                <span>
                  Order status
                </span>

                <span
                  className={`admin-order-status ${getStatusClass(
                    selectedOrder.status
                  )}`}
                >
                  {
                    selectedOrder.status
                  }
                </span>
              </div>

              <div>
                <span>
                  Total paid
                </span>

                <strong>
                  {formatCurrency(
                    selectedOrder.totalPrice
                  )}
                </strong>
              </div>
            </footer>
          </article>
        </div>
      )}

      {statusChange && (
        <div className="admin-order-modal-overlay admin-status-confirm-overlay">
          <article
            className="admin-status-confirm-modal"
            role="alertdialog"
            aria-modal="true"
          >
            <div className="admin-status-confirm-icon">
              <FaExclamationTriangle />
            </div>

            <span className="admin-status-confirm-label">
              CONFIRM STATUS CHANGE
            </span>

            <h3>
              Update this order?
            </h3>

            <p>
              You are about to change{" "}
              {formatOrderNumber(
                statusChange.order
              )}
              .
              {statusChange.nextStatus ===
                "Canceled" &&
                " Cancelling it will restore its items to stock."}
            </p>

            <div className="admin-status-change-preview">
              <span
                className={`admin-order-status ${getStatusClass(
                  statusChange.order
                    .status
                )}`}
              >
                {
                  statusChange.order
                    .status
                }
              </span>

              <FaArrowRight />

              <span
                className={`admin-order-status ${getStatusClass(
                  statusChange.nextStatus
                )}`}
              >
                {
                  statusChange.nextStatus
                }
              </span>
            </div>

            <div className="admin-status-confirm-actions">
              <button
                type="button"
                className="admin-status-cancel-btn"
                onClick={() =>
                  setStatusChange(
                    null
                  )
                }
                disabled={updating}
              >
                Keep current status
              </button>

              <button
                type="button"
                className="admin-status-confirm-btn"
                onClick={
                  confirmStatusChange
                }
                disabled={updating}
              >
                {updating
                  ? "Updating..."
                  : "Yes, update status"}
              </button>
            </div>
          </article>
        </div>
      )}
    </section>
  );
};

export default AdminOrders;