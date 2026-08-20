import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaBoxOpen,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "./AdminProducts.css";

const API_URL = "https://be-fit-production.up.railway.app/api";

const initialFormData = {
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  category: "",
  brand: "",
  flavor: "",
  weight: "",
  servings: "",
  image: "",
  gallery: "",
  stock: "0",
  featured: false,
  rating: "0",
  badge: "",
  benefits: "",
  ingredients: "",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState(initialFormData);

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/admin/products`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch products"
        );
      }

      setProducts(
        Array.isArray(data)
          ? data
          : Array.isArray(data.products)
          ? data.products
          : []
      );
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      oldPrice: product.oldPrice ?? "",
      category: product.category || "",
      brand: product.brand || "",
      flavor: product.flavor || "",
      weight: product.weight || "",
      servings: product.servings || "",
      image: product.image || "",
      gallery: Array.isArray(product.gallery)
        ? product.gallery.join(", ")
        : "",
      stock: product.stock ?? "0",
      featured: Boolean(product.featured),
      rating: product.rating ?? "0",
      badge: product.badge || "",
      benefits: Array.isArray(product.benefits)
        ? product.benefits.join(", ")
        : "",
      ingredients: Array.isArray(product.ingredients)
        ? product.ingredients.join(", ")
        : "",
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingProduct(null);
    setFormData(initialFormData);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const convertToArray = (value) => {
    if (!value || typeof value !== "string") {
      return [];
    }

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const buildProductData = () => {
    const price = Number(formData.price);
    const oldPrice =
      formData.oldPrice === ""
        ? undefined
        : Number(formData.oldPrice);

    const stock = Number(formData.stock);
    const rating = Number(formData.rating);

    if (!formData.name.trim()) {
      throw new Error("Product name is required");
    }

    if (!formData.description.trim()) {
      throw new Error("Product description is required");
    }

    if (!Number.isFinite(price) || price < 0) {
      throw new Error("Price must be a valid number");
    }

    if (
      oldPrice !== undefined &&
      (!Number.isFinite(oldPrice) || oldPrice < 0)
    ) {
      throw new Error("Old price must be a valid number");
    }

    if (!Number.isInteger(stock) || stock < 0) {
      throw new Error(
        "Stock must be a valid positive integer"
      );
    }

    if (
      !Number.isFinite(rating) ||
      rating < 0 ||
      rating > 5
    ) {
      throw new Error("Rating must be between 0 and 5");
    }

    return {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price,
      ...(oldPrice !== undefined && { oldPrice }),
      category: formData.category.trim(),
      brand: formData.brand.trim(),
      flavor: formData.flavor.trim(),
      weight: formData.weight.trim(),
      servings: formData.servings.trim(),
      image: formData.image.trim(),
      gallery: convertToArray(formData.gallery),
      stock,
      featured: Boolean(formData.featured),
      rating,
      badge: formData.badge.trim(),
      benefits: convertToArray(formData.benefits),
      ingredients: convertToArray(formData.ingredients),
    };
  };

  const sendRequest = async (url, method, body) => {
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          `Failed to ${
            method === "POST"
              ? "create"
              : method === "PUT"
              ? "update"
              : "delete"
          } product`
      );
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const productData = buildProductData();

      if (editingProduct) {
        await sendRequest(
          `${API_URL}/admin/products/${editingProduct._id}`,
          "PUT",
          productData
        );

        toast.success("Product updated successfully.");
      } else {
        await sendRequest(
          `${API_URL}/admin/products`,
          "POST",
          productData
        );

        toast.success("Product created successfully.");
      }

      closeModal();
      await fetchProducts();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await sendRequest(
        `${API_URL}/admin/products/${product._id}`,
        "DELETE"
      );

      setProducts((prev) =>
        prev.filter((item) => item._id !== product._id)
      );

      toast.success(
        `"${product.name}" was deleted successfully.`
      );
    } catch (err) {
      setError(
        err.message || "Failed to delete product"
      );
    }
  };

  const filteredProducts = products.filter((product) => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return true;
    }

    return (
      product.name?.toLowerCase().includes(value) ||
      product.category?.toLowerCase().includes(value) ||
      product.brand?.toLowerCase().includes(value) ||
      product.flavor?.toLowerCase().includes(value) ||
      product.badge?.toLowerCase().includes(value)
    );
  });

  const formatCurrency = (value) => {
    return `${Number(value || 0).toLocaleString()} LE`;
  };

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <div>
          <span className="admin-products-subtitle">
            STORE MANAGEMENT
          </span>

          <h2>Products</h2>

          <p>
            Manage your store products and inventory.
          </p>
        </div>

        <button
          className="admin-add-product-btn"
          onClick={openAddModal}
        >
          <FaPlus />
          Add Product
        </button>
      </div>

      <div className="admin-products-toolbar">
        <div className="admin-products-search">
          <FaSearch />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-products-count">
          {filteredProducts.length} products
        </div>
      </div>

      {error && !showModal && (
        <div className="admin-products-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-products-loading">
          <div className="admin-products-spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="admin-products-empty">
          <FaBoxOpen />

          <h3>No products found</h3>

          <p>
            {search
              ? "Try another search."
              : "Your store does not have any products yet."}
          </p>

          {!search && (
            <button
              className="admin-add-product-btn"
              onClick={openAddModal}
            >
              <FaPlus />
              Add Product
            </button>
          )}
        </div>
      ) : (
        <div className="admin-products-table-wrapper">
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="admin-product-info">
                      <div className="admin-product-image">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                          />
                        ) : (
                          <FaBoxOpen />
                        )}
                      </div>

                      <div>
                        <strong>{product.name}</strong>

                        <span>
                          {product.brand || "B-FIT"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="admin-product-category">
                      {product.category ||
                        "Uncategorized"}
                    </span>
                  </td>

                  <td>
                    <strong className="admin-product-price">
                      {formatCurrency(product.price)}
                    </strong>
                  </td>

                  <td>
                    <span
                      className={`admin-product-stock ${
                        Number(product.stock || 0) === 0
                          ? "out"
                          : Number(product.stock || 0) <= 5
                          ? "low"
                          : "available"
                      }`}
                    >
                      {Number(product.stock || 0)}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`admin-featured-status ${
                        product.featured
                          ? "yes"
                          : "no"
                      }`}
                    >
                      {product.featured ? "Yes" : "No"}
                    </span>
                  </td>

                  <td>
                    <div className="admin-product-actions">
                      <button
                        className="admin-edit-btn"
                        onClick={() =>
                          openEditModal(product)
                        }
                        title="Edit product"
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="admin-delete-btn"
                        onClick={() =>
                          handleDelete(product)
                        }
                        title="Delete product"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div
          className="admin-product-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target.className ===
              "admin-product-modal-overlay"
            ) {
              closeModal();
            }
          }}
        >
          <div className="admin-product-modal">
            <div className="admin-product-modal-header">
              <div>
                <span>
                  {editingProduct
                    ? "PRODUCT MANAGEMENT"
                    : "NEW PRODUCT"}
                </span>

                <h3>
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h3>
              </div>

              <button
                className="admin-product-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <FaTimes />
              </button>
            </div>

            {error && (
              <div className="admin-products-error">
                {error}
              </div>
            )}

            <form
              className="admin-product-form"
              onSubmit={handleSubmit}
            >
              <div className="admin-form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Protein, Creatine..."
                />
              </div>

              <div className="admin-form-group">
                <label>Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Brand name"
                />
              </div>

              <div className="admin-form-group">
                <label>Flavor</label>
                <input
                  type="text"
                  name="flavor"
                  value={formData.flavor}
                  onChange={handleChange}
                  placeholder="Chocolate, Strawberry..."
                />
              </div>

              <div className="admin-form-group">
                <label>Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="300 G, 2.3 KG..."
                />
              </div>

              <div className="admin-form-group">
                <label>Servings</label>
                <input
                  type="text"
                  name="servings"
                  value={formData.servings}
                  onChange={handleChange}
                  placeholder="60 Servings"
                />
              </div>

              <div className="admin-form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter product price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Old Price</label>
                <input
                  type="number"
                  name="oldPrice"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  placeholder="Original price"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="admin-form-group">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>

              <div className="admin-form-group">
                <label>Badge</label>
                <input
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  placeholder="New, Best Seller..."
                />
              </div>

              <div className="admin-form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="admin-form-group">
                <label>Gallery URLs</label>
                <textarea
                  name="gallery"
                  value={formData.gallery}
                  onChange={handleChange}
                  placeholder="URL 1, URL 2, URL 3"
                  rows="3"
                />
              </div>

              <div className="admin-form-group">
                <label>Benefits</label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  placeholder="Benefit 1, Benefit 2, Benefit 3"
                  rows="3"
                />
              </div>

              <div className="admin-form-group">
                <label>Ingredients</label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  placeholder="Ingredient 1, Ingredient 2, Ingredient 3"
                  rows="3"
                />
              </div>

              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows="5"
                  required
                />
              </div>

              <div className="checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  Featured Product
                </label>
              </div>

              <div className="admin-product-form-actions">
                <button
                  type="button"
                  className="admin-product-cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-product-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

