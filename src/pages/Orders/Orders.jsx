import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
} from "../services/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { token, isAuthenticated } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  /*
   * Load cart from Backend
   * whenever authentication/token changes.
   */
  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated || !token) {
        setCartItems([]);
        return;
      }

      try {
        setLoading(true);

        const data = await getCart(token);

        /*
         * Expected Backend response:
         *
         * {
         *   cart: {
         *     products: [...]
         *   }
         * }
         */

        const products = data?.cart?.products || [];

        const formattedItems = products
          .filter((item) => item.product)
          .map((item) => ({
            ...item.product,

            id: item.product._id,

            quantity: item.quantity,
          }));

        setCartItems(formattedItems);
      } catch (error) {
        console.error("Failed to load cart:", error);

        setCartItems([]);

        toast.error(
          error.message || "Failed to load your cart."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [token, isAuthenticated]);

  /*
   * Add product to Backend cart
   */
  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated || !token) {
      toast.error("Please login before adding products to your cart.");
      return;
    }

    if (!product?._id && !product?.id) {
      toast.error("Invalid product.");
      return;
    }

    if (quantity < 1) {
      quantity = 1;
    }

    const productId = product._id || product.id;

    try {
      const data = await addCartItem(token, {
        productId,
        quantity,
      });

      /*
       * Update local React state from Backend response.
       */
      const products = data?.cart?.products || [];

      const formattedItems = products
        .filter((item) => item.product)
        .map((item) => ({
          ...item.product,

          id: item.product._id,

          quantity: item.quantity,
        }));

      setCartItems(formattedItems);

      toast.success(
        `${product.name} has been added to your cart. 🛒`
      );
    } catch (error) {
      console.error("Add to cart error:", error);

      toast.error(
        error.message || "Failed to add product to cart."
      );
    }
  };

  /*
   * Remove product from Backend cart
   */
  const removeFromCart = async (productId) => {
    if (!isAuthenticated || !token) {
      return;
    }

    try {
      const data = await removeCartItem(
        token,
        productId
      );

      const products = data?.cart?.products || [];

      const formattedItems = products
        .filter((item) => item.product)
        .map((item) => ({
          ...item.product,

          id: item.product._id,

          quantity: item.quantity,
        }));

      setCartItems(formattedItems);

      toast.info("Product removed from cart.");
    } catch (error) {
      console.error(
        "Remove from cart error:",
        error
      );

      toast.error(
        error.message || "Failed to remove product."
      );
    }
  };

  /*
   * Increase quantity
   */
  const increaseQuantity = async (productId) => {
    if (!isAuthenticated || !token) {
      return;
    }

    const item = cartItems.find(
      (item) => item.id === productId
    );

    if (!item) {
      return;
    }

    try {
      const data = await updateCartItem(
        token,
        productId,
        item.quantity + 1
      );

      const products = data?.cart?.products || [];

      const formattedItems = products
        .filter((item) => item.product)
        .map((item) => ({
          ...item.product,

          id: item.product._id,

          quantity: item.quantity,
        }));

      setCartItems(formattedItems);
    } catch (error) {
      console.error(
        "Increase quantity error:",
        error
      );

      toast.error(
        error.message || "Failed to update quantity."
      );
    }
  };

  /*
   * Decrease quantity
   */
  const decreaseQuantity = async (productId) => {
    if (!isAuthenticated || !token) {
      return;
    }

    const item = cartItems.find(
      (item) => item.id === productId
    );

    if (!item) {
      return;
    }

    const newQuantity = Math.max(
      item.quantity - 1,
      1
    );

    /*
     * Nothing to update if quantity is already 1.
     */
    if (newQuantity === item.quantity) {
      return;
    }

    try {
      const data = await updateCartItem(
        token,
        productId,
        newQuantity
      );

      const products = data?.cart?.products || [];

      const formattedItems = products
        .filter((item) => item.product)
        .map((item) => ({
          ...item.product,

          id: item.product._id,

          quantity: item.quantity,
        }));

      setCartItems(formattedItems);
    } catch (error) {
      console.error(
        "Decrease quantity error:",
        error
      );

      toast.error(
        error.message || "Failed to update quantity."
      );
    }
  };

  /*
   * Clear Backend cart
   */
  const clearCart = async () => {
    if (!isAuthenticated || !token) {
      setCartItems([]);
      return;
    }

    try {
      await clearCartApi(token);

      setCartItems([]);
    } catch (error) {
      console.error(
        "Clear cart error:",
        error
      );

      toast.error(
        error.message || "Failed to clear cart."
      );
    }
  };

  /*
   * Total quantity
   */
  const totalQuantity = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  /*
   * Cart subtotal
   */
  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,

        totalQuantity,

        subtotal,

        loading,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}