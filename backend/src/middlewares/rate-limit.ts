import rateLimit from "express-rate-limit";
import { AppError } from "../utils/AppError.js";

function createLimiter(options : {
    windowMs: number;
    limit: number;
    message: string;
    skipSuccessfulRequests?: boolean;
}) {
    return rateLimit({
        windowMs: options.windowMs,
        limit: options.limit,
        skipSuccessfulRequests: options.skipSuccessfulRequests ?? false,
        standardHeaders: "draft-7", // envía los headers RateLimit-*
        legacyHeaders: false,
        // Pasa por el errorHandler para mantener el mismo formato de error
        handler: (_req, _res, next ) => next(new AppError(options.message, 429)),
    });
}

const MIN = 60 * 1000;

// Toda la API
export const globalLimiter = createLimiter({
    windowMs: 15 * MIN,
    limit: 300,
    message: "Demasiadas peticiones, intentalo más tarde",
});


// Login: solo cuenta los intentos fallidos
export const loginLimiter = createLimiter({
    windowMs: 15 * MIN,
    limit: 10,
    skipSuccessfulRequests: true,
    message: "Demasiados intentos de inicio de sesión, intenta en 15 minutos.",
});

// Registro: pocas cuentas por IP
export const registerLimiter = createLimiter({
    windowMs: 60 * MIN,
    limit: 5,
    message: "Demasiados registros desde esta IP, intenta más tarde",
});

// Refresh: se usa seguid, pero con tope
export const refreshLimiter = createLimiter({
    windowMs: 15 * MIN,
    limit: 30,
    message: "Demasiadas renovaciones de sesión, intenta más tarde",
})