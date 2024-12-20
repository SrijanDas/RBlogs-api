import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import { env } from "./lib/env-config";
import userRouter from "./routes/user.route";
import healthCheckRouter from "./routes/health.router";

const logger = pino({ name: "server start" });
const app: Express = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/users", userRouter);

export { app, logger };
