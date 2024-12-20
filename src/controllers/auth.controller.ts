import bcrypt from "bcrypt";
import { z } from "zod";
import {
    SignInValidator,
    SignUpValidator,
    VerifyTokenValidator,
} from "../validators/auth.validator";
import { validate } from "../validators/request.validator";
import jwt from "jsonwebtoken";
import { sendApiResponse } from "../lib/api-response-handler";
import { StatusCodes } from "http-status-codes";
import UserModel from "../models/user.model";
import { Request, Response } from "express";
import { env } from "../lib/env-config";
import { JwtPayload } from "../types";

export async function signUp(req: Request, res: Response): Promise<any> {
    try {
        const body: z.infer<typeof SignUpValidator> = req.body;

        const isValid = await validate(body, SignUpValidator);
        if (!isValid.success) {
            return sendApiResponse({
                success: false,
                msg: isValid.message,
                res,
                status: StatusCodes.BAD_REQUEST,
            });
        }

        // check if user exists
        const userExists = await UserModel.findOne({ email: body.email });
        if (userExists) {
            return sendApiResponse({
                success: false,
                msg: "user already exists",
                res,
                status: StatusCodes.BAD_REQUEST,
            });
        }

        const hash = await bcrypt.hash(body.password, 10);
        const user = await UserModel.create({
            email: body.email,
            password: hash,
            name: body.name,
        });

        return sendApiResponse({
            success: true,
            data: { user: { email: user.email, id: user._id } },
            msg: "Signup successful",
            res,
        });
    } catch (err: any) {
        return sendApiResponse({
            success: false,
            msg: err.message,
            res,
        });
    }
}

export async function signIn(req: Request, res: Response): Promise<any> {
    try {
        const body: z.infer<typeof SignInValidator> = req.body;

        const isValid = await validate(body, SignInValidator);
        if (!isValid.success) {
            return sendApiResponse({
                success: false,
                msg: isValid.message,
                res,
                status: StatusCodes.BAD_REQUEST,
            });
        }
        //check if user exists
        const userExists = await UserModel.findOne({ email: body.email });
        if (!userExists) {
            return sendApiResponse({
                success: false,
                msg: "user does not exist",
                res,
                status: StatusCodes.BAD_REQUEST,
            });
        }

        // check if password is correct
        const passwordMatched = await bcrypt.compare(
            body.password,
            userExists.password
        );
        if (!passwordMatched) {
            return sendApiResponse({
                success: false,
                msg: "incorrect password",
                res,
                status: StatusCodes.BAD_REQUEST,
            });
        }

        // generate access token
        const accessToken = jwt.sign(
            {
                id: userExists._id,
            },
            env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return sendApiResponse({
            success: true,
            msg: "user logged in",
            res,
            data: { accessToken },
        });
    } catch (err: any) {
        return sendApiResponse({
            success: false,
            msg: err.message,
            res,
        });
    }
}

export async function verifyToken(req: Request, res: Response): Promise<any> {
    try {
        const body: z.infer<typeof VerifyTokenValidator> = req.body;

        const isValid = await validate(body, VerifyTokenValidator);
        if (!isValid.success) {
            return sendApiResponse({
                success: false,
                msg: isValid.message,
                res,
                status: StatusCodes.BAD_REQUEST,
            });
        }

        const decoded: JwtPayload = jwt.verify(
            body.token,
            env.JWT_SECRET
        ) as JwtPayload;

        if (decoded.exp < Date.now() / 1000) {
            return sendApiResponse({
                success: false,
                msg: "Token expired",
                res,
                status: StatusCodes.UNAUTHORIZED,
            });
        }

        return sendApiResponse({
            success: true,
            msg: "Token is valid",
            res,
        });
    } catch (err: any) {
        return sendApiResponse({
            success: false,
            msg: err.message,
            res,
        });
    }
}
