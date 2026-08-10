import "./Login.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // سيتم ربطه بالـ Backend لاحقًا
  };

  return (
    <main className="login-page">
      <div className="container">

        <div className="login-card">

          {/* Left Side */}

          <div className="login-banner">

            <div className="overlay">

              <h2>B-FIT</h2>

              <h3>Fuel Your Performance</h3>

              <p>
                Premium supplements made to help
                you reach your fitness goals.
              </p>

            </div>

          </div>

          {/* Right Side */}

          <div className="login-content">

            <span className="login-subtitle">
              Welcome Back 👋
            </span>

            <h1>Sign In</h1>

            <p className="login-text">
              Login to continue shopping.
            </p>

            <form onSubmit={handleSubmit}>

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

                <FaLock className="input-icon" />

                <input
                  type={showPassword ? "text" : "password"}
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

              <div className="login-options">

                <label>

                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                  />

                  Remember me

                </label>

                <Link to="/forgotpassword">
                  Forgot Password?
                </Link>

              </div>

              <button
                type="submit"
                className="login-btn"
              >
                Login
              </button>

            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            

            <p className="register-link">

              Don't have an account?{" "}

              <Link to="/register">
                Create Account
              </Link>

            </p>

          </div>

        </div>

      </div>
    </main>
  );
}

export default Login;