import "./OrderDetails.css";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiChevronLeft,
  FiXCircle,
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


  /*
  ==========================================
  Load Order Details
  ==========================================
  */

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


  /*
  ==========================================
  Cancel Order
  ==========================================
  */

  const handleCancelOrder = async () => {

    if (!order || canceling) {
      return;
    }


    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this order?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setCanceling(true);

      const data =
        await cancelOrder(
          token,
          order._id
        );


      /*
       * Update order immediately
       * using backend response.
       */

      if (data?.order) {

        setOrder(
          data.order
        );

      } else {

        /*
         * Fallback:
         * reload the order.
         */

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

    }

  };


  /*
  ==========================================
  Not Authenticated
  ==========================================
  */

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


  /*
  ==========================================
  Loading
  ==========================================
  */

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

            <div className="order-details-spinner"></div>

            <p>
              Loading order details...
            </p>

          </div>

        </div>

      </main>
    );

  }


  /*
  ==========================================
  Error
  ==========================================
  */

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


  /*
  ==========================================
  Render
  ==========================================
  */

  return (

    <main className="order-details-page">

      <div className="container">


        {/* Breadcrumb */}

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


        {/* Header */}

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
            className={`order-details-status ${order.status
              ?.toLowerCase()
              .replaceAll(" ", "-") || ""}`}
          >
            {order.status}
          </span>

        </div>


        {/* Main Layout */}

        <div className="order-details-layout">


          {/* Left Side */}

          <div className="order-details-main">


            {/* Products */}

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


                        {/* Product Image */}

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


                        {/* Product Information */}

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


                        {/* Price */}

                        <div className="order-product-detail-price">

                          <span>
                            Price
                          </span>

                          <strong>
                            {item.priceAtPurchase}{" "}
                            EGP
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


            {/* Shipping Address */}

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

                <p>
                  {order.shippingAddress}
                </p>

              </div>

            </section>


            {/* Payment */}

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


          {/* Right Side */}

          <aside className="order-details-sidebar">


            {/* Summary */}

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


              {/* Cancel */}

              {order.status === "Pending" && (

                <button
                  type="button"
                  className="cancel-order-btn"
                  onClick={
                    handleCancelOrder
                  }
                  disabled={canceling}
                >

                  <FiXCircle />

                  {canceling
                    ? "Canceling..."
                    : "Cancel Order"}

                </button>

              )}


              {/* Back */}

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


            {/* Order Info */}

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

      </div>

    </main>

  );
}


export default OrderDetails;