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
   * Convert Backend cart products
   * into the format used by the Frontend.
   */
  const formatCartItems = (cart) => {
    const products = cart?.products || [];

    return products
      .filter((item) => item.product)
      .map((item) => ({
        ...item.product,

        id: item.product._id,

        quantity: Number(item.quantity || 1),
      }));
  };

  /*
   * Load cart from Backend.
   *
   * Backend response:
   *
   * {
   *   message: "Your cart is ready",
   *   yourCart: {
   *     products: [...]
   *   }
   * }
   */
  const loadCart = async () => {
    if (!isAuthenticated || !token) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);

      const data = await getCart(token);

      const formattedItems = formatCartItems(
        data?.yourCart
      );

      setCartItems(formattedItems);
    } catch (error) {
      /*
       * Backend returns 404 when the user
       * does not have a cart yet.
       *
       * This is not a real error for the UI.
       */
      if (
        !error.message
          ?.toLowerCase()
          .includes("cart is empty")
      ) {
        console.error(
          "Failed to load cart:",
          error
        );
      }

      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Load cart whenever authentication changes.
   */
  useEffect(() => {
    loadCart();
  }, [token, isAuthenticated]);

  /*
   * Add product to Backend cart.
   */
  const addToCart = async (
    product,
    quantity = 1
  ) => {
    if (!isAuthenticated || !token) {
      toast.error(
        "Please login before adding products to your cart."
      );

      return;
    }

    if (!product?._id && !product?.id) {
      toast.error("Invalid product.");

      return;
    }

    quantity = Number(quantity);

    if (quantity < 1 || Number.isNaN(quantity)) {
      quantity = 1;
    }

    const productId =
      product._id || product.id;

    try {
      /*
       * IMPORTANT:
       *
       * api.js expects:
       *
       * addCartItem(token, productId, quantity)
       */
      console.log("PRODUCT FROM CARD:", product);
console.log("PRODUCT ID SENT TO BACKEND:", productId);
      const data = await addCartItem(
  token,
  productId,
  quantity
);

      /*
       * Backend returns:
       *
       * {
       *   message,
       *   cart
       * }
       */
      const formattedItems = formatCartItems(
        data?.cart
      );

      setCartItems(formattedItems);

      toast.success(
        `${product.name} has been added to your cart. 🛒`
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to add product to cart."
      );
    }
  };

  /*
   * Remove product from Backend cart.
   *
   * Backend removeCartItem does NOT return
   * the updated cart.
   *
   * Therefore we reload the cart after deletion.
   */
  const removeFromCart = async (
    productId
  ) => {
    if (!isAuthenticated || !token) {
      return;
    }

    try {
      await removeCartItem(
        token,
        productId
      );

      /*
       * Get the latest cart from Backend.
       */
      await loadCart();

      toast.info(
        "Product removed from cart."
      );
    } catch (error) {
      console.error(
        "Remove from cart error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to remove product."
      );
    }
  };

  /*
   * Increase quantity.
   */
  const increaseQuantity = async (
    productId
  ) => {
    if (!isAuthenticated || !token) {
      return;
    }

    const item = cartItems.find(
      (item) => item.id === productId
    );

    if (!item) {
      return;
    }

    const newQuantity =
      Number(item.quantity) + 1;

    try {
      const data =
        await updateCartItem(
          token,
          productId,
          newQuantity
        );

      const formattedItems =
        formatCartItems(data?.cart);

      setCartItems(formattedItems);
    } catch (error) {
      console.error(
        "Increase quantity error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to update quantity."
      );
    }
  };

  /*
   * Decrease quantity.
   */
  const decreaseQuantity = async (
    productId
  ) => {
    if (!isAuthenticated || !token) {
      return;
    }

    const item = cartItems.find(
      (item) => item.id === productId
    );

    if (!item) {
      return;
    }

    const currentQuantity =
      Number(item.quantity);

    const newQuantity = Math.max(
      currentQuantity - 1,
      1
    );

    /*
     * Do nothing when quantity is already 1.
     */
    if (
      newQuantity === currentQuantity
    ) {
      return;
    }

    try {
      const data =
        await updateCartItem(
          token,
          productId,
          newQuantity
        );

      const formattedItems =
        formatCartItems(data?.cart);

      setCartItems(formattedItems);
    } catch (error) {
      console.error(
        "Decrease quantity error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to update quantity."
      );
    }
  };

  /*
   * Clear Backend cart.
   */
  const clearCart = async () => {
    if (!isAuthenticated || !token) {
      setCartItems([]);

      return;
    }

    try {
      await clearCartApi(token);

      /*
       * Backend has now cleared the cart.
       */
      setCartItems([]);
    } catch (error) {
      console.error(
        "Clear cart error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to clear cart."
      );
    }
  };

  /*
   * Total quantity.
   */
  const totalQuantity =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );

  /*
   * Cart subtotal.
   */
  const subtotal =
    cartItems.reduce(
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

        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}