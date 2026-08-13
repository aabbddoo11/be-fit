import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  const getCartKey = () => {
    if (isAuthenticated && user?.id) {
      return `cart_${user.id}`;
    }

    return "cart_guest";
  };

  const [cartItems, setCartItems] = useState([]);

  /*
   * Load cart whenever the logged-in user changes.
   */
  useEffect(() => {
    const cartKey = getCartKey();

    try {
      const savedCart = localStorage.getItem(cartKey);

      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCartItems([]);
    }
  }, [isAuthenticated, user?.id]);

  /*
   * Save cart whenever cartItems change.
   */
  useEffect(() => {
    const cartKey = getCartKey();

    try {
      localStorage.setItem(
        cartKey,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cartItems, isAuthenticated, user?.id]);

  /*
   * Add product to cart
   */
  const addToCart = (product, quantity = 1) => {
    if (!product?.id) {
      toast.error("Invalid product.");
      return;
    }

    if (quantity < 1) {
      quantity = 1;
    }

    setCartItems((prev) => {
      const existingProduct = prev.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity,
        },
      ];
    });

    toast.success(
      `${product.name} has been added to your cart. 🛒`
    );
  };

  /*
   * Remove product
   */
  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => item.id !== productId
      )
    );

    toast.info("Product removed from cart.");
  };

  /*
   * Increase quantity
   */
  const increaseQuantity = (productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  /*
   * Decrease quantity
   */
  const decreaseQuantity = (productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.max(
                item.quantity - 1,
                1
              ),
            }
          : item
      )
    );
  };

  /*
   * Clear cart
   */
  const clearCart = () => {
    setCartItems([]);

    const cartKey = getCartKey();

    localStorage.removeItem(cartKey);
  };

  /*
   * Total quantity
   */
  const totalQuantity = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  /*
   * Cart subtotal
   */
  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalQuantity,
        subtotal,
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