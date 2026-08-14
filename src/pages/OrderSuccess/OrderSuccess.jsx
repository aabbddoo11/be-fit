import "./OrderSuccess.css";
import { Link } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { FaCheckCircle } from "react-icons/fa";

function OrderSuccess() {

  const orderNumber = Math.floor(
    100000 + Math.random() * 900000
  );

  return (

    <main className="order-success-page">

      <div className="container">

        <Breadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Checkout", link: "/checkout" },
            { label: "Order Complete" },
          ]}
        />

        <div className="success-card">

          <FaCheckCircle className="success-icon" />

          <h1>Thank You!</h1>

          <h2>Your order has been placed successfully.</h2>

          <p>

            We have received your order and will begin
            processing it shortly.

          </p>

          <div className="order-number">

            <span>Order Number</span>

            <strong>#{orderNumber}</strong>

          </div>

          <div className="success-actions">

            <Link
              to="/shop"
              className="shop-btn"
            >
              Continue Shopping
            </Link>

            <Link
              to="/orders"
              className="home-btn"
            >
View Your Order            </Link>

          </div>

        </div>

      </div>

    </main>

  );

}

export default OrderSuccess;