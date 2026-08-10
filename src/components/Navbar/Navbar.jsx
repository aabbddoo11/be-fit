import { useFavorite } from "../../context/FavoriteContext";
import { useCart } from "../../context/CartContext";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState , useRef, useEffect} from "react";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";
import logo from "../../assets/logo/logo.png";
import { FaUser } from "react-icons/fa";
import { products } from "../../data/allproducts";

function Navbar() {
  const navigate = useNavigate();

  const { favorites } = useFavorite();
  const { cartItems } = useCart();

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
const mobileSearchRef = useRef(null);
  const handleSearch = () => {
    navigate(`/shop?search=${encodeURIComponent(search)}`);
    setMenuOpen(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    setSearch(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );

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
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [mobileSearchOpen]);
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
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
         <Link
  to="/favorites"
  className="mobile-only"
  onClick={() => setMenuOpen(false)}
>
  ❤️ Favorites
</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/shipping" onClick={() => setMenuOpen(false)}>
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
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      setSuggestions([]);
                      setSearch("");
                    }}
                  >

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <div className="suggestion-info">

                      <h4>{product.name}</h4>

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
<Link to="/favorites" >
          <button className="favorite-btn" >
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
<button
    className="user-btn"
    onClick={() => navigate("/login")}
>
    <FiUser />
</button>

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
          <button
  className="user-btn"
  onClick={() => navigate("/login")}
>
  <FiUser />
</button>
          
        </div>

      </div>

      {mobileSearchOpen && (

        <div className="mobile-search-overlay">

          <div className="mobile-search"   ref={mobileSearchRef}
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
              autoFocus
            />

            {suggestions.length > 0 && (

              <div className="mobile-search-suggestions">

                {suggestions.map((product) => (

                  <div
                    key={product.id}
                    className="suggestion-item"
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      setSuggestions([]);
                      setSearch("");
                      setMobileSearchOpen(false);
                    }}
                  >

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <div className="suggestion-info">

                      <h4>{product.name}</h4>

                      <span>{product.price} EGP</span>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      )}

    </header>
  );
}

export default Navbar;