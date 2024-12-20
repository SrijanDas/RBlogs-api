import { z } from "zod";

export const CreateBlogValidator = z.object({
    title: z.string().min(5).max(50),
    content: z.string().min(10).max(5000),
});

export const UpdateBlogValidator = z.object({
    id: z.string(),
    title: z.string().min(5).max(50).optional(),
    content: z.string().min(10).max(5000).optional(),
});

export const GetBlogsValidator = z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
});
