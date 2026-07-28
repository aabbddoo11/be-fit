import "./Footer.css";

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
  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-top">

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

          <div className="footer-links">

            <div>

              <h3>Shop</h3>

              <a href="">Protein</a>
              <a href="">Creatine</a>
              <a href="">Mass Gainer</a>
              <a href="">Pre Workout</a>

            </div>

            <div>

              <h3>Company</h3>

              <a href="/about">About</a>
              <a href="">Reviews</a>
              <a href="">Contact</a>
              <a href="">Blog</a>

            </div>

            <div>

              <h3>Support</h3>

              <a href="">Shipping</a>
              <a href="">Returns</a>
              <a href="">Privacy</a>
              <a href="">FAQ</a>

            </div>
            <div className="zzzzz"><p>
            © 2026 B-FIT. All Rights Reserved.
          </p></div>
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

        

      </div>

    </footer>
  );
}

export default Footer;