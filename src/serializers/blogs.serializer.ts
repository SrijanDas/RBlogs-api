import { Blog, IDocument, ISerializable } from "../types";
import { serializeUser } from "./user.serializer";

export const serializeBlog = async (blog: ISerializable<Blog>) => {
    if (!blog) return;

    const blogDoc = blog._doc ?? blog;
    const { createdBy, ...rest } = blogDoc;
    const user = await serializeUser(createdBy);

    return {
        ...rest,
        createdBy: user,
    };
};

export const serializeBlogs = (blogs: IDocument<Blog>[]) => {
    return Promise.all(blogs.map((b) => serializeBlog(b.toObject())));
};
