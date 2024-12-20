import { Request, Response } from "express";
import { sendApiResponse } from "../lib/api-response-handler";
import { z } from "zod";
import {
    CreateBlogValidator,
    GetBlogsValidator,
    UpdateBlogValidator,
} from "../validators/blog.validator";
import { validate } from "../validators/request.validator";
import { StatusCodes } from "http-status-codes";
import BlogModel from "../models/blog.model";
import { logger } from "../server";
import { serializeBlog, serializeBlogs } from "../serializers/blogs.serializer";

export async function createBlog(req: Request, res: Response): Promise<any> {
    try {
        const body: z.infer<typeof CreateBlogValidator> = req.body;

        const isValid = await validate(body, CreateBlogValidator);
        if (!isValid.success) {
            return sendApiResponse({
                success: false,
                msg: isValid.message,
                res,
                status: StatusCodes.BAD_REQUEST,
            });
        }

        const blog = await BlogModel.create({
            title: body.title,
            content: body.content,
            createdBy: req.userId,
        });

        return sendApiResponse({
            res,
            success: true,
            msg: "Blog created successfully",
            data: {
                blog: blog,
            },
        });
    } catch (error) {
        logger.error(error);
        return sendApiResponse({
            res,
            success: false,
            msg: "An error occurred while creating a blog",
        });
    }
}

export async function getBlogs(req: Request, res: Response): Promise<any> {
    try {
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit = req.query.limit
            ? parseInt(req.query.limit as string)
            : 10;

        const skip = page * limit - limit;
        const blogs = await BlogModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const totalPages = Math.ceil(
            (await BlogModel.countDocuments()) / limit
        );

        const serializedBlogs = await serializeBlogs(blogs);

        return sendApiResponse({
            res,
            success: true,
            msg: "Blogs fetched successfully",
            data: {
                blogs: serializedBlogs,
                totalPages: totalPages,
                nextPage: page + 1,
            },
        });
    } catch (error) {
        return sendApiResponse({
            res,
            success: false,
            msg: "An error occurred while fetching blogs",
        });
    }
}

export async function getBlog(req: Request, res: Response): Promise<any> {
    try {
        const blogId = req.params.id;
        const blog = await BlogModel.findById(blogId);
        if (!blog) {
            return sendApiResponse({
                res,
                success: false,
                msg: "Blog not found",
            });
        }

        const serializedBlog = await serializeBlog(blog);
        return sendApiResponse({
            res,
            success: true,
            msg: "Blog fetched successfully",
            data: { blog: serializedBlog },
        });
    } catch (error) {
        return sendApiResponse({
            res,
            success: false,
            msg: "An error occurred while fetching blog",
        });
    }
}

export async function updateBlog(req: Request, res: Response): Promise<any> {
    try {
        const body: z.infer<typeof UpdateBlogValidator> = req.body;

        const isValid = await validate(body, UpdateBlogValidator);
        if (!isValid.success) {
            return sendApiResponse({
                success: false,
                msg: isValid.message,
                res,
                status: StatusCodes.BAD_REQUEST,
            });
        }

        const blog = await BlogModel.findById(body.id);
        if (!blog) {
            return sendApiResponse({
                res,
                success: false,
                msg: "Blog not found",
            });
        }

        // check if the user is the creator of the blog
        if (blog.createdBy !== req.userId) {
            return sendApiResponse({
                res,
                success: false,
                msg: "You are not authorized to update this blog",
            });
        }

        blog.title = body.title || blog.title;
        blog.content = body.content || blog.content;
        await blog.save();

        return sendApiResponse({
            res,
            success: true,
            msg: "Blog updated successfully",
            data: blog,
        });
    } catch (error) {
        return sendApiResponse({
            res,
            success: false,
            msg: "An error occurred while updating blog",
        });
    }
}

export async function deleteBlog(req: Request, res: Response): Promise<any> {
    try {
        const blog = await BlogModel.findById(req.params.id);
        if (!blog) {
            return sendApiResponse({
                res,
                success: false,
                msg: "Blog not found",
            });
        }
        // check if user is the creator of the blog
        if (blog.createdBy !== req.userId) {
            return sendApiResponse({
                res,
                success: false,
                msg: "You are not authorized to delete this blog",
            });
        }
        await blog.deleteOne();
        return sendApiResponse({
            res,
            success: true,
            msg: "Blog deleted successfully",
        });
    } catch (error) {
        return sendApiResponse({
            res,
            success: false,
            msg: "An error occurred while deleting blog",
        });
    }
}
