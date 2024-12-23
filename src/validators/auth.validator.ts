import { z } from "zod";

export const SignUpValidator = z.object({
    email: z
        .string({
            message: "Invalid email",
        })
        .email({
            message: "Invalid email",
        }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
    name: z.string().min(3, {
        message: "Name must be at least 3 characters long",
    }),
});

export const SignInValidator = z.object({
    email: z.string().email(),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
});

export const VerifyTokenValidator = z.object({
    token: z.string(),
});
