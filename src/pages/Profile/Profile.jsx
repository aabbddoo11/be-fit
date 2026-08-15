import "./Profile.css";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FiUser,
  FiPackage,
  FiHeart,
  FiLogOut,
  FiChevronRight,
  FiEdit2,
  FiSave,
  FiX,
} from "react-icons/fi";

import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../services/api";

function Profile() {
  const {
    user,
    token,
    logout,
    updateUser,
  } = useAuth();

  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });

    setEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });

    setEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error(
        "Your session has expired. Please login again."
      );

      return;
    }

    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setSaving(true);

      const data = await updateProfile(
        token,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        }
      );

      if (data?.user) {
        updateUser(data.user);
      }

      setEditing(false);

      toast.success(
        "Your profile has been updated successfully. ✓"
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();

    toast.success(
      "You have been logged out successfully. 👋"
    );

    navigate("/");
  };

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

          <h1>
            Welcome, {user?.name || "User"}
          </h1>

          <p>
            Manage your account, orders and favorite
            products.
          </p>

        </div>

        <section className="profile-content">

          <div className="profile-card profile-user-card">

            <div className="profile-card-icon">
              <FiUser />
            </div>

            <div className="profile-card-content">

              <div className="profile-card-heading">

                <span className="profile-card-label">
                  PERSONAL INFORMATION
                </span>

                {!editing && (
                  <button
                    type="button"
                    className="profile-edit-btn"
                    onClick={handleEdit}
                  >
                    <FiEdit2 />
                    Edit Profile
                  </button>
                )}

              </div>

              {!editing ? (
                <>
                  <h2>
                    {user?.name || "User"}
                  </h2>

                  <div className="profile-info">

                    <div>
                      <span>Email</span>

                      <strong>
                        {user?.email ||
                          "Not available"}
                      </strong>
                    </div>

                    <div>
                      <span>Phone</span>

                      <strong>
                        {user?.phone ||
                          "Not available"}
                      </strong>
                    </div>

                  </div>
                </>
              ) : (
                <form
                  className="profile-edit-form"
                  onSubmit={handleSubmit}
                >

                  <div className="profile-form-group">

                    <label htmlFor="name">
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      disabled={saving}
                    />

                  </div>

                  <div className="profile-form-group">

                    <label htmlFor="email">
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      disabled={saving}
                    />

                  </div>

                  <div className="profile-form-group">

                    <label htmlFor="phone">
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      disabled={saving}
                    />

                  </div>

                  <div className="profile-edit-actions">

                    <button
                      type="submit"
                      className="profile-save-btn"
                      disabled={saving}
                    >
                      <FiSave />

                      {saving
                        ? "Saving..."
                        : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      className="profile-cancel-btn"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      <FiX />
                      Cancel
                    </button>

                  </div>

                </form>
              )}

            </div>

          </div>

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

            <FiChevronRight
              className="profile-action-arrow"
            />

          </Link>

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

            <FiChevronRight
              className="profile-action-arrow"
            />

          </Link>

          <button
            type="button"
            className="profile-action-card profile-logout-card"
            onClick={handleLogout}
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

            <FiChevronRight
              className="profile-action-arrow"
            />

          </button>

        </section>

      </div>
    </main>
  );
}

export default Profile;