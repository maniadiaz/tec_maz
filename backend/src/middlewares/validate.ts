import type { Request, Response, NextFunction } from "express";
import { z, type ZodType } from "zod";
import { AppError } from "../utils/AppError.js";

export const validate =
    (schema: ZodType, source: "body" | "params" = "body") =>
        (req: Request, _res: Response, next: NextFunction) => {
            const result = schema.safeParse(req[source]);

            if (!result.success) {
                throw new AppError("Datos inválido", 400, z.flattenError(result.error));
            }

            if (source === "body") req.body = result.data;

            next();
        };