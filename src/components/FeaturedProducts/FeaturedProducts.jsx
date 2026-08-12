import "./FeaturedProducts.css";
import ProductCard from "../ProductCard/ProductCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../../services/api";

function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    return (
        <section className="featured-products">

            <div className="f-container">

                <div className="section-header">

                    <span className="subtitle">
                        OUR PRODUCTS
                    </span>

                    <h2>
                        Featured Products
                    </h2>

                    <p>
                        Premium supplements designed to help you
                        build muscle, improve performance and recover faster.
                    </p>

                </div>

                {loading && (
                    <p>Loading products...</p>
                )}

                {error && (
                    <p>{error}</p>
                )}

                {!loading && !error && (
                    <div className="products-grid">

                        {products
                            .filter((product) => product.featured)
                            .map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            ))}

                    </div>
                )}

                <div className="view-all">
                    <Link to="/shop" className="view-all-btn">
                        View All Products →
                    </Link>
                </div>

            </div>

        </section>
    );
}

export default FeaturedProducts;