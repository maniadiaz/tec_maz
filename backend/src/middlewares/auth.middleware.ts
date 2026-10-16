import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

type Role = "user" | "admin";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
        throw new AppError("No autenticado", 401);
    }

    try {
        const payload = verifyAccessToken(header.slice(7));
        req.user = { id: payload.sub, role: payload.role };
    } catch {
        throw new AppError("Token inválido o expirado", 401);
    }

    next();
}

export const requireRole =
    (...roles: Role[]) =>
        (req: Request, _res: Response, next: NextFunction) => {
            if (!req.user || !roles.includes(req.user.role)) {
                throw new AppError("No tiene permiso para esta acción", 403);
            }
            next();
        };


export function requiereSelfOrAdmin(req: Request, _res: Response, next: NextFunction) {
    const isSelf = req.user?.id === req.params.id;
    const isAdmin = req.user?.role === "admin";

    if (!isSelf && !isAdmin) {
        throw new AppError("No tiene permiso para esta acción", 403);
    }

    next();
}