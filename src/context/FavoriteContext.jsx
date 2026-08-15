import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";

import { useAuth } from "./AuthContext";

import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../services/api";

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const { token, isAuthenticated } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);


  /*
  ==========================================
  Load Favorites From Backend
  ==========================================
  */

  useEffect(() => {
    const loadFavorites = async () => {

      if (!isAuthenticated || !token) {
        setFavorites([]);
        return;
      }

      try {
        setLoading(true);

        const data = await getFavorites(token);

        const favoriteProducts =
          data?.favorites
            ?.map(
              (favorite) =>
                favorite.product
            )
            .filter(Boolean) || [];

        setFavorites(
          favoriteProducts
        );

      } catch (error) {

        console.error(
          "Failed to load favorites:",
          error
        );

        setFavorites([]);

      } finally {
        setLoading(false);
      }
    };

    loadFavorites();

  }, [token, isAuthenticated]);


  /*
  ==========================================
  Add / Remove Favorite
  ==========================================
  */

  const toggleFavorite = async (productId) => {

    if (!isAuthenticated || !token) {

      toast.error(
        "Please login before adding products to your favorites."
      );

      return;
    }


    const alreadyFavorite =
      favorites.some(
        (product) =>
          product?._id === productId
      );


    try {

      /*
      ======================================
      Remove Favorite
      ======================================
      */

      if (alreadyFavorite) {

        await removeFavorite(
          token,
          productId
        );


        setFavorites((prev) =>
          prev.filter(
            (product) =>
              product?._id !== productId
          )
        );


        toast.info(
          "Product removed from favorites. 🤍"
        );

        return;
      }


      /*
      ======================================
      Add Favorite
      ======================================
      */

      const data =
        await addFavorite(
          token,
          productId
        );


      const newProduct =
        data?.favorite?.product ||
        data?.product ||
        null;


      if (newProduct) {

        setFavorites((prev) => {

          const alreadyExists =
            prev.some(
              (product) =>
                product?._id ===
                newProduct?._id
            );


          if (alreadyExists) {
            return prev;
          }


          return [
            ...prev,
            newProduct,
          ];

        });

      } else {

        /*
          If backend does not return
          the populated product,
          reload favorites.
        */

        const updatedData =
          await getFavorites(token);


        const updatedFavorites =
          updatedData?.favorites
            ?.map(
              (favorite) =>
                favorite.product
            )
            .filter(Boolean) || [];


        setFavorites(
          updatedFavorites
        );
      }


      toast.success(
        "Product added to favorites. ❤️"
      );


    } catch (error) {

      console.error(
        "Favorite operation failed:",
        error
      );


      toast.error(
        error.message ||
          "Favorite operation failed."
      );

    }

  };


  /*
  ==========================================
  Check Favorite
  ==========================================
  */

  const isFavorite = (productId) => {

    return favorites.some(
      (product) =>
        product?._id === productId
    );

  };


  /*
  ==========================================
  Clear All Favorites
  ==========================================
  */

  const clearFavorites = async () => {

    if (!isAuthenticated || !token) {

      toast.error(
        "Please login to manage your favorites."
      );

      return;
    }


    try {

      const productIds =
        favorites
          .map(
            (product) =>
              product?._id
          )
          .filter(Boolean);


      await Promise.all(
        productIds.map(
          (productId) =>
            removeFavorite(
              token,
              productId
            )
        )
      );


      setFavorites([]);


      toast.info(
        "All favorites have been removed.!!"
      );


    } catch (error) {

      console.error(
        "Clear favorites error:",
        error
      );


      toast.error(
        error.message ||
          "Failed to clear favorites."
      );

    }

  };


  /*
  ==========================================
  Context
  ==========================================
  */

  return (
    <FavoriteContext.Provider
      value={{
        favorites,

        toggleFavorite,

        isFavorite,

        clearFavorites,

        loading,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );

}


export function useFavorite() {
  return useContext(
    FavoriteContext
  );
}