import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

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

        /*
          Backend:

          {
            favorites: [
              {
                _id,
                user,
                product: {
                  _id,
                  name,
                  price,
                  image,
                  ...
                }
              }
            ]
          }
        */

        const favoriteProducts =
          data?.favorites
            ?.map((favorite) => favorite.product)
            .filter(Boolean) || [];

        setFavorites(favoriteProducts);

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
      return;
    }

    /*
      Check using MongoDB _id
    */

    const alreadyFavorite =
      favorites.some(
        (product) =>
          product?._id === productId
      );


    try {

      if (alreadyFavorite) {

        /*
          Remove from database
        */

        await removeFavorite(
          token,
          productId
        );

        /*
          Remove from React state
        */

        setFavorites((prev) =>
          prev.filter(
            (product) =>
              product?._id !== productId
          )
        );

      } else {

        /*
          Add to database
        */

        const data = await addFavorite(
          token,
          productId
        );

        /*
          Prefer the product returned
          from the backend
        */

        const newProduct =
          data?.favorite?.product ||
          data?.product ||
          null;


        if (newProduct) {

          setFavorites((prev) => [

            ...prev,

            newProduct,

          ]);

        } else {

          /*
            If the POST response does not
            contain the populated product,
            reload favorites from backend.
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

      }

    } catch (error) {

      console.error(
        "Favorite operation failed:",
        error
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
  Clear Favorites
  ==========================================
  */

  const clearFavorites = async () => {

    if (!isAuthenticated || !token) {
      return;
    }

    try {

      /*
        Delete every favorite
        from the database
      */

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


      /*
        Clear React state
      */

      setFavorites([]);

    } catch (error) {

      console.error(
        "Clear favorites error:",
        error
      );

    }

  };


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
  return useContext(FavoriteContext);
}