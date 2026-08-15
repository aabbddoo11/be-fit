import "./Favorites.css";

import { Link } from "react-router-dom";

import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import ProductCard from "../../components/ProductCard/ProductCard";

import { useFavorite } from "../../context/FavoriteContext";

function Favorites() {
  const {
    favorites,
    loading,
  } = useFavorite();

  return (
    <main className="favorites-page">

      <div className="container">

        <Breadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Favorites" },
          ]}
        />

        <div className="favorites-header">

          <h1>My Favorites</h1>

          <p>
            Save your favorite supplements and come back to them anytime.
          </p>

        </div>


        {/* ==========================================
            Loading
        ========================================== */}

        {loading && (

          <div className="empty-favorites">

            <div className="empty-icon">
              🤍
            </div>

            <h2>Loading Favorites...</h2>

            <p>
              Please wait while we load your favorite products.
            </p>

          </div>

        )}


        {/* ==========================================
            Empty Favorites
        ========================================== */}

        {!loading && favorites.length === 0 && (

          <div className="empty-favorites">

            <div className="empty-icon">
              🤍
            </div>

            <h2>Your wishlist is empty</h2>

            <p>
              You haven't added any products to your favorites yet.
            </p>

            <Link
              to="/shop"
              className="browse-btn"
            >
              Browse Products
            </Link>

          </div>

        )}


        {/* ==========================================
            Favorites
        ========================================== */}

        {!loading && favorites.length > 0 && (

          <div className="favorites-grid">

            {favorites.map((product) => (

              <ProductCard
                key={product._id}
                product={product}
              />

            ))}

          </div>

        )}

      </div>

    </main>
  );
}

export default Favorites;