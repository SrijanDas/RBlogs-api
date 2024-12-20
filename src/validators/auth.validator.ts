import { z } from "zod";

export const SignUpValidator = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(3),
});

export const SignInValidator = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const VerifyTokenValidator = z.object({
    token: z.string(),
});
