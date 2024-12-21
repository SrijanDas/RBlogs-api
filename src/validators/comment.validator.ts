import { z } from "zod";

export const CommentValidator = z.object({
    content: z.string().nonempty(),
    blogId: z.string().nonempty(),
});

export const UpdateCommentValidator = z.object({
    content: z.string().nonempty(),
});
