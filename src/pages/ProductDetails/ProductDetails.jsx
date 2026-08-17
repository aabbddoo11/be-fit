import "./ProductDetails.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getProductById } from "../../services/api";

import { useCart } from "../../context/CartContext";
import { FiHeart } from "react-icons/fi";
import { useFavorite } from "../../context/FavoriteContext";
import { FaHeart } from "react-icons/fa";

import ProductDetailsSkeleton from "../../components/Skeleton/ProductDetailsSkeleton";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

function ProductDetails() {
  const { id } = useParams();

  // ⭐ المنتج القادم من Backend
  const [product, setProduct] = useState(null);
  

  // ⭐ Loading حقيقي أثناء جلب المنتج
  const [loading, setLoading] = useState(true);

  // ⭐ تخزين الخطأ في حالة فشل الطلب
  const [error, setError] = useState("");

  const [counter, setCounter] = useState(1);

  const {
    toggleFavorite,
    isFavorite,
  } = useFavorite();

  const { addToCart } = useCart();

  // ⭐ جلب المنتج من Backend باستخدام الـ ID الموجود في URL
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);

        const data = await getProductById(id);

        setProduct(data);
      } catch (error) {
        console.error(error);

        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ⭐ Skeleton أثناء جلب البيانات
  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  // ⭐ في حالة حدوث خطأ أثناء الاتصال بالـ Backend
  if (error) {
    return (
      <main className="product-details">
        <div className="container">
          <h2>{error}</h2>
        </div>
      </main>
    );
  }

  // ⭐ المنتج غير موجود
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

              <p>
                <strong>Status:</strong>{" "}
                {product.stock > 0
                  ? "In Stock"
                  : "Out Of Stock"}
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

    </main>
  );
}

export default ProductDetails;