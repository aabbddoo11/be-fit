import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {adminMiddleware} from "../middleware/adminMiddleware.js";

const adminRouter = express.Router();

adminRouter.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    getDashboardStats
);

export default adminRouter;