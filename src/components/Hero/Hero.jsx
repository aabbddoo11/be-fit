import "./Hero.css";
import { useNavigate } from "react-router-dom";
function Hero() {const navigate = useNavigate();
  return (
    <section className="hero">

      <div className="container hero-container">

        <div className="hero-content">

          <span className="hero-badge">
            PREMIUM SPORTS NUTRITION
          </span>

          <h1>
            Fuel Your
            <span> Best Performance</span>
          </h1>

          <p>
            Discover premium supplements designed to help you
            build muscle, increase strength, and recover faster.
          </p>

          <div className="hero-buttons">

            <button
  className="primary-btn"
  onClick={() => navigate("/shop")}
>
  Shop Now
</button>

<button
  className="secondary-btn"
  onClick={() => navigate("/shop")}
>
  Explore
</button>

          </div>

          <div className="hero-stats">

            <div>
              <h3>10K+</h3>
              <span>Happy Customers</span>
            </div>

            <div>
              <h3>500+</h3>
              <span>Products</span>
            </div>

            <div>
              <h3>4.9★</h3>
              <span>Rating</span>
            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="hero-image">

          <div className="circle"></div>

          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900"
            alt="Athlete"
          />

        </div>

      </div>

    </section>
  );
}

export default Hero;