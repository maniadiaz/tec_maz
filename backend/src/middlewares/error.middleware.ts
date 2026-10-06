import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export function notFound(_req: Request, res: Response) {
    res.status(404).json({ error: "Ruta no encontrada" });
}

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    if (err instanceof AppError) {
        return res.status(err.status).json({
            error: err.message,
            details: err.details,
        });
    }

    console.log(err);
    res.status(500).json({error: "Error interno del servidor"});
}