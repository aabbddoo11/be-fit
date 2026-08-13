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
    if (!cart || !cart.products) {
      return [];
    }

    return cart.products
      .filter((item) => item.product)
      .map((item) => ({
        ...item.product,

        id: item.product._id,

        quantity: item.quantity,
      }));
  };

  /*
   * Load cart from Backend
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

        setCartItems(
          formatCartItems(data.yourCart)
        );
      } catch (error) {
        console.error(
          "Failed to load cart:",
          error
        );

        setCartItems([]);

        toast.error(
          error.message ||
            "Failed to load your cart."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [token, isAuthenticated]);

  /*
   * Add product
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

    const productId =
      product?._id || product?.id;

    if (!productId) {
      toast.error("Invalid product.");

      return;
    }

    if (quantity < 1) {
      quantity = 1;
    }

    try {
      const data = await addCartItem(
        token,
        productId,
        quantity
      );

      setCartItems(
        formatCartItems(data.cart)
      );

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
   * Remove product
   */
  const removeFromCart = async (
    productId
  ) => {
    if (!isAuthenticated || !token) {
      return;
    }

    try {
      const data =
        await removeCartItem(
          token,
          productId
        );

      /*
       * removeFromCart Backend currently
       * returns only the message.
       *
       * Therefore reload the cart.
       */
      const updatedCart =
        await getCart(token);

      setCartItems(
        formatCartItems(
          updatedCart.yourCart
        )
      );

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
   * Increase quantity
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

    try {
      const data =
        await updateCartItem(
          token,
          productId,
          item.quantity + 1
        );

      setCartItems(
        formatCartItems(data.cart)
      );
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
   * Decrease quantity
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

    const newQuantity =
      Math.max(item.quantity - 1, 1);

    if (
      newQuantity === item.quantity
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

      setCartItems(
        formatCartItems(data.cart)
      );
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
   * Clear cart
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
        error.message ||
          "Failed to clear cart."
      );
    }
  };

  /*
   * Total quantity
   */
  const totalQuantity =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );

  /*
   * Subtotal
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}