import mongoose, { Model, model, Schema } from "mongoose";
import { Comment } from "../types";

const CommentSchema = new Schema<Comment>(
    {
        content: {
            type: String,
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        blogId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const CommentModel: Model<Comment> =
    mongoose.models.Comment || model("Comment", CommentSchema);

export default CommentModel;
