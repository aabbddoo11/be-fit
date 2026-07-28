import "./Favorites.css";

import { Link } from "react-router-dom";

import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import ProductCard from "../../components/ProductCard/ProductCard";

import { useFavorite } from "../../context/FavoriteContext";
import { products } from "../../data/allproducts";

function Favorites() {

  const { favorites } = useFavorite();

  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id)
  );

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

        {favoriteProducts.length === 0 ? (

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

        ) : (

          <div className="favorites-grid">

            {favoriteProducts.map((product) => (

              <ProductCard
                key={product.id}
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