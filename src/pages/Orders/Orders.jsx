import "./Orders.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiChevronRight } from "react-icons/fi";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { getOrders } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Orders() {
  const { token, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getOrders(token);

        setOrders(data?.orders || []);
      } catch (err) {
        console.error("Orders error:", err);

        setError(
          err.message || "Failed to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="orders-page">
        <div className="container">

          <Breadcrumb
            items={[
              { label: "Home", link: "/" },
              { label: "My Orders" },
            ]}
          />

          <div className="orders-empty">

            <FiPackage className="orders-empty-icon" />

            <h1>Please Login</h1>

            <p>
              You need to login to view your orders.
            </p>

            <Link
              to="/login"
              className="orders-btn"
            >
              Login
            </Link>

          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">

      <div className="container">

        <Breadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "My Orders" },
          ]}
        />

        <div className="orders-header">

          <span className="orders-subtitle">
            MY ACCOUNT
          </span>

          <h1>My Orders</h1>

          <p>
            Track and manage all your previous orders.
          </p>

        </div>


        {/* =========================
            Loading
        ========================== */}

        {loading && (
          <div className="orders-loading">

            <div className="orders-spinner"></div>

            <p>
              Loading your orders...
            </p>

          </div>
        )}


        {/* =========================
            Error
        ========================== */}

        {!loading && error && (
          <div className="orders-message error">

            <FiPackage />

            <p>{error}</p>

          </div>
        )}


        {/* =========================
            Empty Orders
        ========================== */}

        {!loading &&
          !error &&
          orders.length === 0 && (

            <div className="orders-empty">

              <FiPackage
                className="orders-empty-icon"
              />

              <h2>No Orders Yet</h2>

              <p>
                You haven't placed any orders yet.
              </p>

              <Link
                to="/shop"
                className="orders-btn"
              >
                Start Shopping
              </Link>

            </div>
          )}


        {/* =========================
            Orders List
        ========================== */}

        {!loading &&
          !error &&
          orders.length > 0 && (

            <div className="orders-list">

              {orders.map((order) => (

                <div
                  className="order-card"
                  key={order._id}
                >


                  {/* =========================
                      Order Top
                  ========================== */}

                  <div className="order-top">

                    <div className="order-info">

                      <span className="order-label">
                        Order
                      </span>


                      {/* ⭐ رقم الطلب الحقيقي من Database */}

                      <strong>
                        #{order.orderNumber}
                      </strong>

                    </div>


                    {/* Status */}

                    <span
                      className={`order-status ${
                        order.status
                          ?.toLowerCase()
                          .replaceAll(" ", "-") || ""
                      }`}
                    >
                      {order.status}
                    </span>

                  </div>


                  <div className="order-divider" />


                  {/* =========================
                      Products
                  ========================== */}

                  <div className="order-products">

                    {order.products?.map(
                      (item, index) => {

                        const product =
                          item.product;

                        return (

                          <div
                            className="order-product"
                            key={
                              product?._id ||
                              index
                            }
                          >

                            <div className="order-product-image">

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


                            <div className="order-product-info">

                              <h3>
                                {product?.name ||
                                  "Product"}
                              </h3>

                              <p>
                                Quantity:{" "}
                                {item.quantity}
                              </p>

                              <strong>
                                {
                                  item.priceAtPurchase
                                }{" "}
                                EGP
                              </strong>

                            </div>

                          </div>

                        );
                      }
                    )}

                  </div>


                  {/* =========================
                      Order Bottom
                  ========================== */}

                  <div className="order-bottom">


                    {/* Payment */}

                    <div>

                      <span>
                        Payment
                      </span>

                      <strong>
                        {order.paymentMethod}
                      </strong>

                    </div>


                    {/* Total */}

                    <div>

                      <span>
                        Total
                      </span>

                      <strong className="order-total">
                        {order.totalPrice} EGP
                      </strong>

                    </div>


                    {/* View Details */}

                    <Link
                      to={`/orders/${order._id}`}
                      className="order-details-btn"
                    >
                      View Details

                      <FiChevronRight />

                    </Link>

                  </div>

                </div>

              ))}

            </div>
          )}

      </div>

    </main>
  );
}

export default Orders;