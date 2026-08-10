import "./Shipping.css";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useState } from "react";
function Shipping() {
    const [openFAQ, setOpenFAQ] = useState(null);

const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Orders inside Cairo & Giza are delivered within 1–2 business days, while other governorates usually take 2–5 business days.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order has been shipped, you'll receive a tracking number via email or SMS.",
  },
  {
    question: "Do you offer free shipping?",
    answer:
      "Yes. Orders over 1000 EGP qualify for free shipping.",
  },
  {
    question: "Can I return opened supplements?",
    answer:
      "No. Opened supplements cannot be returned for health and safety reasons.",
  },
];
  return (
    <main className="shipping-page">

      <div className="container">

        <Breadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Shipping & Returns" }
          ]}
        />

        <section className="shipping-hero">

          <span className="section-tag">
            SHIPPING INFORMATION
          </span>

          <h1>
            Shipping & Returns
          </h1>

          <p>
            We make every effort to deliver your order quickly,
            securely, and hassle-free. Learn everything about
            our shipping process and return policy below.
          </p>

        </section>
<section className="shipping-cards">

  <div className="shipping-card">

    <div className="shipping-icon">🚚</div>

    <h3>Free Shipping</h3>

    <p>
      Enjoy free shipping on all orders over
      <strong> 1000 EGP</strong>.
    </p>

  </div>

  <div className="shipping-card">

    <div className="shipping-icon">📦</div>

    <h3>Order Processing</h3>

    <p>
      Orders are carefully packed and dispatched
      within 24 hours.
    </p>

  </div>

  <div className="shipping-card">

    <div className="shipping-icon">⏱️</div>

    <h3>Delivery Time</h3>

    <p>
      Cairo & Giza: 1–2 Business Days.
      Other Governorates: 2–5 Business Days.
    </p>

  </div>

  <div className="shipping-card">

    <div className="shipping-icon">📍</div>

    <h3>Order Tracking</h3>

    <p>
      Every order includes a tracking number so
      you can follow your shipment anytime.
    </p>

  </div>

</section>
<section className="delivery-process">

  <div className="section-heading">

    <span className="section-tag">
      DELIVERY PROCESS
    </span>

    <h2>How Your Order Reaches You</h2>

    <p>
      Every order goes through a simple and secure
      process before arriving at your doorstep.
    </p>

  </div>

  <div className="timeline">

    <div className="timeline-item">

      <div className="timeline-circle">🛒</div>

      <h3>Order Placed</h3>

      <p>
        Your order is confirmed immediately after
        checkout.
      </p>

    </div>

    <div className="timeline-line"></div>

    <div className="timeline-item">

      <div className="timeline-circle">📦</div>

      <h3>Processing</h3>

      <p>
        We carefully inspect and pack your products.
      </p>

    </div>

    <div className="timeline-line"></div>

    <div className="timeline-item">

      <div className="timeline-circle">🚚</div>

      <h3>Shipped</h3>

      <p>
        Your package is handed to our delivery partner.
      </p>

    </div>

    <div className="timeline-line"></div>

    <div className="timeline-item">

      <div className="timeline-circle">🏠</div>

      <h3>Delivered</h3>

      <p>
        Enjoy your supplements and start your journey.
      </p>

    </div>

  </div>

</section>
<section className="returns-section">

  <div className="section-heading">

    <span className="section-tag">
      RETURN POLICY
    </span>

    <h2>Easy Returns & Exchanges</h2>

    <p>
      We want you to shop with confidence. If you're not
      completely satisfied, our return process is simple
      and transparent.
    </p>

  </div>

  <div className="returns-grid">

    <div className="return-card">

      <div className="return-icon">📅</div>

      <h3>14-Day Returns</h3>

      <p>
        You can request a return within 14 days of
        receiving your order.
      </p>

    </div>

    <div className="return-card">

      <div className="return-icon">📦</div>

      <h3>Original Condition</h3>

      <p>
        Products must be unopened, unused and in
        their original packaging.
      </p>

    </div>

    <div className="return-card">

      <div className="return-icon">💳</div>

      <h3>Refunds</h3>

      <p>
        Approved refunds are processed after the
        returned item has been inspected.
      </p>

    </div>

    <div className="return-card">

      <div className="return-icon">🔄</div>

      <h3>Easy Exchange</h3>

      <p>
        Damaged or incorrect products can be replaced
        quickly at no extra cost.
      </p>

    </div>

  </div>

</section>
<section className="non-returnable">

  <div className="non-returnable-box">

    <h2>Items That Cannot Be Returned</h2>

    <p>
      For health and safety reasons, we cannot accept
      returns for the following items:
    </p>

    <div className="non-return-grid">

      <div className="non-return-item">
        ❌ Opened supplements
      </div>

      <div className="non-return-item">
        ❌ Used products
      </div>

      <div className="non-return-item">
        ❌ Products without original packaging
      </div>

      

    </div>

  </div>

</section>
<section className="faq-section">

  <div className="section-heading">

    <span className="section-tag">
      FAQ
    </span>

    <h2>Frequently Asked Questions</h2>

    <p>
      Find quick answers to the most common questions.
    </p>

  </div>

  <div className="faq-container">

    {faqs.map((faq, index) => (

      <div
        className={`faq-item ${
          openFAQ === index ? "active" : ""
        }`}
        key={index}
      >

        <button
          className="faq-question"
          onClick={() =>
            setOpenFAQ(
              openFAQ === index ? null : index
            )
          }
        >

          {faq.question}

          <span>
            {openFAQ === index ? "⇧" : "⇩"}
          </span>

        </button>

        {openFAQ === index && (

          <div className="faq-answer">

            <p>{faq.answer}</p>

          </div>

        )}

      </div>

    ))}

  </div>

</section>
      </div>

    </main>
  );
}

export default Shipping;