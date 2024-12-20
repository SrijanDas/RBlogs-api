import { z } from "zod";

export const CommentValidator = z.object({
    content: z.string().nonempty(),
    blogId: z.string().nonempty(),
});
