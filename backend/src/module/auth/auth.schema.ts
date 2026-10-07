import { email, z } from "zod";

export const loginSchema = z.object({
    email: z.email("Email inválido").toLowerCase(),
    password: z.string().min(1, "La contraseña es requerida"),
});

export type LoginInput = z.infer<typeof loginSchema>;