import "./Checkout.css";
import vodafone from "/vodafone.png";

import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { useState } from "react";

import { checkout } from "../../services/api";

function Checkout() {
  const { cartItems, clearCart } = useCart();

  const { token, user, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("Cash On Deliverey");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();

    setDiscountError("");

    if (!code) {
      setDiscountError("Please enter a discount code.");
      return;
    }

    if (code === "WELCOME10") {
      setDiscount(10);
      setDiscountError("");
      toast.success("WELCOME10 code applied! 10% off.");
      return;
    }

    setDiscount(0);
    setDiscountError("Invalid discount code.");
  };

  const removeDiscount = () => {
    setDiscount(0);
    setDiscountCode("");
    setDiscountError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    placeOrder();
  };

  const placeOrder = async () => {
    if (!isAuthenticated || !token) {
      toast.error("Please login before placing your order.");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      navigate("/cart");
      return;
    }

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
    ];

    const emptyField = requiredFields.some(
      (field) => !formData[field].trim()
    );

    if (emptyField) {
      toast.error("Please fill in all billing details.");
      return;
    }

    try {
      setLoading(true);

      const shippingAddress = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: {
          street: formData.address.trim(),
        },
      };

      const data = await checkout(token, {
  paymentMethod,
  shippingAddress,
  couponCode: discountCode.trim().toUpperCase(),
});
      console.log("Order created successfully:", data);

      clearCart();

      toast.success("Order placed successfully!");

      setTimeout(() => {
        navigate("/order-success", {
          state: {
            order: data.newOrder,
          },
        });
      }, 1200);
    } catch (error) {
      console.error("Checkout error:", error);

      toast.error(
        error.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal >= 2000 ? 0 : 100;

  const discountAmount = (subtotal * discount) / 100;

  const total = subtotal + shipping - discountAmount;

  const remainingForFreeShipping = Math.max(
    2000 - subtotal,
    0
  );

  return (
    <main className="checkout-page">
      <div className="container">
        <Breadcrumb
          items={[
            {
              label: "Home",
              link: "/",
            },
            {
              label: "Cart",
              link: "/cart",
            },
            {
              label: "Checkout",
            },
          ]}
        />

        <div className="checkout-header">
          <h1>Checkout</h1>

          <p>
            Complete your order by filling in your billing details below.
          </p>
        </div>

        <div className="checkout-layout">
          <div className="billing-card">
            <h2>Billing Details</h2>

            <form
              className="checkout-form"
              onSubmit={handleSubmit}
            >
              <div className="form-row">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
              />

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter Your Address"
                required
              />

              <button
                type="submit"
                style={{
                  display: "none",
                }}
              >
                Submit
              </button>
            </form>
          </div>

          <div className="summary-card">
            <h2>Order Summary</h2>

            <div className="summary-products">
              {cartItems.map((item) => (
                <div
                  className="summary-product"
                  key={item.id}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div>
                    <h4>{item.name}</h4>

                    <span>
                      {item.quantity} × {item.price} EGP
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-discount">
              <div className="checkout-discount-title">
                Have a discount code?
              </div>

              <div className="checkout-discount-input">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value);
                    setDiscountError("");
                  }}
                  placeholder="Enter promo code"
                  disabled={discount > 0}
                />

                {discount > 0 ? (
                  <button
                    type="button"
                    className="checkout-discount-remove"
                    onClick={removeDiscount}
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    className="checkout-discount-button"
                    onClick={handleApplyDiscount}
                  >
                    Apply
                  </button>
                )}
              </div>

              {discount > 0 && (
                <div className="checkout-discount-success">
                  ✓ WELCOME10 applied — 10% off
                </div>
              )}

              {discountError && (
                <div className="checkout-discount-error">
                  {discountError}
                </div>
              )}
            </div>

            <div className="summary-row">
              <span>Subtotal</span>

              <strong>{subtotal} EGP</strong>
            </div>

            {discount > 0 && (
              <div className="summary-row checkout-discount-row">
                <span>Discount ({discount}%)</span>

                <strong>
                  -{discountAmount.toFixed(2)} EGP
                </strong>
              </div>
            )}

            <div className="summary-row">
              <span>Shipping</span>

              <strong>
                {shipping === 0
                  ? "Free"
                  : `${shipping} EGP`}
              </strong>
            </div>

            {shipping > 0 ? (
              <p className="shipping-note">
                Add{" "}
                <strong>
                  {remainingForFreeShipping} EGP
                </strong>{" "}
                more to get
                <span> FREE Shipping 🚚</span>
              </p>
            ) : (
              <p className="shipping-free">
                🎉 Congratulations! You have FREE Shipping.
              </p>
            )}

            <div className="summary-total">
              <span>Total</span>

              <strong>
                {total.toFixed(2)} EGP
              </strong>
            </div>

            <div className="payment-method">
              <h3>Payment Method</h3>

              <label className="payment-card">
                <input
                  type="radio"
                  name="payment"
                  value="Cash On Deliverey"
                  checked={
                    paymentMethod ===
                    "Cash On Deliverey"
                  }
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <div className="payment-content">
                  <div className="payment-title">
                    💵 Cash On Delivery
                  </div>

                  <p>
                    Pay when your order arrives at your
                    address.
                  </p>
                </div>
              </label>

              <label className="payment-card">
                <input
                  type="radio"
                  name="payment"
                  value="Visa"
                  checked={paymentMethod === "Visa"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <div className="payment-content">
                  <div className="payment-title">
                    💳 Credit Card
                  </div>

                  <p>
                    Visa, Mastercard and Meeza cards.
                  </p>
                </div>
              </label>

              <label className="payment-card">
                <input
                  type="radio"
                  name="payment"
                  value="Vodafone Cash"
                  checked={
                    paymentMethod ===
                    "Vodafone Cash"
                  }
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <div className="payment-content">
                  <div className="payment-title">
                    <img
                      src={vodafone}
                      alt="Vodafone Cash"
                    />

                    <span>Vodafone Cash</span>
                  </div>

                  <p>
                    Fast and secure online payment.
                  </p>
                </div>
              </label>
            </div>

            <button
              type="button"
              className="place-order-btn"
              onClick={placeOrder}
              disabled={loading}
            >
              {loading
                ? "Placing Order..."
                : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Checkout;