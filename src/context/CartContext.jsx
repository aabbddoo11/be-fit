import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
const CartContext = createContext();

export function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState([]);

  function addToCart(product, quantity = 1) {

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

  toast.success(`${product.name}` + " has been added to your cart.🛒");}

  function removeFromCart(productId) {

    setCartItems((prev) =>
      prev.filter((item) => item.id !== productId)
    );

  }

  function increaseQuantity(productId) {

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

  }

  function decreaseQuantity(productId) {

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

  }

  function clearCart() {
    setCartItems([]);
  }

  return (

    <CartContext.Provider
      value={{
        cartItems,
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