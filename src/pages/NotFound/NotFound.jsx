import "./NotFound.css";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSearch } from "react-icons/fi";

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <span className="not-found-label">
            PAGE NOT FOUND
          </span>

          <h1>404</h1>

          <h2>Oops! Page Not Found</h2>

          <p>
            The page you are looking for does not exist,
            has been moved, or the URL may be incorrect.
          </p>

          <div className="not-found-actions">
            <button
              type="button"
              className="not-found-primary-btn"
              onClick={() => navigate("/")}
            >
              <FiArrowLeft />
              <span>Back To Home</span>
            </button>

            <button
              type="button"
              className="not-found-secondary-btn"
              onClick={() => navigate("/shop")}
            >
              <FiSearch />
              <span>Browse Products</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default NotFound;