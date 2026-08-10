import { login } from "../controllers/authController.js";
import { register } from "../controllers/authController.js";
import express from 'express';
const authRouter = express.Router();
authRouter.post("/login",login);
authRouter.post("/register",register);
export default authRouter;