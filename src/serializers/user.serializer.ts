import { ObjectId } from "mongoose";
import UserModel from "../models/user.model";

export const serializeUser = async (userId: ObjectId | string) => {
    const user = await UserModel.findById(userId);
    if (!user) {
        return;
    }

    const userInfo = {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
    };

    return userInfo;
};
