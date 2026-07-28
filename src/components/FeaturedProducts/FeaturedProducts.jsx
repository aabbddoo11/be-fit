import "./FeaturedProducts.css";
import ProductCard from "../ProductCard/ProductCard";
import { featuredProducts } from "../../data/products";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function FeaturedProducts() {
    const navigate = useNavigate();

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

                <div className="products-grid" onClick={() => navigate(`/product/${product.id}`)}>

                    {featuredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}

                </div>
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