import { randomBytes, createHash } from "node:crypto";

export const generateRefreshToken = () => randomBytes(48).toString("base64url");

export const hashToken = (token: string) =>
    createHash("sha256").update(token).digest("hex");