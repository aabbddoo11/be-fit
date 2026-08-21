import "./OrderDetails.css";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiChevronLeft,
  FiXCircle,
  FiPhone,
  FiMail,
  FiUser,
} from "react-icons/fi";

import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

import {
  getOrderById,
  cancelOrder,
} from "../../services/api";

import { useAuth } from "../../context/AuthContext";

import { toast } from "react-toastify";

function OrderDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    token,
    isAuthenticated,
  } = useAuth();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [canceling, setCanceling] =
    useState(false);

  const [showCancelModal, setShowCancelModal] =
    useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      if (!isAuthenticated || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data =
          await getOrderById(
            token,
            id
          );

        setOrder(
          data?.order || null
        );

      } catch (error) {
        console.error(
          "Order details error:",
          error
        );

        setError(
          error.message ||
            "Failed to load order details."
        );

      } finally {
        setLoading(false);
      }
    };

    loadOrder();

  }, [
    token,
    isAuthenticated,
    id,
  ]);

  const handleCancelOrder = async () => {
    if (!order || canceling) {
      return;
    }

    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    if (!order || canceling) {
      return;
    }

    try {
      setCanceling(true);

      const data =
        await cancelOrder(
          token,
          order._id
        );

      if (data?.order) {
        setOrder(data.order);
      } else {
        const updatedData =
          await getOrderById(
            token,
            order._id
          );

        setOrder(
          updatedData?.order ||
            order
        );
      }

      toast.success(
        "Your order has been canceled successfully."
      );

    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to cancel your order."
      );

    } finally {
      setCanceling(false);
      setShowCancelModal(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="order-details-page">
        <div className="container">

          <Breadcrumb
            items={[
              {
                label: "Home",
                link: "/",
              },
              {
                label: "My Orders",
                link: "/orders",
              },
              {
                label: "Order Details",
              },
            ]}
          />

          <div className="order-details-message">
            <FiPackage />

            <h2>
              Please Login
            </h2>

            <p>
              You need to login to view
              your order details.
            </p>

            <Link
              to="/login"
              className="order-details-btn"
            >
              Login
            </Link>
          </div>

        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="order-details-page">
        <div className="container">

          <Breadcrumb
            items={[
              {
                label: "Home",
                link: "/",
              },
              {
                label: "My Orders",
                link: "/orders",
              },
              {
                label: "Order Details",
              },
            ]}
          />

          <div className="order-details-loading">
            <div className="order-details-spinner" />

            <p>
              Loading order details...
            </p>
          </div>

        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="order-details-page">
        <div className="container">

          <Breadcrumb
            items={[
              {
                label: "Home",
                link: "/",
              },
              {
                label: "My Orders",
                link: "/orders",
              },
              {
                label: "Order Details",
              },
            ]}
          />

          <div className="order-details-message">
            <FiPackage />

            <h2>
              Order Not Found
            </h2>

            <p>
              {error ||
                "We couldn't find this order."}
            </p>

            <Link
              to="/orders"
              className="order-details-btn"
            >
              Back To Orders
            </Link>
          </div>

        </div>
      </main>
    );
  }

  const shippingAddress =
    order.shippingAddress;

  return (
    <main className="order-details-page">

      <div className="container">

        <Breadcrumb
          items={[
            {
              label: "Home",
              link: "/",
            },
            {
              label: "My Orders",
              link: "/orders",
            },
            {
              label: `Order #${order.orderNumber}`,
            },
          ]}
        />

        <div className="order-details-header">

          <div>
            <span className="order-details-subtitle">
              ORDER DETAILS
            </span>

            <h1>
              Order #{order.orderNumber}
            </h1>

            <p>
              Review the products and
              information for your order.
            </p>
          </div>

          <span
            className={`order-details-status ${
              order.status
                ?.toLowerCase()
                .replaceAll(" ", "-") || ""
            }`}
          >
            {order.status}
          </span>

        </div>

        <div className="order-details-layout">

          <div className="order-details-main">

            <section className="order-details-card">

              <div className="order-details-card-header">

                <div className="order-details-card-title">

                  <FiPackage />

                  <h2>
                    Ordered Products
                  </h2>

                </div>

                <span>
                  {order.products?.length || 0}{" "}
                  {order.products?.length === 1
                    ? "Product"
                    : "Products"}
                </span>

              </div>

              <div className="order-products-details">

                {order.products?.map(
                  (item, index) => {

                    const product =
                      item.product;

                    return (
                      <div
                        className="order-product-detail"
                        key={
                          item._id ||
                          product?._id ||
                          index
                        }
                      >

                        <div className="order-product-detail-image">

                          {product?.image ? (
                            <img
                              src={product.image}
                              alt={
                                product.name ||
                                "Product"
                              }
                            />
                          ) : (
                            <FiPackage />
                          )}

                        </div>

                        <div className="order-product-detail-info">

                          <h3>
                            {product?.name ||
                              "Product"}
                          </h3>

                          {product?.category && (
                            <span>
                              {product.category}
                            </span>
                          )}

                          <p>
                            Quantity:{" "}
                            <strong>
                              {item.quantity}
                            </strong>
                          </p>

                        </div>

                        <div className="order-product-detail-price">

                          <span>
                            Price
                          </span>

                          <strong>
                            {item.priceAtPurchase} EGP
                          </strong>

                          <small>
                            {Number(
                              item.priceAtPurchase
                            ) *
                              Number(
                                item.quantity
                              )}{" "}
                            EGP
                          </small>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </section>

            <section className="order-details-card">

              <div className="order-details-card-header">

                <div className="order-details-card-title">

                  <FiMapPin />

                  <h2>
                    Shipping Address
                  </h2>

                </div>

              </div>

              <div className="order-shipping-address">

                {shippingAddress &&
                typeof shippingAddress === "object" ? (

                  <div className="shipping-address-details">

                    <div className="shipping-address-row">

                      <FiUser />

                      <div>
                        <span>
                          Name : <br />
                        </span>

                        <strong>
                          {shippingAddress.firstName}{" "}
                          {shippingAddress.lastName}
                          <br />
                        </strong>
                      </div>

                    </div>

                    <div className="shipping-address-row">

                      <FiPhone />

                      <div>
                        <span>
                          Phone : <br /> 
                        </span>

                        <strong>
                         
                          { shippingAddress.phone}
                        </strong>
                      </div>

                    </div>

                    <div className="shipping-address-row">

                      <FiMail />

                      <div>
                        <span>
                          Email : <br />
                        </span>

                        <strong>
                          {shippingAddress.email}
                        </strong>
                      </div>

                    </div>

                    <div className="shipping-address-row">

                      <FiMapPin />

                      <div>
                        <span>
                          Address : <br />
                        </span>

                        <strong>
                          {shippingAddress.address}
                        </strong>
                      </div>

                    </div>

                  </div>

                ) : (

                  <p>
                    {shippingAddress ||
                      "Not provided"}
                  </p>

                )}

              </div>

            </section>

            <section className="order-details-card">

              <div className="order-details-card-header">

                <div className="order-details-card-title">

                  <FiCreditCard />

                  <h2>
                    Payment Method
                  </h2>

                </div>

              </div>

              <div className="order-payment-method">

                <strong>
                  {order.paymentMethod}
                </strong>

              </div>

            </section>

          </div>

          <aside className="order-details-sidebar">

            <section className="order-summary-card">

              <h2>
                Order Summary
              </h2>

              <div className="order-summary-row">

                <span>
                  Products
                </span>

                <strong>
                  {order.products?.reduce(
                    (total, item) =>
                      total +
                      Number(
                        item.quantity || 0
                      ),
                    0
                  )}{" "}
                  items
                </strong>

              </div>

              <div className="order-summary-divider" />

              <div className="order-summary-row total">

                <span>
                  Total
                </span>

                <strong>
                  {order.totalPrice} EGP
                </strong>

              </div>

              {order.status === "Pending" && (
                <button
                  type="button"
                  className="cancel-order-btn"
                  onClick={handleCancelOrder}
                  disabled={canceling}
                >
                  <FiXCircle />

                  {canceling
                    ? "Canceling..."
                    : "Cancel Order"}
                </button>
              )}

              <button
                type="button"
                className="back-orders-btn"
                onClick={() =>
                  navigate("/orders")
                }
              >
                <FiChevronLeft />

                Back To My Orders
              </button>

            </section>

            <section className="order-info-card">

              <h2>
                Order Information
              </h2>

              <div className="order-info-row">

                <span>
                  Order Number
                </span>

                <strong>
                  #{order.orderNumber}
                </strong>

              </div>

              <div className="order-info-row">

                <span>
                  Status
                </span>

                <strong>
                  {order.status}
                </strong>

              </div>

              <div className="order-info-row">

                <span>
                  Payment
                </span>

                <strong>
                  {order.paymentMethod}
                </strong>

              </div>

            </section>

          </aside>

        </div>

        {showCancelModal && (
          <div
            className="cancel-modal-overlay"
            onClick={() => {
              if (!canceling) {
                setShowCancelModal(false);
              }
            }}
          >

            <div
              className="cancel-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="cancel-modal-icon">
                <FiXCircle />
              </div>

              <h2>
                Cancel Order?
              </h2>

              <p>
                Are you sure you want to cancel this order?
                This action cannot be undone.
              </p>

              <div className="cancel-modal-actions">

                <button
                  type="button"
                  className="cancel-modal-back"
                  onClick={() =>
                    setShowCancelModal(false)
                  }
                  disabled={canceling}
                >
                  Keep Order
                </button>

                <button
                  type="button"
                  className="cancel-modal-confirm"
                  onClick={confirmCancelOrder}
                  disabled={canceling}
                >
                  {canceling
                    ? "Canceling..."
                    : "Yes, Cancel Order"}
                </button>

              </div>

            </div>

          </div>
        )}

      </div>

    </main>
  );
}

export default OrderDetails;