import { Comment, IDocument, ISerializable } from "../types";
import { serializeUser } from "./user.serializer";

export const serializeComment = async (comment: ISerializable<Comment>) => {
    if (!comment) return;

    const commentDoc = comment._doc ?? comment;
    const { createdBy, ...rest } = commentDoc;
    const user = await serializeUser(createdBy);

    return {
        ...rest,
        createdBy: user,
    };
};

export const serializeComments = (comments: IDocument<Comment>[]) => {
    return Promise.all(comments.map((c) => serializeComment(c.toObject())));
};
