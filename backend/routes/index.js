import express from 'express';
import router from './productRoutes.js';
import favoriteRoutes from './FavoriteRoutes.js';
import cartRout from './cartRoutes.js';
import ordersRouter from './orderRoutes.js';
import checkoutRouter from './checkoutRoutes.js';
import authRouter from './authRoutes.js';
import adminRouter from './adminRoutes.js';
const Router = express.Router()
Router.use("/products",router)
Router.use("/favorites", favoriteRoutes);
Router.use("/cart",cartRout)
Router.use("/orders",ordersRouter);
Router.use("/checkout",checkoutRouter);
Router.use("/user",authRouter)
Router.use("/admin",adminRouter)
export default Router;