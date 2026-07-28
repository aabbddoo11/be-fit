import "./ProductCard.css";
import { FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useFavorite } from "../../context/FavoriteContext";
import { FiHeart } from "react-icons/fi";
function ProductCard({ product }) {
  const {
  toggleFavorite,
  isFavorite,
} = useFavorite();
  const { addToCart } = useCart();
  const {
    image,
    name,
    category,
    price,
    oldPrice,
    rating,
    badge,
  } = product;

  const discount =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;
const navigate = useNavigate();

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
     


      {badge && <span className="badge">{badge}</span>}

      {discount > 0 && (
        <span className="discount">
          -{discount}%
        </span>
      )}

      <button
  className={`favorite ${
    isFavorite(product.id) ? "active" : ""
  }`}
  onClick={(e) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  }}
>
  {isFavorite(product.id) ? (
    <FaHeart />
  ) : (
    <FiHeart />
  )}
</button>

      <div className="image">
        <img src={image} alt={name} />
      </div>

      <span className="category">
        {category}
      </span>

      <h3>{name}</h3>

      <div className="rating">

        {[...Array(rating)].map((_, i) => (
          <FaStar key={i} />
        ))}

      </div>

      <div className="price">

        <span className="new-price">
          {price} EGP
        </span>

        {oldPrice && (
          <span className="old-price">
            {oldPrice} EGP
          </span>
        )}

      </div>

      <button
  className="cart-btn"
  onClick={(e) => {
    e.stopPropagation();
    addToCart(product, 1);
  }}
>
  <FaShoppingCart />
  Add To Cart
</button>

    </div>
  );
}

export default ProductCard;