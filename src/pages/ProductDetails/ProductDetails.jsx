import "./ProductDetails.css";
import { useParams } from "react-router-dom";
import { products } from "../../data/allproducts";
import {useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { FiHeart } from "react-icons/fi";
import { useFavorite } from "../../context/FavoriteContext";
import { FaHeart } from "react-icons/fa";
import ProductDetailsSkeleton from "../../components/Skeleton/ProductDetailsSkeleton";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
function ProductDetails() {
  const [loading, setLoading] = useState(true);
  const[counter,setCounter]=useState(1);
  const { id } = useParams();
  useEffect(() => {

  setLoading(true);

  const timer = setTimeout(() => {

    setLoading(false);

  }, 700);

  return () => clearTimeout(timer);

}, [id]);
const {
  toggleFavorite,
  isFavorite,
} = useFavorite();
const { addToCart } = useCart();
  const product = products.find(
    (item) => item.id === Number(id)
  );
  if (loading) {
  return <ProductDetailsSkeleton />;
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
      link: `/shop?category=${encodeURIComponent(product.category)}`
    },
    { label: product.name }
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

            <span className="old-price">
              {product.oldPrice} EGP
            </span>

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
              {product.stock ? "In Stock" : "Out Of Stock"}
            </p>

          </div>
          <div className="product-actions">

    <div className="quantity-box">

        <button
            onClick={() =>setCounter((prev) => Math.max(prev - 1, 1))}
        >
            -
        </button>

        <span>{counter}</span>

        <button
            onClick={() => setCounter((prev) => prev + 1)}
        >
            +
        </button>

    </div>

    <button
  className={`favorite-btn ${
    isFavorite(product.id) ? "active" : ""
  }`}
  onClick={() => toggleFavorite(product.id)}
>

  {isFavorite(product.id) ? <FaHeart /> : <FiHeart />}

</button>

    <button
    className="add-cart-btn"
    onClick={() => {

        addToCart(product, counter);

    }}
>
    Add To Cart
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
      {product.benefits.map((benefit, index) => (
        <li key={index}>✔ {benefit}</li>
      ))}
    </ul>

  </div>

  <div className="extra-card">
    <h2>Ingredients</h2>

    <ul>
      {product.ingredients.map((ingredient, index) => (
        <li key={index}>{ingredient}</li>
      ))}
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
        <span>{product.stock ? "In Stock" : "Out of Stock"}</span>
      </div>

    </div>

  </div>

</section>
  </main>
  
);
}

export default ProductDetails;