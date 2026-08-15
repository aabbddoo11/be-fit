import express from "express";

import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/FavoriteController.js";

import {authMiddleware} from "../middleware/authMiddleware.js";

const favoriteRoutes = express.Router();


/*
==========================================
Get User Favorites
==========================================
*/

favoriteRoutes.get(
  "/",
  authMiddleware,
  getFavorites
);


/*
==========================================
Add Product To Favorites
==========================================
*/

favoriteRoutes.post(
  "/",
  authMiddleware,
  addFavorite
);


/*
==========================================
Remove Product From Favorites
==========================================
*/

favoriteRoutes.delete(
  "/:productId",
  authMiddleware,
  removeFavorite
);


export default favoriteRoutes;