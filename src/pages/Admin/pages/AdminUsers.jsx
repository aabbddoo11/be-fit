import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaSearch,
  FaSyncAlt,
  FaUser,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";

import { useAuth } from "../../../context/AuthContext";
import { getAdminUsers } from "../../../services/api";

import "./AdminUsers.css";

const AdminUsers = () => {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    if (!token) {
      setUsers([]);
      setError("Authentication token not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getAdminUsers(token);

      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      if (!term) {
        return matchesRole;
      }

      return (
        matchesRole &&
        [
          user.name,
          user.email,
          user.phone,
          user.role,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(term)
        )
      );
    });
  }, [users, search, roleFilter]);

  const customerCount = users.filter(
    (user) => user.role === "user"
  ).length;

  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  if (loading) {
    return (
      <div className="admin-users">
        <div className="admin-users-loading">
          <div className="admin-users-spinner" />
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-users">
        <div className="admin-users-header">
          <div>
            <span className="admin-users-subtitle">
              CUSTOMERS
            </span>

            <h2>Users</h2>

            <p>
              View and manage the accounts registered on your
              store.
            </p>
          </div>
        </div>

        <div className="admin-users-error">
          <FaUsers />

          <h3>Unable to load users</h3>

          <p>{error}</p>

          <button
            type="button"
            onClick={loadUsers}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users">

      {/* Header */}
      <div className="admin-users-header">
        <div>
          <span className="admin-users-subtitle">
            CUSTOMERS
          </span>

          <h2>Users</h2>

          <p>
            View the people who have registered on your B-FIT
            store.
          </p>
        </div>

        <button
          type="button"
          className="admin-users-refresh"
          onClick={loadUsers}
          aria-label="Refresh users"
        >
          <FaSyncAlt />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="admin-users-stats">

        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon">
            <FaUsers />
          </div>

          <span>Total Users</span>

          <strong>{users.length}</strong>
        </div>

        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon">
            <FaUser />
          </div>

          <span>Customers</span>

          <strong>{customerCount}</strong>
        </div>

        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon">
            <FaUserShield />
          </div>

          <span>Admins</span>

          <strong>{adminCount}</strong>
        </div>

      </div>

      {/* Toolbar */}
      <div className="admin-users-toolbar">

        <div className="admin-users-search">
          <FaSearch />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by name, email or phone..."
            aria-label="Search users"
          />
        </div>

        <div className="admin-users-toolbar-right">

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value)
            }
            className="admin-users-filter"
            aria-label="Filter users by role"
          >
            <option value="All">
              All roles
            </option>

            <option value="user">
              Customers
            </option>

            <option value="admin">
              Admins
            </option>
          </select>

          <span className="admin-users-count">
            {filteredUsers.length}{" "}
            {filteredUsers.length === 1
              ? "user"
              : "users"}
          </span>

        </div>
      </div>

      {/* Users Table */}
      <div className="admin-users-table-wrap">

        <table className="admin-users-table">

          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>

            {filteredUsers.length === 0 ? (

              <tr>
                <td colSpan="4">

                  <div className="admin-users-empty">
                    <FaUsers />

                    <strong>
                      No users found
                    </strong>

                    <span>
                      Try changing your search or
                      filter.
                    </span>
                  </div>

                </td>
              </tr>

            ) : (

              filteredUsers.map((user) => (

                <tr
                  key={user.id || user._id}
                >

                  <td>
                    <div className="admin-user-info">

                      <div className="admin-user-avatar">
                        <FaUser />
                      </div>

                      <div>
                        <strong>
                          {user.name ||
                            "Unnamed user"}
                        </strong>

                        <span>
                          ID:{" "}
                          {String(
                            user.id ||
                              user._id ||
                              ""
                          ).slice(-8)}
                        </span>
                      </div>

                    </div>
                  </td>

                  <td>
                    <div className="admin-user-contact">
                      <FaEnvelope />

                      <span>
                        {user.email || "—"}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div className="admin-user-contact">
                      <FaPhone />

                      <span>
                        {user.phone || "—"}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`admin-user-role ${
                        user.role === "admin"
                          ? "admin"
                          : "customer"
                      }`}
                    >
                      {user.role === "admin"
                        ? "Admin"
                        : "Customer"}
                    </span>
                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminUsers;