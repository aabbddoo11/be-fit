import "./SessionExpiredModal.css";
import { useNavigate } from "react-router-dom";
import { FiLock, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

function SessionExpiredModal() {
  const navigate = useNavigate();

  const {
    sessionExpired,
    clearSessionExpired,
  } = useAuth();

  if (!sessionExpired) {
    return null;
  }

  const handleLogin = () => {
    clearSessionExpired();
    navigate("/login");
  };

  // ⭐ إغلاق الإشعار والسماح للمستخدم بمتابعة التصفح
  const handleClose = () => {
    clearSessionExpired();
  };

  return (
    <div className="session-modal-overlay">

      <div className="session-modal">

        {/* ⭐ زر X لإغلاق الإشعار */}
        <button
          type="button"
          className="session-modal-close"
          onClick={handleClose}
          aria-label="Close notification"
        >
          <FiX />
        </button>

        <div className="session-modal-icon">
          <FiLock />
        </div>

        <h2>Session Expired</h2>

        <p>
          Your session has expired for security reasons.
          Please log in again to continue.
        </p>

        <button
          type="button"
          className="session-login-btn"
          onClick={handleLogin}
        >
          Login Again
        </button>

      </div>

    </div>
  );
}

export default SessionExpiredModal;