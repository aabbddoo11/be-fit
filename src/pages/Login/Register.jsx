import "./Register.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // سيتم ربطه بالـ Backend لاحقًا
  };

  return (
    <main className="register-page">
      <div className="container">

        <div className="register-card">

          {/* Left Side */}

          <div className="register-banner">

            <div className="overlay">

              <h2>B-FIT</h2>

              <h3>Join The Community</h3>

              <p>
                Create your account and start
                your fitness journey with premium
                supplements and exclusive offers.
              </p>

            </div>

          </div>

          {/* Right Side */}

          <div className="register-content">

            <span className="register-subtitle">
              Welcome 👋
            </span>

            <h1>Create Account</h1>

            <p className="register-text">
              Fill in your information to get
              started.
            </p>

            <form onSubmit={handleSubmit}>

              <div className="input-group">

                <FaUser className="input-icon" />

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="input-group">

                <FaEnvelope className="input-icon" />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="input-group">

                <FaPhone className="input-icon" />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="input-group">

                <FaLock className="input-icon" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="toggle-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

              <div className="input-group">

                <FaLock className="input-icon" />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="toggle-password"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

              <div className="register-options">

                <label>

                  <input
                    type="checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    required
                  />

                  I agree to the Terms &
                  Conditions

                </label>

              </div>

              <button
                type="submit"
                className="register-btn"
              >
                Create Account
              </button>

            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <button className="google-btn">
              Continue with Google
            </button>

            <p className="login-link">

              Already have an account?{" "}

              <Link to="/login">
                Login
              </Link>

            </p>

          </div>

        </div>

      </div>
    </main>
  );
}

export default Register;