import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { sendApiResponse } from "../lib/api-response-handler";
import { StatusCodes } from "http-status-codes";

export async function getProfile(req: Request, res: Response): Promise<any> {
    try {
        // check if user exists
        const userExists = await UserModel.findById(req.userId);
        if (!userExists) {
            return sendApiResponse({
                success: false,
                msg: "user does not exist",
                res,
                status: StatusCodes.BAD_REQUEST,
            });
        }

        return sendApiResponse({
            success: true,
            res,
            data: {
                user: {
                    userId: userExists._id,
                    email: userExists.email,
                    name: userExists.name,
                },
            },
        });
    } catch (err: any) {
        return sendApiResponse({
            success: false,
            msg: err.message,
            res,
        });
    }
}
