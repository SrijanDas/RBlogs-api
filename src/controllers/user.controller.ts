import { sendApiResponse } from "@/lib/api-response-handler";
import { Request, Response } from "express";

export async function signUp(req: Request, res: Response): Promise<any> {
    try {
        return sendApiResponse({
            success: true,
            data: { message: "Server is up and running" },
            msg: "Health check successful",
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
