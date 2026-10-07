import "dotenv/config";
import { z } from "zod";

const envShema = z.object({
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().min(1, "DATABASE_URL es requerida"),
    JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET debe tener almenos 32 caracteres"),
    JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
});

export const env = envShema.parse(process.env);