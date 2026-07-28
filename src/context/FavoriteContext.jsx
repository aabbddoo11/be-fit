import { createContext, useContext, useState } from "react";

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {

  const [favorites, setFavorites] = useState([]);

  function toggleFavorite(productId) {

    setFavorites((prev) => {

      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }

      return [...prev, productId];

    });

  }

  function isFavorite(productId) {
    return favorites.includes(productId);
  }

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorite() {
  return useContext(FavoriteContext);
}