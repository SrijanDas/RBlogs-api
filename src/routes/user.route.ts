import { Router } from "express";
import { getProfile } from "../controllers/user.controller";
import authenticateToken from "../middleware/authenticate";

const userRouter = Router();

userRouter.get("/profile", authenticateToken, getProfile);

export default userRouter;
