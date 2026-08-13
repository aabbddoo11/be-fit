import { useFavorite } from "../../context/FavoriteContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
import { logIn } from "../../services/api";
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
} from "react-icons/fi";

import logo from "../../assets/logo/logo.png";

import { products } from "../../data/allproducts";

function Navbar() {
  const navigate = useNavigate();
  const { favorites } = useFavorite();
  const { cartItems } = useCart();
const [userName,setUsername]=useState()
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
  const handleSearch = () => {
    if (!search.trim()) return;

    navigate(`/shop?search=${encodeURIComponent(search)}`);

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

    const filtered = products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(value.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5));
  };

  /*
    Close mobile search and account menu
    when clicking outside.
  */

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

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, [mobileSearchOpen, accountMenuOpen]);

  /*
    Account button
  */

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setAccountMenuOpen((prev) => !prev);
  };

  /*
    Logout
  */

 const handleLogout = () => {
  logout();
  setAccountMenuOpen(false);
  setLogoutSuccess(true);

  setTimeout(() => {
    navigate("/");
    setLogoutSuccess(false);
  }, 1200);
};

  return (
    <header className="navbar">
      <div className="container">

        {/* Mobile Menu */}

        <button
          className="menu-btn"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Logo */}

        <Link to="/" className="logo">
          <img
            src={logo}
            alt="B-FIT Logo"
          />
        </Link>

        {/* Navigation */}

        <nav
          className={
            menuOpen
              ? "nav active"
              : "nav"
          }
        >
          <Link
            to="/"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Home
          </Link>

          <Link
            to="/shop"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Shop
          </Link>

          <Link
            to="/favorites"
            className="mobile-only"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            ❤️ Favorites
          </Link>

          <Link
            to="/about"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            About
          </Link>

          <Link
            to="/shipping"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Shipping & Returns
          </Link>
        </nav>

        {/* Desktop Actions */}

        <div className="actions desktop-actions">

          {/* Search */}

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
                    onClick={() => {
                      navigate(
                        `/product/${product.id}`
                      );

                      setSuggestions([]);
                      setSearch("");
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <div className="suggestion-info">
                      <h4>
                        {product.name}
                      </h4>

                      <span>
                        {product.price} EGP
                      </span>
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

          {/* Favorites */}

          <Link to="/favorites">
            <button className="favorite-btn">
              <FiHeart />

              {favorites.length > 0 && (
                <span>
                  {favorites.length}
                </span>
              )}
            </button>
          </Link>

          {/* Cart */}

          <button
            className="cart"
            onClick={() =>
              navigate("/cart")
            }
          >
            <FiShoppingCart />

            {totalQuantity > 0 && (
              <span>
                {totalQuantity}
              </span>
            )}
          </button>

          {/* Account */}

          <div
            className="account-wrapper"
  ref={desktopAccountMenuRef}
          >

            <button
              className={`user-btn ${
                isAuthenticated
                  ? "logged-in"
                  : ""
              }`}
              onClick={handleAccountClick}
              aria-label="Account"
            >
              <FiUser />
            </button>

            {isAuthenticated &&
              accountMenuOpen && (

                <div className="account-dropdown">

                  {/* User */}

                  <div className="account-header">

                    <div className="account-avatar">
                      <FiUser />
                    </div>

                    <div>
                      <strong>
                        {user?.name ||
                          "User"}
                      </strong>

                      <span>
                        {user?.email || ""}
                      </span>
                    </div>

                  </div>

                  <div className="account-divider" />

                  {/* My Account */}

                  <button
                    className="account-item"
                    onClick={() => {
                      setAccountMenuOpen(
                        false
                      );

                      navigate(
                        "/account"
                      );
                    }}
                  >
                    <FiUserCheck />

                    <span>My Account
                    </span>
                  </button>

                  {/* Orders */}

                  <button
                    className="account-item"
                    onClick={() => {
                      setAccountMenuOpen(
                        false
                      );

                      navigate(
                        "/orders"
                      );
                    }}
                  >
                    <FiPackage />

                    <span>
                              My Orders
                    </span>
                  </button>

                  <div className="" />

                  {/* Logout */}

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

        {/* Mobile Actions */}

        <div className="mobile-actions">

          <button
            onClick={() =>
              setMobileSearchOpen(true)
            }
          >
            <FiSearch />
          </button>

          <button
            className="cart"
            onClick={() =>
              navigate("/cart")
            }
          >
            <FiShoppingCart />

            {totalQuantity > 0 && (
              <span>
                {totalQuantity}
              </span>
            )}
          </button>

          {/* Mobile Account */}

          <div
            className="account-wrapper"
  ref={mobileAccountMenuRef}
          >

            <button
              className="user-btn"
              onClick={handleAccountClick}
            >
              <FiUser />
            </button>

            {isAuthenticated &&
              accountMenuOpen && (

                <div className="account-dropdown">

                  <div className="account-header">

                    <div className="account-avatar">
                      <FiUser />
                    </div>

                    <div>
                      <strong>
                        {user?.name ||
                          "User"}
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
                      setAccountMenuOpen(
                        false
                      );

                      navigate(
                        "/account"
                      );
                    }}
                  >
                    <FiUserCheck />

                    <span>
                      My Account
                    </span>
                  </button>

                  <button
                    className="account-item"
                    onClick={() => {
                      setAccountMenuOpen(
                        false
                      );

                      navigate(
                        "/orders"
                      );
                    }}
                  >
                    <FiPackage />

                    <span>
                      My Orders
                    </span>
                  </button>

                  <div className="account-divider" />
<div className="ccxc">
                  <button
                    className="account-item logout-item"
                    onClick={
                      handleLogout
                    }
                  >
                    <FiLogOut />

                    <span>
                      Logout
                    </span>
                  </button></div>

                </div>
              )}

          </div>

        </div>
      </div>

      {/* Mobile Search Overlay */}

      {mobileSearchOpen && (

        <div className="mobile-search-overlay">

          <div
            className="mobile-search"
            ref={mobileSearchRef}
          >

            <button
              className="close-search"
              onClick={() =>
                setMobileSearchOpen(false)
              }
            >
              <FiX />
            </button>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleInputChange}
              autoFocus
            />

            {suggestions.length > 0 && (

              <div className="mobile-search-suggestions">

                {suggestions.map(
                  (product) => (

                    <div
                      key={product.id}
                      className="suggestion-item"
                      onClick={() => {
                        navigate(
                          `/product/${product.id}`
                        );

                        setSuggestions([]);
                        setSearch("");
                        setMobileSearchOpen(
                          false
                        );
                      }}
                    >

                      <img
                        src={product.image}
                        alt={product.name}
                      />

                      <div className="suggestion-info">

                        <h4>
                          {product.name}
                        </h4>

                        <span>
                          {product.price} EGP
                        </span>

                      </div>

                    </div>
                  )
                )}

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

      <span>
        Logged out successfully
      </span>
    </div>
  </div>
)}
    </header>
  );
}

export default Navbar;