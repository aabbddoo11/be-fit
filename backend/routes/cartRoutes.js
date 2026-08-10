import express from "express";
import { addToCart } from "../controllers/Cart.js";
import { getCart } from "../controllers/Cart.js";
import { updateCartQuantity } from "../controllers/Cart.js";
import { removeFromCart } from "../controllers/Cart.js";
import { clearCart } from "../controllers/Cart.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const cartRout = express.Router();
cartRout.post('/',authMiddleware, addToCart);
cartRout.get('/',authMiddleware,getCart)
cartRout.put('/',authMiddleware,updateCartQuantity)
cartRout.delete('/:productId',authMiddleware,removeFromCart)
cartRout.delete('/',authMiddleware,clearCart);
export default cartRout;