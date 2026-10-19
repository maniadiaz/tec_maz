import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { env } from "../../config/env.js";
import { usersRepository } from "../users/users.repository.js";
import { usersService } from "../users/users.service.js";
import type { CreateUserInput } from "../users/users.schema.js";
import type { LoginInput } from "./auth.schema.js";
import { refreshTokensRepository } from "./refresh-tokens.repository.js";
import { AppError } from "../../utils/AppError.js";
import { signAccessToken } from "../../utils/jwt.js";
import { generateRefreshToken, hashToken } from "../../utils/tokens.js";

const DUMMY_HASH = bcrypt.hashSync("dummy-password", 12);
const REFRESH_TTL_MS = env.JWT_REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000;

// Crea un access token y un refresh token nuevo dentro de una familia
async function issueTokens(
    user: { id: string; role: "user" | "admin" },
    familyId: string
) {
    const refreshToken = generateRefreshToken();

    await refreshTokensRepository.create({
        userId: user.id,
        familyId,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    });

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    return { accessToken, refreshToken };
}

export const authService = {
    register(data: CreateUserInput) {
        return usersService.create(data);
    },

    async login({ email, password }: LoginInput) {
        const user = await usersRepository.findAuthByEmail(email);

        const valid = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);
        if (!user || !valid) throw new AppError("Credenciales inválidas", 401);
        if (!user.is_active) throw new AppError("Tu cuenta está bloqueada", 403);

        // Cada login inicia una familia (una sesión) nueva
        const tokens = await issueTokens(user, randomUUID());

        const { password_hash, ...safeUser } = user;
        return { ...tokens, user: safeUser };
    },

    async refresh(rawToken: string | undefined) {
        if (!rawToken) throw new AppError("No autenticado", 401);

        const hash = hashToken(rawToken);
        const current = await refreshTokensRepository.consume(hash);

        if (!current) {
            // Token inexistente, vencido o YA USADO. Si ya fue usado, alguien lo
            // reutilizó: se cierra toda la sesión por seguridad.
            const old = await refreshTokensRepository.findByHash(hash);
            if (old) await refreshTokensRepository.revokeFamily(old.family_id);
            throw new AppError("Sesión inválida", 401);
        }

        // Se vuelve a consultar la base: rol actual, bloqueos y eliminaciones
        const user = await usersRepository.findById(current.user_id);
        if (!user || !user.is_active) {
            await refreshTokensRepository.revokeAllByUser(current.user_id);
            throw new AppError("Sesión inválida", 401);
        }

        return issueTokens(user, current.family_id);
    },

    async logout(rawToken: string | undefined) {
        if (!rawToken) return;
        const old = await refreshTokensRepository.findByHash(hashToken(rawToken));
        if (old) await refreshTokensRepository.revokeFamily(old.family_id);
    },

    async logoutAll(userId: string) {
        await refreshTokensRepository.revokeAllByUser(userId);
    },
};