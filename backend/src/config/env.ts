import "dotenv/config";
import { z } from "zod";

const envShema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().min(1, "DATABASE_URL es requerida"),
    JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET debe tener almenos 32 caracteres"),
    JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
    JWT_REFRESH_EXPIRES_DAYS: z.coerce.number().default(7),
    FRONTEND_URL: z.string().default("http://localhost:5173"),
    TRUST_PROXY: z.coerce.number().default(0),
});

export const env = envShema.parse(process.env);