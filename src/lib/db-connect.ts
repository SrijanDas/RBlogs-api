import mongoose from "mongoose";
import { env } from "./env-config";
import { logger } from "../server";

export default async function connectDatabase() {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(env.MONGO_URI);
        logger.info("Successfully connected to database.");
    } catch (error: any) {
        logger.error(
            "message" in error
                ? error.message
                : "Something went wrong while connecting to database!"
        );
        return;
    }
}
