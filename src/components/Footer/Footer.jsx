import "./Footer.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
} from "react-icons/fa6";

function Footer() {
  const [email, setEmail] = useState("");
  const handleSubscribe = () => {

  if (!email.trim()) {
    toast.error("Please enter your email.");
    return;
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email.");
    return;
  }

  toast.success("🎉 Thanks for subscribing!");

  setEmail("");

};
  return (
    <footer className="footer">
<div className="container">

  <div className="footer-top">

    {/* About */}

    <div className="footer-about">

      <h2>B-FIT</h2>

      <p>
        Fuel your performance with premium sports nutrition
        trusted by athletes across Egypt.
      </p>

      <div className="footer-contact">

        <span>
          <FaLocationDot />
          Cairo, Egypt
        </span>

        <span>
          <FaPhone />
          +20 1095475930
        </span>

        <span>
          <FaEnvelope />
          manoo5521@gmail.com
        </span>

      </div>

    </div>

    {/* Links */}

    <div className="footer-links">

      <div>

        <h3>Shop</h3>

        <Link to="/shop?category=Protein">
  Protein
</Link>

<Link to="/shop?category=Creatine">
  Creatine
</Link>

<Link to="/shop?category=Mass Gainer">
  Mass Gainer
</Link>

<Link to="/shop?category=Pre Workout">
  Pre Workout
</Link>

      </div>

      <div>

        
      </div>

      <div>

        <h3>Support</h3>

        <a href="/Shipping">Shipping & Returns</a>
        <a href="/about">About us</a>

      </div>

    </div>

  </div>

  {/* Newsletter */}

  <div className="footer-newsletter">

    <h3>Stay Updated</h3>

    <p>
      Subscribe to receive exclusive offers,
      new arrivals and fitness tips.
    </p>

    <form
      className="newsletter-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubscribe();
      }}
    >

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button type="submit">
        Subscribe
      </button>

    </form>

  </div>

  {/* Bottom */}

  <div className="footer-bottom">

    <p>
      © {new Date().getFullYear()} B-FIT.
      <br />
      All Rights Reserved.
    </p>

    <div className="socials">

      <a href="#">
        <FaFacebookF />
      </a>

      <a href="#">
        <FaInstagram />
      </a>

      <a href="#">
        <FaTiktok />
      </a>

      <a href="#">
        <FaXTwitter />
      </a>

    </div>

  </div>

</div>
    </footer>
  );
}

export default Footer;