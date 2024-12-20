import { Router } from "express";
import {
    createBlog,
    deleteBlog,
    getBlog,
    getBlogs,
    updateBlog,
} from "../controllers/blogs.controller";
import authenticateToken from "../middleware/authenticate";

const blogsRouter = Router();

blogsRouter.post("/", authenticateToken, createBlog);
blogsRouter.get("/", authenticateToken, getBlogs);
blogsRouter.get("/:id", authenticateToken, getBlog);
blogsRouter.put("/:id", authenticateToken, updateBlog);
blogsRouter.delete("/:id", authenticateToken, deleteBlog);

export default blogsRouter;
