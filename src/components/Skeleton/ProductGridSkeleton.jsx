import ProductCardSkeleton from "./ProductCardSkeleton";
import "./ProductGridSkeleton.css";

function ProductGridSkeleton() {
  return (
    <div className="products-grid">

      {[...Array(8)].map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}

    </div>
  );
}

export default ProductGridSkeleton;