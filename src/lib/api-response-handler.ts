import { type Response } from "express";
import { StatusCodes } from "http-status-codes";

type IResponse = {
    res: Response;
    status?: StatusCodes;
    msg?: string;
};

type SuccessResponse = {
    success: true;
    data?: Record<string, any>;
};
type ErrorResponse = {
    success: false;
};

export function sendApiResponse(
    props: IResponse & (SuccessResponse | ErrorResponse)
) {
    if (props.success) {
        const { data, msg, res, status } = props;
        return res
            .status(status ?? StatusCodes.OK)
            .json({ success: true, msg: msg ?? "Success", ...data });
    } else {
        const { msg, res, status } = props;
        return res
            .status(status ?? StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ success: false, msg: msg ?? "Internal server error" });
    }
}
