import express, { type Request, type Response, type Router } from "express";
import { sendApiResponse } from "../lib/api-response-handler";

const healthCheckRouter: Router = express.Router();

healthCheckRouter.get(
    "/",
    async (_req: Request, res: Response): Promise<any> => {
        return sendApiResponse({
            success: true,
            data: { message: "Server is up and running!" },
            msg: "Health check successful",
            res,
        });
    }
);

export default healthCheckRouter;
