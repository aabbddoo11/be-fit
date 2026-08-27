import "./ProductDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getProductById,
  getProducts,
  getProductReviews,
} from "../../services/api";

import { useCart } from "../../context/CartContext";
import { FiHeart, FiStar, FiArrowLeft } from "react-icons/fi";
import { useFavorite } from "../../context/FavoriteContext";
import { FaHeart, FaStar } from "react-icons/fa";

import ProductDetailsSkeleton from "../../components/Skeleton/ProductDetailsSkeleton";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import ProductCard from "../../components/ProductCard/ProductCard";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productNotFound, setProductNotFound] = useState(false);
  const [counter, setCounter] = useState(1);

  const { toggleFavorite, isFavorite } = useFavorite();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProductNotFound(false);
        setProduct(null);
        setRelatedProducts([]);
        setReviews([]);
        setCounter(1);

        const data = await getProductById(id);

        if (!data) {
          setProductNotFound(true);
          return;
        }

        setProduct(data);

        try {
          const reviewsData = await getProductReviews(id);
          setReviews(reviewsData?.reviews || []);
        } catch (reviewsError) {
          console.error("Failed to load reviews:", reviewsError);
          setReviews([]);
        }

        try {
          const productsData = await getProducts();

          const products = Array.isArray(productsData)
            ? productsData
            : productsData?.products || [];

          const related = products
            .filter(
              (item) =>
                item._id !== data._id &&
                item.category === data.category
            )
            .sort(
              (a, b) => (b.rating || 0) - (a.rating || 0)
            )
            .slice(0, 4);

          setRelatedProducts(related);
        } catch (productsError) {
          console.error(
            "Failed to load related products:",
            productsError
          );
          setRelatedProducts([]);
        }
      } catch (error) {
  console.error(error);

  const message = error?.message?.toLowerCase?.() || "";

  if (
    error?.status === 404 ||
    message.includes("not found")
  ) {
    setProductNotFound(true);
  } else {
    setError(
      "Unable to load the product right now. Please try again later."
    );
  }
}finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (productNotFound) {
    return (
      <main className="product-details product-not-found-page">
        <div className="container">
          <div className="product-not-found">
            <div className="product-not-found-icon">
              <span>!</span>
            </div>

            <span className="product-not-found-label">
              PRODUCT NOT FOUND
            </span>

            <h1>Product Not Found</h1>

            <p>
              Sorry, the product you are looking for does not
              exist, has been removed, or is no longer available.
            </p>

            <button
              type="button"
              className="product-not-found-btn"
              onClick={() => navigate("/shop")}
            >
              <FiArrowLeft />
              <span>Back To Shop</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="product-details product-error-page">
        <div className="container">
          <div className="product-error">
            <div className="product-error-icon">
              <span>!</span>
            </div>

            <h2>Something Went Wrong</h2>

            <p>{error}</p>

            <button
              type="button"
              className="product-error-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-details product-not-found-page">
        <div className="container">
          <div className="product-not-found">
            <div className="product-not-found-icon">
              <span>!</span>
            </div>

            <span className="product-not-found-label">
              PRODUCT NOT FOUND
            </span>

            <h1>Product Not Found</h1>

            <p>
              Sorry, the product you are looking for does not
              exist, has been removed, or is no longer available.
            </p>

            <button
              type="button"
              className="product-not-found-btn"
              onClick={() => navigate("/shop")}
            >
              <FiArrowLeft />
              <span>Back To Shop</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  const reviewCount = reviews.length;

  const averageRating =
    reviewCount > 0
      ? reviews.reduce(
          (total, review) =>
            total + Number(review.rating || 0),
          0
        ) / reviewCount
      : Number(product.rating || 0);

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
              <span className="rating-stars">
                {Array.from({ length: 5 }).map(
                  (_, index) =>
                    index < Math.round(averageRating) ? (
                      <FaStar key={index} />
                    ) : (
                      <FiStar key={index} />
                    )
                )}
              </span>

              <span className="rating-number">
                {averageRating.toFixed(1)}/5
              </span>

              <span className="rating-count">
                ({reviewCount}{" "}
                {reviewCount === 1 ? "review" : "reviews"})
              </span>
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
                <strong>Brand:</strong>{" "}
                {product.brand}
              </p>

              <p>
                <strong>Flavor:</strong>{" "}
                {product.flavor}
              </p>

              <p>
                <strong>Weight:</strong>{" "}
                {product.weight}
              </p>

              <p>
                <strong>Servings:</strong>{" "}
                {product.servings}
              </p>

              <p className="stock-status">
                <strong>Stock:</strong>{" "}

                {product.stock <= 0 ? (
                  <span className="stock-out">
                    Out Of Stock
                  </span>
                ) : product.stock <= 5 ? (
                  <span className="stock-low">
                    Low Stock — Only{" "}
                    {product.stock} left
                  </span>
                ) : (
                  <span className="stock-available">
                    In Stock —{" "}
                    {product.stock} available
                  </span>
                )}
              </p>
            </div>

            <div className="product-actions">
              <div className="quantity-box">
                <button
                  type="button"
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
                  type="button"
                  disabled={
                    product.stock <= 0 ||
                    counter >= product.stock
                  }
                  onClick={() =>
                    setCounter((prev) => prev + 1)
                  }
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className={`favorite-btn ${
                  isFavorite(product._id)
                    ? "active"
                    : ""
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
                type="button"
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
            {product.benefits?.map(
              (benefit, index) => (
                <li key={index}>
                  ✔ {benefit}
                </li>
              )
            )}
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
                Discover more products from the same
                category.
              </p>
            </div>

            <div className="products-grid">
              {relatedProducts.map(
                (relatedProduct) => (
                  <ProductCard
                    key={relatedProduct._id}
                    product={relatedProduct}
                  />
                )
              )}
            </div>
          </div>
        </section>
      )}

      <section className="product-reviews">
        <div className="container">
          <div className="reviews-header">
            <span>WHAT OUR CUSTOMERS SAY</span>

            <h2>Customer Reviews</h2>

            <div className="reviews-summary">
              <div className="reviews-average">
                <strong>
                  {averageRating.toFixed(1)}
                </strong>

                <div className="reviews-stars">
                  {Array.from({ length: 5 }).map(
                    (_, index) =>
                      index <
                      Math.round(averageRating) ? (
                        <FaStar key={index} />
                      ) : (
                        <FiStar key={index} />
                      )
                  )}
                </div>

                <span>
                  Based on {reviewCount}{" "}
                  {reviewCount === 1
                    ? "review"
                    : "reviews"}
                </span>
              </div>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map(
                (review, index) => {
                  const user =
                    review.user || {};

                  const userName =
                    user.firstName ||
                    user.name ||
                    user.username ||
                    "Customer";

                  return (
                    <article
                      className="review-card"
                      key={
                        review._id || index
                      }
                    >
                      <div className="review-card-header">
                        <div className="review-user">
                          <div className="review-avatar">
                            {userName
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h3>{userName}</h3>

                            <span>
                              {review.createdAt
                                ? new Date(
                                    review.createdAt
                                  ).toLocaleDateString(
                                    "en-EG",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )
                                : ""}
                            </span>
                          </div>
                        </div>

                        <div className="review-rating">
                          {Array.from({ length: 5 }).map(
                            (_, starIndex) =>
                              starIndex <
                              Number(
                                review.rating || 0
                              ) ? (
                                <FaStar
                                  key={starIndex}
                                />
                              ) : (
                                <FiStar
                                  key={starIndex}
                                />
                              )
                          )}
                        </div>
                      </div>

                      <p className="review-comment">
                        {review.comment}
                      </p>
                    </article>
                  );
                }
              )}
            </div>
          ) : (
            <div className="no-reviews">
              <FiStar />

              <h3>No Reviews Yet</h3>

              <p>
                Be the first customer to review
                this product.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;