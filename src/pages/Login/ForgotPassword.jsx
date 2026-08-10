import "./ForgotPassword.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

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

    toast.success(
      "Password reset link sent successfully!"
    );

    setEmail("");
  };

  return (
    <main className="forgot-page">
      <div className="container">

        <div className="forgot-card">

          {/* Left Side */}

          <div className="forgot-banner">

            <div className="overlay">

              <h2>B-FIT</h2>

              <h3>Forgot Your Password?</h3>

              <p>
                No worries.
                Enter your email and we'll send
                you a password reset link.
              </p>

            </div>

          </div>

          {/* Right Side */}

          <div className="forgot-content">

            <span className="forgot-subtitle">
              Password Recovery
            </span>

            <h1>Reset Password</h1>

            <p className="forgot-text">
              Enter the email associated with
              your account.
            </p>

            <form onSubmit={handleSubmit}>

              <div className="input-group">

                <FaEnvelope className="input-icon" />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

              <button
                className="forgot-btn"
                type="submit"
              >
                Send Reset Link
              </button>

            </form>

            <p className="back-login">

              Remember your password?{" "}

              <Link to="/login">
                Back to Login
              </Link>

            </p>

          </div>

        </div>

      </div>
    </main>
  );
}

export default ForgotPassword;