import "./Shop.css";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { getProducts } from "../../services/api";
import ProductCard from "../../components/ProductCard/ProductCard";
import "../../components/ProductGrid/ProductGrid.css";
import ProductGridSkeleton from "../../components/Skeleton/ProductGridSkeleton";

const CATEGORIES = [
  "All",
  "Protein",
  "Creatine",
  "Pre Workout",
  "Mass Gainer",
  "L-Carnitine",
  "Vitamins",
  "BCAA",
  "EAA",
];

const PRODUCTS_PER_PAGE = 8; // ⭐ عدد المنتجات في كل صفحة

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const [sort, setSort] = useState("Newest");

  // ⭐ حالة الصفحة الحالية
  const [currentPage, setCurrentPage] = useState(1);

  // جلب المنتجات عند التحميل
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ⭐ العودة للصفحة الأولى عند التصفية أو البحث أو الترتيب
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, sort]);

  // تحديث الـ URL عند تغير البحث أو الفئة
  const handleSearchChange = (value) => {
    setSearchParams((prev) => {
      if (value) prev.set("search", value);
      else prev.delete("search");
      return prev;
    });
  };

  const handleCategoryChange = (value) => {
    setSearchParams((prev) => {
      if (value !== "All") prev.set("category", value);
      else prev.delete("category");
      return prev;
    });
  };

  // تصفية وترتيب المنتجات
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    return result.sort((a, b) => {
      if (sort === "Low") return a.price - b.price;
      if (sort === "High") return b.price - a.price;
      if (sort === "Rating") return b.rating - a.rating;
      if (sort === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
  }, [products, search, category, sort]);

  // ⭐ حساب المنتجات الخاصة بالصفحة الحالية فقط
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  return (
    <main className="shop">
      {/* Hero Section */}
      <section className="shop-hero">
        <div className="container">
          <span className="shop-badge">BEST SUPPLEMENTS</span>
          <h1>Our Shop</h1>
          <p>
            Discover high-quality supplements designed to help you build
            muscle, improve performance and recover faster.
          </p>
        </div>
      </section>

      {/* Toolbar Section */}
      <section className="shop-toolbar">
        <div className="container toolbar-container">
          {loading ? (
            <>
              <div className="search-input skeleton-toolbar"></div>
              <div className="skeleton-select"></div>
              <div className="skeleton-select"></div>
            </>
          ) : (
            <>
              <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />

              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>

              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="Newest">Newest</option>
                <option value="Low">Price: Low to High</option>
                <option value="High">Price: High to Low</option>
                <option value="Rating">Best Rating</option>
              </select>
            </>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="shop-products">
        <div className="container">
          <h2>Products</h2>

          {loading && <ProductGridSkeleton />}

          {error && <div className="empty-products">{error}</div>}

          {!loading && !error && (
            <>
              <div className="product-grid">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <div className="empty-products">No products found.</div>
                )}
              </div>

              {/* ⭐ مربعات أرقام الصفحات */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="pagination-btn"
                  >
                    &lt;
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`pagination-number ${
                          currentPage === page ? "active" : ""
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="pagination-btn"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default Shop;