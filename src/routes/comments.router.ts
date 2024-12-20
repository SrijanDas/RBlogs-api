import { Router } from "express";
import {
    deleteComment,
    getCommentsByBlogId,
    postComment,
    updateComment,
} from "../controllers/commets.controller";
import authenticateToken from "../middleware/authenticate";

const commentsRouter = Router();

commentsRouter.get("/:blogId", authenticateToken, getCommentsByBlogId);
commentsRouter.post("/", authenticateToken, postComment);
commentsRouter.put("/:commentId", authenticateToken, updateComment);
commentsRouter.delete("/:commentId", authenticateToken, deleteComment);

export default commentsRouter;
