import { sendApiResponse } from "@/lib/api-response-handler";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ZodError, ZodSchema } from "zod";

export const validateRequest =
    (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (err) {
            const errorMessage = `Invalid input: ${(err as ZodError).errors
                .map((e) => e.message)
                .join(", ")}`;
            const statusCode = StatusCodes.BAD_REQUEST;

            return sendApiResponse({
                res,
                status: statusCode,
                success: false,
                msg: errorMessage,
            });
        }
    };
