import { Router } from "express";
import { signIn, signUp, verifyToken } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/verify-token", verifyToken);

export default authRouter;
