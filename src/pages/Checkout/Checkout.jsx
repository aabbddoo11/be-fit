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


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    country: "",
    city: "",
    address: "",
    zip: "",
  });


  const [paymentMethod, setPaymentMethod] =
    useState("Cash On Deliverey");


  /*
  =========================
  Handle Form Changes
  =========================
  */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  /*
  =========================
  Submit
  =========================
  */

  const handleSubmit = (e) => {
    e.preventDefault();

    placeOrder();
  };


  /*
  =========================
  Place Order
  =========================
  */

  const placeOrder = async () => {

    /*
    Check Login
    */

    if (!isAuthenticated || !token) {

      toast.error(
        "Please login before placing your order."
      );

      navigate("/login");

      return;
    }


    /*
    Check Cart
    */

    if (cartItems.length === 0) {

      toast.error(
        "Your cart is empty."
      );

      navigate("/cart");

      return;
    }


    /*
    Check Required Fields
    */

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "country",
      "city",
      "address",
      "zip",
    ];


    const emptyField =
      requiredFields.some(
        (field) =>
          !formData[field].trim()
      );


    if (emptyField) {

      toast.error(
        "Please fill in all billing details."
      );

      return;
    }


    try {

      setLoading(true);


      /*
      Build Shipping Address
      */

      const shippingAddress = [
        `${formData.firstName} ${formData.lastName}`,
        formData.phone,
        formData.email,
        formData.country,
        formData.city,
        formData.address,
        formData.zip,
      ].join(", ");


      /*
      Send Checkout Request
      */

      const data = await checkout(
        token,
        {
          paymentMethod,
          shippingAddress,
        }
      );


      console.log(
        "Order created successfully:",
        data
      );


      /*
      Clear Cart
      */

      clearCart();


      /*
      Success Message
      */

      toast.success(
        "Order placed successfully!"
      );


      /*
      Navigate To Success Page
      */

      setTimeout(() => {

        navigate("/order-success");

      }, 1200);


    } catch (error) {

      console.error(
        "Checkout error:",
        error
      );


      toast.error(
        error.message ||
          "Something went wrong while placing your order."
      );


    } finally {

      setLoading(false);

    }
  };


  /*
  =========================
  Calculate Order
  =========================
  */

  const subtotal =
    cartItems.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0
    );


  const shipping =
    subtotal >= 2000
      ? 0
      : 100;


  const total =
    subtotal + shipping;


  const remainingForFreeShipping =
    Math.max(
      2000 - subtotal,
      0
    );


  /*
  =========================
  UI
  =========================
  */

  return (
    <main className="checkout-page">

      <div className="container">

        {/* Breadcrumb */}

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


        {/* Header */}

        <div className="checkout-header">

          <h1>
            Checkout
          </h1>

          <p>
            Complete your order by filling
            in your billing details below.
          </p>

        </div>


        {/* Layout */}

        <div className="checkout-layout">


          {/* =====================
              Billing Details
          ====================== */}

          <div className="billing-card">

            <h2>
              Billing Details
            </h2>


            <form
              className="checkout-form"
              onSubmit={handleSubmit}
            >


              {/* Name */}

              <div className="form-row">

                <input
                  type="text"
                  name="firstName"
                  value={
                    formData.firstName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="First Name"
                  required
                />


                <input
                  type="text"
                  name="lastName"
                  value={
                    formData.lastName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Last Name"
                  required
                />

              </div>


              {/* Email */}

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                placeholder="Email Address"
                required
              />


              {/* Phone */}

              <input
                type="tel"
                name="phone"
                value={
                  formData.phone
                }
                onChange={
                  handleChange
                }
                placeholder="Phone Number"
                required
              />


              {/* Country + City */}

              <div className="form-row">

                <input
                  type="text"
                  name="country"
                  value={
                    formData.country
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Country"
                  required
                />


                <input
                  type="text"
                  name="city"
                  value={
                    formData.city
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="City"
                  required
                />

              </div>


              {/* Address */}

              <input
                type="text"
                name="address"
                value={
                  formData.address
                }
                onChange={
                  handleChange
                }
                placeholder="Street Address"
                required
              />


              {/* ZIP */}

              <input
                type="text"
                name="zip"
                value={
                  formData.zip
                }
                onChange={
                  handleChange
                }
                placeholder="ZIP Code"
                required
              />


              {/* Hidden submit */}

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



          {/* =====================
              Order Summary
          ====================== */}

          <div className="summary-card">

            <h2>
              Order Summary
            </h2>


            {/* Products */}

            <div className="summary-products">

              {cartItems.map(
                (item) => (

                  <div
                    className="summary-product"
                    key={item.id}
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                    />


                    <div>

                      <h4>
                        {item.name}
                      </h4>


                      <span>
                        {item.quantity} ×{" "}
                        {item.price} EGP
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>


            {/* Subtotal */}

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                {subtotal} EGP
              </strong>

            </div>


            {/* Shipping */}

            <div className="summary-row">

              <span>
                Shipping
              </span>

              <strong>

                {shipping === 0
                  ? "Free"
                  : `${shipping} EGP`}

              </strong>

            </div>


            {/* Shipping Message */}

            {shipping > 0 ? (

              <p className="shipping-note">

                Add{" "}

                <strong>
                  {remainingForFreeShipping} EGP
                </strong>

                {" "}more to get

                <span>
                  {" "}FREE Shipping 🚚
                </span>

              </p>

            ) : (

              <p className="shipping-free">

                🎉 Congratulations!
                You have FREE Shipping.

              </p>

            )}


            {/* Total */}

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                {total} EGP
              </strong>

            </div>



            {/* =====================
                Payment Methods
            ====================== */}

            <div className="payment-method">

              <h3>
                Payment Method
              </h3>


              {/* Cash */}

              <label
                className="payment-card"
              >

                <input
                  type="radio"
                  name="payment"
                  value="Cash On Deliverey"
                  checked={
                    paymentMethod ===
                    "Cash On Deliverey"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />


                <div className="payment-content">

                  <div className="payment-title">

                    💵 Cash On Delivery

                  </div>


                  <p>
                    Pay when your order
                    arrives at your address.
                  </p>

                </div>

              </label>



              {/* Credit Card */}

              <label
                className="payment-card"
              >

                <input
                  type="radio"
                  name="payment"
                  value="Visa"
                  checked={
                    paymentMethod ===
                    "Visa"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />


                <div className="payment-content">

                  <div className="payment-title">

                    💳 Credit Card

                  </div>


                  <p>
                    Visa, Mastercard
                    and Meeza cards.
                  </p>

                </div>

              </label>



              {/* Vodafone Cash */}

              <label
                className="payment-card"
              >

                <input
                  type="radio"
                  name="payment"
                  value="Vodafone Cash"
                  checked={
                    paymentMethod ===
                    "Vodafone Cash"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />


                <div className="payment-content">

                  <div className="payment-title">

                    <img
                      src={vodafone}
                      alt="Vodafone Cash"
                    />

                    <span>
                      Vodafone Cash
                    </span>

                  </div>


                  <p>
                    Fast and secure
                    online payment.
                  </p>

                </div>

              </label>

            </div>



            {/* =====================
                Place Order
            ====================== */}

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