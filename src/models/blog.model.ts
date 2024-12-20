import mongoose, { InferSchemaType, Model, model, Schema } from "mongoose";
import { Blog } from "../types";

const BlogSchema = new Schema<Blog>(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        comments: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const BlogModel: Model<Blog> =
    mongoose.models.Blog || model("Blog", BlogSchema);

export default BlogModel;
