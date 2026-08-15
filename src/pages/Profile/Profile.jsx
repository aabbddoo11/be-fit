
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
  FiChevronDown,
  FiEdit2,
  FiSave,
  FiX,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useAuth } from "../../context/AuthContext";
import {
  updateProfile,
  changePassword,
} from "../../services/api";

function Profile() {
  const { user, token, logout, updateUser } = useAuth();

  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Password accordion
  const [passwordOpen, setPasswordOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changingPassword, setChangingPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Your session has expired. Please login again.");
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

      const data = await updateProfile(token, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });

      if (data?.user) {
        updateUser(data.user);
      }

      setEditing(false);

      toast.success(
        "Your profile has been updated successfully. ✓"
      );
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error.message || "Failed to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Your session has expired. Please login again.");
      return;
    }

    const currentPassword = passwordData.currentPassword.trim();
    const newPassword = passwordData.newPassword;
    const confirmPassword = passwordData.confirmPassword;

    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      toast.error("Please enter your new password.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error(
        "New password must be at least 8 characters long."
      );
      return;
    }

    if (currentPassword === newPassword) {
      toast.error(
        "New password must be different from your current password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "New password and confirmation do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);

      await changePassword(
        token,
        currentPassword,
        newPassword
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      setPasswordOpen(false);

      toast.success(
        "Your password has been changed successfully. ✓"
      );
    } catch (error) {
      console.error("Change password error:", error);

      toast.error(
        error.message || "Failed to change your password."
      );
    } finally {
      setChangingPassword(false);
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


          {/* Change Password */}
          <div
            className={`profile-card profile-password-card ${
              passwordOpen ? "password-open" : ""
            }`}
          >

            <div className="profile-card-icon">
              <FiLock />
            </div>

            <div className="profile-card-content">

              {/* Clickable header */}
              <button
                type="button"
                className="profile-password-header"
                onClick={() =>
                  setPasswordOpen((prev) => !prev)
                }
                aria-expanded={passwordOpen}
              >

                <div className="profile-password-title">

                  <span className="profile-card-label">
                    SECURITY
                  </span>

                  <h2>
                    Change Password
                  </h2>

                  {!passwordOpen && (
                    <p className="profile-password-description">
                      Update your password to keep your
                      B-FIT account secure.
                    </p>
                  )}

                </div>

                <FiChevronDown
                  className={`profile-password-chevron ${
                    passwordOpen ? "open" : ""
                  }`}
                />

              </button>


              {/* Dropdown content */}
              <div
                className={`profile-password-dropdown ${
                  passwordOpen ? "open" : ""
                }`}
              >

                <div className="profile-password-dropdown-inner">

                  <form
                    className="profile-password-form"
                    onSubmit={handlePasswordSubmit}
                  >

                    <div className="profile-form-group">

                      <label htmlFor="currentPassword">
                        Current Password
                      </label>

                      <div className="profile-password-input">

                        <input
                          id="currentPassword"
                          name="currentPassword"
                          type={
                            showCurrentPassword
                              ? "text"
                              : "password"
                          }
                          value={
                            passwordData.currentPassword
                          }
                          onChange={handlePasswordChange}
                          autoComplete="current-password"
                          disabled={changingPassword}
                        />

                        <button
                          type="button"
                          className="profile-password-toggle"
                          onClick={() =>
                            setShowCurrentPassword(
                              (prev) => !prev
                            )
                          }
                          tabIndex="-1"
                          aria-label={
                            showCurrentPassword
                              ? "Hide current password"
                              : "Show current password"
                          }
                        >
                          {showCurrentPassword ? (
                            <FiEyeOff />
                          ) : (
                            <FiEye />
                          )}
                        </button>

                      </div>

                    </div>


                    <div className="profile-form-group">

                      <label htmlFor="newPassword">
                        New Password
                      </label>

                      <div className="profile-password-input">

                        <input
                          id="newPassword"
                          name="newPassword"
                          type={
                            showNewPassword
                              ? "text"
                              : "password"
                          }
                          value={
                            passwordData.newPassword
                          }
                          onChange={handlePasswordChange}
                          autoComplete="new-password"
                          disabled={changingPassword}
                        />

                        <button
                          type="button"
                          className="profile-password-toggle"
                          onClick={() =>
                            setShowNewPassword(
                              (prev) => !prev
                            )
                          }
                          tabIndex="-1"
                          aria-label={
                            showNewPassword
                              ? "Hide new password"
                              : "Show new password"
                          }
                        >
                          {showNewPassword ? (
                            <FiEyeOff />
                          ) : (
                            <FiEye />
                          )}
                        </button>

                      </div>

                      <small>
                        Password must be at least 8 characters.
                      </small>

                    </div>


                    <div className="profile-form-group">

                      <label htmlFor="confirmPassword">
                        Confirm New Password
                      </label>

                      <div className="profile-password-input">

                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={
                            passwordData.confirmPassword
                          }
                          onChange={handlePasswordChange}
                          autoComplete="new-password"
                          disabled={changingPassword}
                        />

                        <button
                          type="button"
                          className="profile-password-toggle"
                          onClick={() =>
                            setShowConfirmPassword(
                              (prev) => !prev
                            )
                          }
                          tabIndex="-1"
                          aria-label={
                            showConfirmPassword
                              ? "Hide password confirmation"
                              : "Show password confirmation"
                          }
                        >
                          {showConfirmPassword ? (
                            <FiEyeOff />
                          ) : (
                            <FiEye />
                          )}
                        </button>

                      </div>

                    </div>


                    <button
                      type="submit"
                      className="profile-password-btn"
                      disabled={changingPassword}
                    >
                      <FiLock />

                      {changingPassword
                        ? "Changing Password..."
                        : "Change Password"}
                    </button>

                    <button
                      type="button"
                      className="profile-password-cancel"
                      onClick={() => {
                        setPasswordOpen(false);

                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });

                        setShowCurrentPassword(false);
                        setShowNewPassword(false);
                        setShowConfirmPassword(false);
                      }}
                      disabled={changingPassword}
                    >
                      <FiX />
                      Cancel
                    </button>

                  </form>

                </div>

              </div>

            </div>

          </div>


          {/* Orders */}
          <Link
            to="/orders"
            className="profile-action-card"
          >

            <div className="profile-action-icon">
              <FiPackage />
            </div>

            <div className="profile-action-content">

              <h2>
                My Orders
              </h2>

              <p>
                View and track all your orders.
              </p>

            </div>

            <FiChevronRight
              className="profile-action-arrow"
            />

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

              <h2>
                Favorites
              </h2>

              <p>
                View the products you saved.
              </p>

            </div>

            <FiChevronRight
              className="profile-action-arrow"
            />

          </Link>


          {/* Logout */}
          <button
            type="button"
            className="profile-action-card profile-logout-card"
            onClick={handleLogout}
          >

            <div className="profile-action-icon">
              <FiLogOut />
            </div>

            <div className="profile-action-content">

              <h2>
                Logout
              </h2>

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

