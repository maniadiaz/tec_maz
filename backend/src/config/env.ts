import "dotenv/config";
import { z } from "zod";

const envShema = z.object({
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().min(1, "DATABASE_URL es requerida"),
});

export const env = envShema.parse(process.env);