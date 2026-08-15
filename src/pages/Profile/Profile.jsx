import "./Profile.css";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiPackage,
  FiHeart,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useAuth } from "../../context/AuthContext";

function Profile() {
  const { user, logout } = useAuth();

  return (
    <main className="profile-page">
      <div className="container">

        <Breadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "My Account" },
          ]}
        />

        <div className="profile-header">

          <span className="profile-subtitle">
            MY ACCOUNT
          </span>

          <h1>Welcome, {user?.name || "User"}</h1>

          <p>
            Manage your account, orders and favorite products.
          </p>

        </div>

        <section className="profile-content">

          {/* Personal Information */}

          <div className="profile-card profile-user-card">

            <div className="profile-card-icon">
              <FiUser />
            </div>

            <div className="profile-card-content">

              <span className="profile-card-label">
                PERSONAL INFORMATION
              </span>

              <h2>{user?.name || "User"}</h2>

              <div className="profile-info">

                <div>
                  <span>Email</span>
                  <strong>
                    {user?.email || "Not available"}
                  </strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>
                    {user?.phone || "Not available"}
                  </strong>
                </div>

              </div>

            </div>

          </div>


          {/* My Orders */}

          <Link
            to="/orders"
            className="profile-action-card"
          >

            <div className="profile-action-icon">
              <FiPackage />
            </div>

            <div className="profile-action-content">

              <h2>My Orders</h2>

              <p>
                View and track all your orders.
              </p>

            </div>

            <FiChevronRight className="profile-action-arrow" />

          </Link>


          {/* Favorites */}

          <Link
            to="/favorites"
            className="profile-action-card"
          >

            <div className="profile-action-icon">
              <FiHeart />
            </div>

            <div className="profile-action-content">

              <h2>Favorites</h2>

              <p>
                View the products you saved.
              </p>

            </div>

            <FiChevronRight className="profile-action-arrow" />

          </Link>


          {/* Logout */}

          <button
            type="button"
            className="profile-action-card profile-logout-card"
            onClick={logout}
          >

            <div className="profile-action-icon">
              <FiLogOut />
            </div>

            <div className="profile-action-content">

              <h2>Logout</h2>

              <p>
                Sign out of your B-FIT account.
              </p>

            </div>

            <FiChevronRight className="profile-action-arrow" />

          </button>

        </section>

      </div>
    </main>
  );
}

export default Profile;