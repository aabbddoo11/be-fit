import Favorite from "../models/Favorite.js";
import Product from "../models/Product.js";


/*
==========================================
Get User Favorites
==========================================
*/

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.find({
      user: userId,
    }).populate("product");

    return res.status(200).json({
      favorites,
    });

  } catch (error) {
    console.error("Get favorites error:", error);

    return res.status(500).json({
      message: "Server error, please try again later",
    });
  }
};


/*
==========================================
Add Product To Favorites
==========================================
*/

export const addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;


    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }


    // Check if product exists

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product was not found",
      });
    }


    // Check if already favorite

    const existingFavorite = await Favorite.findOne({
      user: userId,
      product: productId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        message: "Product is already in your favorites",
      });
    }


    // Create favorite

    const favorite = await Favorite.create({
      user: userId,
      product: productId,
    });


    // Return populated product

    await favorite.populate("product");


    return res.status(201).json({
      message: "Product added to favorites",
      favorite,
    });

  } catch (error) {
    console.error("Add favorite error:", error);

    return res.status(500).json({
      message: "Server error, please try again later",
    });
  }
};


/*
==========================================
Remove Product From Favorites
==========================================
*/

export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;


    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }


    const favorite = await Favorite.findOneAndDelete({
      user: userId,
      product: productId,
    });


    if (!favorite) {
      return res.status(404).json({
        message: "Product is not in your favorites",
      });
    }


    return res.status(200).json({
      message: "Product removed from favorites",
    });

  } catch (error) {
    console.error("Remove favorite error:", error);

    return res.status(500).json({
      message: "Server error, please try again later",
    });
  }
};