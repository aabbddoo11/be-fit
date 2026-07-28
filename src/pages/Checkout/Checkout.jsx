import "./Checkout.css";
import vodafone from "/vodafone.png";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
function Checkout() {
    const handleChange = (e) => {

  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });

};
const handleSubmit = (e) => {
  e.preventDefault();
  placeOrder();
};
const placeOrder = () => {

  const emptyField = Object.values(formData).some(
    value => value.trim() === ""
  );

  if (emptyField) {

    toast.error("Please fill in all billing details.");

    return;

  }

  toast.success("Order placed successfully!");

  clearCart();

  setTimeout(() => {

    navigate("/order-success");

  }, 1200);

};
const {
  cartItems,
  clearCart,
} = useCart();

const navigate = useNavigate();
const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  address: "",
  zip: "",
});
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal >= 2000 ? 0 : 100;

  const total = subtotal + shipping;

  const remainingForFreeShipping = Math.max(2000 - subtotal, 0);

  return (
    <main className="checkout-page">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Cart", link: "/cart" },
            { label: "Checkout" },
          ]}
        />

        <div className="checkout-header">
          <h1>Checkout</h1>

          <p>
            Complete your order by filling in your billing
            details below.
          </p>
        </div>

        <div className="checkout-layout">

          {/* Billing */}

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
    />

    <input
      type="text"
      name="lastName"
      value={formData.lastName}
      onChange={handleChange}
      placeholder="Last Name"
    />

  </div>

  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder="Email Address"
  />

  <input
    type="tel"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    placeholder="Phone Number"
  />

  <div className="form-row">

    <input
      type="text"
      name="country"
      value={formData.country}
      onChange={handleChange}
      placeholder="Country"
    />

    <input
      type="text"
      name="city"
      value={formData.city}
      onChange={handleChange}
      placeholder="City"
    />

  </div>

  <input
    type="text"
    name="address"
    value={formData.address}
    onChange={handleChange}
    placeholder="Street Address"
  />

  <input
    type="text"
    name="zip"
    value={formData.zip}
    onChange={handleChange}
    placeholder="ZIP Code"
  />

</form>

          </div>

          {/* Summary */}

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

            <div className="summary-row">

              <span>Subtotal</span>

              <strong>{subtotal} EGP</strong>

            </div>

            <div className="summary-row">

              <span>Shipping</span>

              <strong>
                {shipping === 0 ? "Free" : `${shipping} EGP`}
              </strong>

            </div>

            {shipping > 0 ? (

              <p className="shipping-note">

                Add{" "}

                <strong>
                  {remainingForFreeShipping} EGP
                </strong>

                {" "}more to get

                <span> FREE Shipping 🚚</span>

              </p>

            ) : (

              <p className="shipping-free">

                🎉 Congratulations! You have FREE Shipping.

              </p>

            )}

            <div className="summary-total">

              <span>Total</span>

              <strong>{total} EGP</strong>

            </div>

            {/* Payment */}

            <div className="payment-method">

              <h3>Payment Method</h3>

              <label className="payment-card">

                <input
                  type="radio"
                  name="payment"
                  defaultChecked
                />

                <div className="payment-content">

                  <div className="payment-title">
                    💵 Cash On Delivery
                  </div>

                  <p>
                    Pay when your order arrives at your address.
                  </p>

                </div>

              </label>

              <label className="payment-card">

                <input
                  type="radio"
                  name="payment"
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
>

  Place Order

</button>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Checkout;