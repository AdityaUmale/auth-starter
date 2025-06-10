import { z } from "zod";

const registerUserSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6),
});

const loginUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

export { registerUserSchema, loginUserSchema };