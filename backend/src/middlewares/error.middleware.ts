import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export function notFound(_req: Request, res: Response) {
    res.status(404).json({ error: "Ruta no encontrada" });
}

export function errorHandler(
    err: any,
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

    // UUID con formato inválido
    if (err?.code === "22P02")
        return res.status(400).json({ error: "Identificador inválido " });

    // Violación de UNIQUE (dos peticiones con el mismo email a la vez)
    if (err?.code === "23505")
        return res.status(400).json({ error: "El registro ya existe " });

    // Body demasiado grande
    if (err?.type === "entity.too.large")
        return res.status(413).json({error: "El cuerpo de la petición es demasiado grande"})

    // JSON mal formado
    if (err?.type === "entity.parse.failed")
        return res.status(400).json({error: "JSON inválido"});

    console.log(err);
    res.status(500).json({ error: "Error interno del servidor" });
}