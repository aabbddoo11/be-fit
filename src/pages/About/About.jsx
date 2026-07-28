import "./About.css";
import image from '/about-story.jpg';
import {
    FaShippingFast,
    FaShieldAlt,
    FaMedal,
    FaHeadset
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
function About() {const navigate = useNavigate();
  return (
    <main className="about">

      {/* Hero */}
      <section className="about-hero">
        <div className="container">

          <span>ABOUT US</span>

          <h1>
            Fueling Your Fitness Journey is our Goal.
          </h1>

          <p>
            We provide premium supplements from trusted brands to help
            athletes and fitness enthusiasts achieve their goals with
            confidence.
          </p>

        </div>
      </section>
{/* Story */}

<section className="about-story">

  <div className="container story-container">

    <div className="story-content">

      <span>OUR STORY</span>

      <h2>
        Passion For Health,
        Commitment To Quality
      </h2>

      <p>
        At B-FIT, we believe everyone deserves access to genuine,
        high-quality supplements. Our mission is to provide trusted
        products from leading brands while delivering an exceptional
        shopping experience.
      </p>

      <p>
        Whether you're building muscle, losing weight or improving your
        overall wellness, we're here to support your journey with premium
        nutrition and reliable service.
      </p>

    </div>

    <div className="story-image">

      <img
        src={image}
        alt="About B-FIT"
      />

    </div>

  </div>

</section>
{/* Why Choose Us */}

<section className="about-features">

  <div className="container">

    <span>WHY CHOOSE US</span>

    <h2>Why Thousands Choose B-FIT</h2>

    <p className="section-text">
      We are committed to providing premium supplements,
      exceptional customer service and a reliable shopping experience.
    </p>

    <div className="features-grid">

      <div className="feature-box">
        <div className="feature-icon"><FaMedal /></div>

        <h3>Premium Quality</h3>

        <p>
          Genuine supplements from trusted international brands.
        </p>
      </div>

      <div className="feature-box">
        <div className="feature-icon"><FaShippingFast /></div>

        <h3>Fast Delivery</h3>

        <p>
          Quick shipping across Egypt with secure packaging.
        </p>
      </div>

      <div className="feature-box">
        <div className="feature-icon"><FaShieldAlt /></div>

        <h3>Secure Payments</h3>

        <p>
          Safe checkout and protected online transactions.
        </p>
      </div>

      <div className="feature-box">
        <div className="feature-icon"><FaHeadset /></div>

        <h3>Fitness Experts</h3>

        <p>
          Professional guidance to help you choose the right products.
        </p>
      </div>

    </div>

  </div>

</section>
{/* Statistics */}

<section className="about-stats">

  <div className="container">

    <div className="stat-card">

      <h2>5000+</h2>

      <p>Happy Customers</p>

    </div>

    <div className="stat-card">

      <h2>150+</h2>

      <p>Premium Products</p>

    </div>

    <div className="stat-card">

      <h2>25+</h2>

      <p>Trusted Brands</p>

    </div>

    <div className="stat-card">

      <h2>98%</h2>

      <p>Customer Satisfaction</p>

    </div>

  </div>

</section>{/* CTA */}

<section className="about-cta">

  <div className="container">

    <h2>
      Ready To Start Your Fitness Journey?
    </h2>

    <p>
      Discover premium supplements trusted by thousands of athletes.
      Start building your best version today.
    </p>

    <button
      onClick={() => navigate("/shop")}
      className="cta-btn"
    >
      Shop Now
    </button>

  </div>

</section>
    </main>
  );
}

export default About;