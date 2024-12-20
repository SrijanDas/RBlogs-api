import { NextFunction, Request, Response } from "express";
import { sendApiResponse } from "../lib/api-response-handler";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { env } from "../lib/env-config";
import { JwtPayload } from "../types";

export default async function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return sendApiResponse({
                success: false,
                msg: "Token not provided",
                res,
                status: StatusCodes.UNAUTHORIZED,
            });
        }
        const decoded: JwtPayload = jwt.verify(
            token,
            env.JWT_SECRET
        ) as JwtPayload;
        req.body.userId = decoded.id;
        next();
    } catch (err: any) {
        return sendApiResponse({
            success: false,
            msg: err.message,
            res,
            status: StatusCodes.UNAUTHORIZED,
        });
    }
}
