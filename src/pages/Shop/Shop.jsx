import "./Shop.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { products } from "../../data/allproducts";
import ProductCard from "../../components/ProductCard/ProductCard";
import "../../components/ProductGrid/ProductGrid.css";
import ProductGridSkeleton from "../../components/Skeleton/ProductGridSkeleton";
function Shop() {
  const [loading, setLoading] = useState(true);

useEffect(() => {

  const timer = setTimeout(() => {

    setLoading(false);

  }, 1200);

  return () => clearTimeout(timer);

}, []);
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

const [category, setCategory] = useState(
  searchParams.get("category") || "All"
);  const [sort, setSort] = useState("Newest");

  useEffect(() => {
  setSearch(searchParams.get("search") || "");
  setCategory(searchParams.get("category") || "All");
}, [searchParams]);

  let filteredProducts = [...products];

  filteredProducts = filteredProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "Low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "High") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (sort === "Rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }
if (loading) {
  return (
    <main className="shop">

      <section className="shop-hero">
        <div className="container">

          <span className="shop-badge">
            BEST SUPPLEMENTS
          </span>

          <h1>Our Shop</h1>

          <p>
            Discover high-quality supplements designed to help you
            build muscle, improve performance and recover faster.
          </p>

        </div>
      </section>

      <section className="shop-toolbar">

        <div className="container toolbar-container">

          <div className="search-input skeleton-toolbar"></div>

          <div className="skeleton-select"></div>

          <div className="skeleton-select"></div>

        </div>

      </section>

      <section className="shop-products">

        <div className="container">

          <h2>Products</h2>

          <ProductGridSkeleton />

        </div>

      </section>

    </main>
  );
}
  return (
    <main className="shop">

      <section className="shop-hero">
        <div className="container">

          <span className="shop-badge">
            BEST SUPPLEMENTS
          </span>

          <h1>Our Shop</h1>

          <p>
            Discover high-quality supplements designed to help you
            build muscle, improve performance and recover faster.
          </p>

        </div>
      </section>

      <section className="shop-toolbar">

        <div className="container toolbar-container">

          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Protein">Protein</option>
            <option value="Creatine">Creatine</option>
            <option value="Pre Workout">Pre Workout</option>
            <option value="Mass Gainer">Mass Gainer</option>
            <option value="Vitamins">Vitamins</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="Newest">Newest</option>
            <option value="Low">Price: Low to High</option>
            <option value="High">Price: High to Low</option>
            <option value="Rating">Best Rating</option>
          </select>

        </div>

      </section>

      <section className="shop-products">

        <div className="container">

          <h2>Products</h2>

          <div className="product-grid">

            {filteredProducts.length > 0 ? (

              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))

            ) : (

              <div className="empty-products">
                No products found.
              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}

export default Shop;