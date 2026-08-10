import "./Skeleton.css";

function ProductDetailsSkeleton() {
  return (
    <main className="product-details">
      <div className="container">

        <div className="pd-skeleton-layout">

          <div className="pd-skeleton-image skeleton"></div>

          <div className="pd-skeleton-info">

            <div className="pd-skeleton-category skeleton"></div>

            <div className="pd-skeleton-title skeleton"></div>

            <div className="pd-skeleton-rating skeleton"></div>

            <div className="pd-skeleton-price skeleton"></div>

            <div className="pd-skeleton-line skeleton"></div>
            <div className="pd-skeleton-line skeleton short"></div>

            <div className="pd-skeleton-meta skeleton"></div>
            <div className="pd-skeleton-meta skeleton"></div>
            <div className="pd-skeleton-meta skeleton"></div>
            <div className="pd-skeleton-meta skeleton"></div>

            <div className="pd-skeleton-actions">

              <div className="pd-skeleton-quantity skeleton"></div>

              <div className="pd-skeleton-favorite skeleton"></div>

              <div className="pd-skeleton-button skeleton"></div>

            </div>

          </div>

        </div>

        <div className="pd-skeleton-extra">

          <div className="pd-skeleton-card skeleton"></div>

          <div className="pd-skeleton-card skeleton"></div>

          <div className="pd-skeleton-card skeleton"></div>

          <div className="pd-skeleton-card skeleton"></div>

        </div>

      </div>
    </main>
  );
}

export default ProductDetailsSkeleton;