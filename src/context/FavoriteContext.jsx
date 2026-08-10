import { createContext, useContext, useState,useEffect  } from "react";

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {

const [favorites, setFavorites] = useState(() => {
  const saved = localStorage.getItem("favorites");
  return saved ? JSON.parse(saved) : [];
});
useEffect(() => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}, [favorites]);
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
const clearFavorites = () => {
  setFavorites([]);
  localStorage.removeItem("favorites");
};
  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites, 
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorite() {
  return useContext(FavoriteContext);
}