import { login } from "../controllers/authController.js";
import { register } from "../controllers/authController.js";
import express from 'express';
import { updateProfile } from "../controllers/authController.js";
const authRouter = express.Router();
authRouter.post("/login",login);
authRouter.post("/register",register);
authRouter.patch("/update",register);

export default authRouter;