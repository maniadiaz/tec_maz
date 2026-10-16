import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export type AccessTokenPayload = {
    sub: string;
    role: "user" | "admin";
};

export function signAccessToken(payload: AccessTokenPayload) {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
    });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);

    if (typeof payload === "string" || !payload.sub || !payload.role) {
        throw new Error("Payload inválido");
    }
    return { sub: payload.sub, role: payload.role };
}