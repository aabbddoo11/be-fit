import "./ProductCardSkeleton.css";

function ProductCardSkeleton() {
  return (
    <div className="product-card skeleton-card">

      <div className="skeleton skeleton-badge"></div>

      <div className="skeleton skeleton-image"></div>

      <div className="skeleton skeleton-category"></div>

      <div className="skeleton skeleton-title"></div>

      <div className="skeleton skeleton-rating"></div>

      <div className="skeleton skeleton-price"></div>

      <div className="skeleton skeleton-button"></div>

    </div>
  );
}

export default ProductCardSkeleton;