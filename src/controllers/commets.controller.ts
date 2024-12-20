import { type Response, type Request } from "express";
import { logger } from "../server";
import CommentModel from "../models/comment.model";
import {
    serializeComment,
    serializeComments,
} from "../serializers/comments.serializer";
import { sendApiResponse } from "../lib/api-response-handler";
import { CommentValidator } from "../validators/comment.validator";
import { z } from "zod";
import { validate } from "../validators/request.validator";
import { StatusCodes } from "http-status-codes";

export async function getCommentsByBlogId(
    req: Request,
    res: Response
): Promise<any> {
    try {
        const blogId = req.params.blogId;
        const comments = await CommentModel.find({ blogId }).sort({
            createdAt: -1,
        });

        const serializedComments = await serializeComments(comments);
        return sendApiResponse({
            success: true,
            res,
            data: {
                comments: serializedComments,
            },
        });
    } catch (error) {
        logger.error(error);
        return sendApiResponse({
            success: false,
            res,
            msg: "Failed to get comments",
        });
    }
}

export async function postComment(req: Request, res: Response): Promise<any> {
    try {
        const body: z.infer<typeof CommentValidator> = req.body;

        const isValid = await validate(body, CommentValidator);
        if (!isValid.success) {
            return sendApiResponse({
                success: false,
                msg: isValid.message,
                res,
                status: StatusCodes.BAD_REQUEST,
            });
        }

        const { content, blogId } = body;
        const createdBy = req.userId;

        const comment = await CommentModel.create({
            content,
            createdBy,
            blogId,
        });

        const serializedComment = await serializeComment(comment);
        return sendApiResponse({
            success: true,
            res,
            data: {
                comment: serializedComment,
            },
        });
    } catch (error) {
        logger.error(error);
        return sendApiResponse({
            success: false,
            res,
            msg: "Failed to post comment",
        });
    }
}

export async function updateComment(req: Request, res: Response): Promise<any> {
    try {
        const body: z.infer<typeof CommentValidator> = req.body;

        const isValid = await validate(body, CommentValidator);
        if (!isValid.success) {
            return sendApiResponse({
                success: false,
                msg: isValid.message,
                res,
                status: StatusCodes.BAD_REQUEST,
            });
        }

        const { content, blogId } = body;
        const commentId = req.params.commentId;

        const comment = await CommentModel.findOneAndUpdate(
            { _id: commentId },
            {
                content,
                blogId,
            },
            { new: true }
        );

        const serializedComment = await serializeComment(comment);

        return sendApiResponse({
            success: true,
            res,
            data: {
                comment: serializedComment,
            },
        });
    } catch (error) {
        logger.error(error);
        return sendApiResponse({
            success: false,
            res,
            msg: "Failed to post comment",
        });
    }
}

export async function deleteComment(req: Request, res: Response): Promise<any> {
    try {
        const commentId = req.params.commentId;
        await CommentModel.deleteOne({ _id: commentId });

        return sendApiResponse({
            success: true,
            res,
            msg: "Comment deleted successfully",
        });
    } catch (error) {
        logger.error(error);
        return sendApiResponse({
            success: false,
            res,
            msg: "Failed to delete comment",
        });
    }
}
