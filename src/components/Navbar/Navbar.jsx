import { useFavorite } from "../../context/FavoriteContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiPackage,
  FiLogOut,
  FiUserCheck,
  FiGrid,
} from "react-icons/fi";

import logo from "../../assets/logo/logo.png";

import { products } from "../../data/allproducts";

function Navbar() {
  const navigate = useNavigate();

  const { favorites } = useFavorite();
  const { cartItems } = useCart();

  const { user, isAuthenticated, logout } = useAuth();

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const mobileSearchRef = useRef(null);
  const desktopAccountMenuRef = useRef(null);
  const mobileAccountMenuRef = useRef(null);

  const isAdmin = user?.role === "admin";

  const handleSearch = () => {
    if (!search.trim()) return;

    navigate(`/shop?search=${encodeURIComponent(search.trim())}`);

    setMenuOpen(false);
    setSuggestions([]);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    setSearch(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const searchValue = value.toLowerCase().trim();

    const filtered = products.filter((product) => {
      const searchableFields = [
        product.name,
        product.brand,
        product.category,
        product.type,
        product.flavor,
        product.weight,
        product.description,
      ];

      return searchableFields.some((field) =>
        String(field || "")
          .toLowerCase()
          .includes(searchValue)
      );
    });

    setSuggestions(filtered.slice(0, 5));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mobileSearchOpen &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      ) {
        setMobileSearchOpen(false);
      }

      const clickedInsideDesktop =
        desktopAccountMenuRef.current?.contains(e.target);

      const clickedInsideMobile =
        mobileAccountMenuRef.current?.contains(e.target);

      if (
        accountMenuOpen &&
        !clickedInsideDesktop &&
        !clickedInsideMobile
      ) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileSearchOpen, accountMenuOpen]);

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setAccountMenuOpen((prev) => !prev);
  };

  const handleDashboardClick = () => {
    setAccountMenuOpen(false);
    setMenuOpen(false);
    navigate("/admin/dashboard");
  };

  const handleLogout = () => {
    logout();

    setAccountMenuOpen(false);
    setLogoutSuccess(true);

    setTimeout(() => {
      navigate("/");
      setLogoutSuccess(false);
    }, 1200);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);

    setSuggestions([]);
    setSearch("");
    setMobileSearchOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container">
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <Link to="/" className="logo">
          <img src={logo} alt="B-FIT Logo" />
        </Link>

        <nav className={menuOpen ? "nav active" : "nav"}>
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/shop"
            onClick={() => setMenuOpen(false)}
          >
            Shop
          </Link>

          <Link
            to="/favorites"
            className="mobile-only"
            onClick={() => setMenuOpen(false)}
          >
            ❤️ Favorites
          </Link>

          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>

          <Link
            to="/shipping"
            onClick={() => setMenuOpen(false)}
          >
            Shipping & Returns
          </Link>
        </nav>

        <div className="actions desktop-actions">
          <div className="group">
            <input
              type="text"
              className="input"
              placeholder="Search..."
              value={search}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            {suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    className="suggestion-item"
                    onClick={() => handleProductClick(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <div className="suggestion-info">
                      <h4>{product.name}</h4>

                      {product.brand && (
                        <small>{product.brand}</small>
                      )}

                      {product.category && (
                        <small>{product.category}</small>
                      )}

                      <span>{product.price} EGP</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
            disabled={!search.trim()}
          >
            <FiSearch />
          </button>

          <Link to="/favorites">
            <button className="favorite-btn">
              <FiHeart />

              {favorites.length > 0 && (
                <span>{favorites.length}</span>
              )}
            </button>
          </Link>

          <button
            className="cart"
            onClick={() => navigate("/cart")}
          >
            <FiShoppingCart />

            {totalQuantity > 0 && (
              <span>{totalQuantity}</span>
            )}
          </button>

          <div
            className="account-wrapper"
            ref={desktopAccountMenuRef}
          >
            <button
              className={`user-btn ${
                isAuthenticated ? "logged-in" : ""
              }`}
              onClick={handleAccountClick}
              aria-label="Account"
            >
              <FiUser />
            </button>

            {isAuthenticated && accountMenuOpen && (
              <div className="account-dropdown">
                <div className="account-header">
                  <div className="account-avatar">
                    <FiUser />
                  </div>

                  <div>
                    <strong>
                      {user?.name || "User"}
                    </strong>

                    <span>
                      {user?.email || ""}
                    </span>
                  </div>
                </div>

                <div className="account-divider" />

                <button
                  className="account-item"
                  onClick={() => {
                    setAccountMenuOpen(false);
                    navigate("/account");
                  }}
                >
                  <FiUserCheck />

                  <span>My Account</span>
                </button>

                <button
                  className="account-item"
                  onClick={() => {
                    setAccountMenuOpen(false);
                    navigate("/orders");
                  }}
                >
                  <FiPackage />

                  <span>My Orders</span>
                </button>

                {isAdmin && (
                  <>
                    <div className="account-divider" />

                    <button
                      className="account-item admin-dashboard-item"
                      onClick={handleDashboardClick}
                    >
                      <FiGrid />

                      <span>Dashboard</span>
                    </button>
                  </>
                )}

                <div className="account-divider" />

                <button
                  className="account-item logout-item"
                  onClick={handleLogout}
                >
                  <FiLogOut />

                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mobile-actions">
          <button
            onClick={() => setMobileSearchOpen(true)}
          >
            <FiSearch />
          </button>

          <button
            className="cart"
            onClick={() => navigate("/cart")}
          >
            <FiShoppingCart />

            {totalQuantity > 0 && (
              <span>{totalQuantity}</span>
            )}
          </button>

          <div
            className="account-wrapper"
            ref={mobileAccountMenuRef}
          >
            <button
              className={`user-btn ${
                isAuthenticated ? "logged-in" : ""
              }`}
              onClick={handleAccountClick}
            >
              <FiUser />
            </button>

            {isAuthenticated && accountMenuOpen && (
              <div className="account-dropdown">
                <div className="account-header">
                  <div className="account-avatar">
                    <FiUser />
                  </div>

                  <div>
                    <strong>
                      {user?.name || "User"}
                    </strong>

                    <span>
                      {user?.email || ""}
                    </span>
                  </div>
                </div>

                <div className="account-divider" />

                <button
                  className="account-item"
                  onClick={() => {
                    setAccountMenuOpen(false);
                    navigate("/account");
                  }}
                >
                  <FiUserCheck />

                  <span>My Account</span>
                </button>

                <button
                  className="account-item"
                  onClick={() => {
                    setAccountMenuOpen(false);
                    navigate("/orders");
                  }}
                >
                  <FiPackage />

                  <span>My Orders</span>
                </button>

                {isAdmin && (
                  <>
                    <div className="account-divider" />

                    <button
                      className="account-item admin-dashboard-item"
                      onClick={handleDashboardClick}
                    >
                      <FiGrid />

                      <span>Dashboard</span>
                    </button>
                  </>
                )}

                <div className="account-divider" />

                <button
                  className="account-item logout-item"
                  onClick={handleLogout}
                >
                  <FiLogOut />

                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="mobile-search-overlay">
          <div
            className="mobile-search"
            ref={mobileSearchRef}
          >
            <button
              className="close-search"
              onClick={() => setMobileSearchOpen(false)}
            >
              <FiX />
            </button>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                  setMobileSearchOpen(false);
                }
              }}
              autoFocus
            />

            {suggestions.length > 0 && (
              <div className="mobile-search-suggestions">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    className="suggestion-item"
                    onClick={() => handleProductClick(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <div className="suggestion-info">
                      <h4>{product.name}</h4>

                      {product.brand && (
                        <small>{product.brand}</small>
                      )}

                      {product.category && (
                        <small>{product.category}</small>
                      )}

                      <span>{product.price} EGP</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {logoutSuccess && (
        <div className="logout-success-overlay">
          <div className="logout-success-box">
            <div className="logout-success-icon">
              ✓
            </div>

            <span>Logged out successfully</span>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;