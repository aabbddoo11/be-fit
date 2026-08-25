import "./ProductDetails.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getProductById, getProducts } from "../../services/api";

import { useCart } from "../../context/CartContext";
import { FiHeart } from "react-icons/fi";
import { useFavorite } from "../../context/FavoriteContext";
import { FaHeart } from "react-icons/fa";

import ProductDetailsSkeleton from "../../components/Skeleton/ProductDetailsSkeleton";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import ProductCard from "../../components/ProductCard/ProductCard";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [counter, setCounter] = useState(1);

  const {
    toggleFavorite,
    isFavorite,
  } = useFavorite();

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);
        setRelatedProducts([]);
        setCounter(1);

        const data = await getProductById(id);

        setProduct(data);

        const productsData = await getProducts();

        const products = Array.isArray(productsData)
          ? productsData
          : productsData.products || [];

        const related = products
          .filter(
            (item) =>
              item._id !== data._id &&
              item.category === data.category
          )
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 4);

        setRelatedProducts(related);
      } catch (error) {
        console.error(error);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (error) {
    return (
      <main className="product-details">
        <div className="container">
          <h2>{error}</h2>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-details">
        <div className="container">
          <h2>Product not found.</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="product-details">

      <div className="container">

        <Breadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Shop", link: "/shop" },
            {
              label: product.category,
              link: `/shop?category=${encodeURIComponent(
                product.category
              )}`,
            },
            { label: product.name },
          ]}
        />

        <div className="product-layout">

          <div className="product-gallery">

            <div className="main-image">
              <img
                src={product.image}
                alt={product.name}
              />
            </div>

          </div>

          <div className="product-info">

            <span className="product-category">
              {product.category}
            </span>

            <h1>{product.name}</h1>

            <div className="product-rating">
              ⭐ {product.rating}/5
            </div>

            <div className="product-price">

              <span className="new-price">
                {product.price} EGP
              </span>

              {product.oldPrice && (
                <span className="old-price">
                  {product.oldPrice} EGP
                </span>
              )}

            </div>

            <div className="product-meta">

              <p>
                <strong>Brand:</strong> {product.brand}
              </p>

              <p>
                <strong>Flavor:</strong> {product.flavor}
              </p>

              <p>
                <strong>Weight:</strong> {product.weight}
              </p>

              <p>
                <strong>Servings:</strong> {product.servings}
              </p>

              <p className="stock-status">
  <strong>Stock:</strong>{" "}

  {product.stock <= 0 ? (
    <span className="stock-out">
      Out Of Stock
    </span>
  ) : product.stock <= 5 ? (
    <span className="stock-low">
      Low Stock — Only {product.stock} left
    </span>
  ) : (
    <span className="stock-available">
      In Stock — {product.stock} available
    </span>
  )}
</p>

            </div>

            <div className="product-actions">

              <div className="quantity-box">

                <button
                  onClick={() =>
                    setCounter((prev) =>
                      Math.max(prev - 1, 1)
                    )
                  }
                >
                  -
                </button>

                <span>{counter}</span>

                <button
                  disabled={counter >= product.stock}
                  onClick={() =>
                    setCounter((prev) => prev + 1)
                  }
                >
                  +
                </button>

              </div>

              <button
                className={`favorite-btn ${
                  isFavorite(product._id) ? "active" : ""
                }`}
                onClick={() =>
                  toggleFavorite(product._id)
                }
              >
                {isFavorite(product._id) ? (
                  <FaHeart />
                ) : (
                  <FiHeart />
                )}
              </button>

              <button
                className="add-cart-btn"
                disabled={product.stock <= 0}
                onClick={() => {
                  addToCart(product, counter);
                }}
              >
                {product.stock > 0
                  ? "Add To Cart"
                  : "Out Of Stock"}
              </button>

            </div>

          </div>

        </div>

      </div>

      <section className="product-extra">

        <div className="extra-card">

          <h2>Description</h2>

          <p>{product.description}</p>

        </div>

        <div className="extra-card">

          <h2>Benefits</h2>

          <ul>
            {product.benefits?.map((benefit, index) => (
              <li key={index}>
                ✔ {benefit}
              </li>
            ))}
          </ul>

        </div>

        <div className="extra-card">

          <h2>Ingredients</h2>

          <ul>
            {product.ingredients?.map(
              (ingredient, index) => (
                <li key={index}>
                  {ingredient}
                </li>
              )
            )}
          </ul>

        </div>

        <div className="extra-card">

          <h2>Additional Information</h2>

          <div className="info-grid">

            <div>
              <strong>Brand</strong>
              <span>{product.brand}</span>
            </div>

            <div>
              <strong>Category</strong>
              <span>{product.category}</span>
            </div>

            <div>
              <strong>Flavor</strong>
              <span>{product.flavor}</span>
            </div>

            <div>
              <strong>Weight</strong>
              <span>{product.weight}</span>
            </div>

            <div>
              <strong>Servings</strong>
              <span>{product.servings}</span>
            </div>

            <div>
              <strong>Stock</strong>
              <span>
                {product.stock > 0
                  ? "In Stock"
                  : "Out of Stock"}
              </span>
            </div>

          </div>

        </div>

      </section>

      {relatedProducts.length > 0 && (
        <section className="related-products">

          <div className="container">

            <div className="related-header">
              <span>YOU MAY ALSO LIKE</span>
              <h2>Related Products</h2>
              <p>
                Discover more products from the same category.
              </p>
            </div>

            <div className="products-grid">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct._id}
                  product={relatedProduct}
                />
              ))}
            </div>

          </div>

        </section>
      )}

    </main>
  );
}

export default ProductDetails;