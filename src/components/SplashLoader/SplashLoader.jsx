import "./SplashLoader.css";
import logo from "../../assets/logo/logo.png";

function SplashLoader() {
  return (
    <div className="splash-loader">

      <div className="loader-content">

        <img
          src={logo}
          alt="B-FIT"
          className="loader-logo"
        />

        <div className="loader-spinner"></div>

        <h2>B-FIT</h2>

        <p>
          Preparing your supplements...
        </p>

      </div>

    </div>
  );
}

export default SplashLoader;