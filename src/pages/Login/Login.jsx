import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logIn } from "../../services/api";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const userData = {
        email: formData.email,
        password: formData.password,
      };

      const data = await logIn(userData);

      console.log("Login successful:", data);

     

      if (!data.token) {
        throw new Error("Login succeeded but no token was received.");
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      const storage = formData.remember
        ? localStorage
        : sessionStorage;

      storage.setItem("token", data.token);

      if (data.user) {
        storage.setItem("user", JSON.stringify(data.user));
      }

      setSuccess("Login successful!");

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message || "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
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

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            {success && (
              <p className="login-success">
                {success}
              </p>
            )}

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
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
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