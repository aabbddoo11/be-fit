import "./Cart.css";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

function Cart() {

  const navigate = useNavigate();

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const shipping = subtotal >= 2000 ? 0 : 100;

  const total = subtotal + shipping;

  const remainingForFreeShipping = Math.max(
    2000 - subtotal,
    0
  );

  return (

    <main className="cart-page">

      <div className="container">

        <Breadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Cart" },
          ]}
        />

        <h1>Shopping Cart</h1>

        {cartItems.length === 0 ? (

          <div className="empty-cart">

            <div className="empty-cart-icon">
              🛒
            </div>

            <h2>Your Cart is Empty</h2>

            <p>
              Looks like you haven't added any products yet.
              Start exploring our premium supplements and
              discover the perfect products for your fitness journey.
            </p>

            <Link
              to="/shop"
              className="continue-shopping-btn"
            >
              Start Shopping
            </Link>

          </div>

        ) : (

          <>

            <div className="cart-items">

              {cartItems.map((item) => (

                <div
                  className="cart-item"
                  key={item.id}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="cart-info">

                    <h3>{item.name}</h3>

                    <p>{item.price} EGP</p>

                  </div>

                  <div className="cart-quantity">

                    <button
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                    >
                      +
                    </button>

                  </div>

                  <h4>

                    {item.price * item.quantity} EGP

                  </h4>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                   ✕  

                  </button>

                </div>

              ))}

            </div>

            <div className="cart-summary">

              <h2>Order Summary</h2>

              <div>

                <span>Subtotal</span>

                <strong>{subtotal} EGP</strong>

              </div>

              <div>

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

              <div className="total">

                <span>Total</span>

                <strong>{total} EGP</strong>

              </div>

              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed To Checkout
              </button>

            </div>

          </>

        )}

      </div>

    </main>

  );

}

export default Cart;