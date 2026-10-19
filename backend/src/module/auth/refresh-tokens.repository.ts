import { pool } from "../../config/db.js";

export const refreshTokensRepository = {
    async create(data: {
        userId: string;
        familyId: string;
        tokenHash: string;
        expiresAt: Date;
    }) {
        await pool.query(
            `INSERT INTO refresh_tokens (user_id, family_id, token_hash, expires_at)
            VALUES ($1, $2, $3, $4)`,
            [data.userId, data.familyId, data.tokenHash, data.expiresAt]
        );
    },

    // Marca el token como usado SOLO si sigue vigente.
    // Es atómico: si dos peticiones llegan a la vez, solo una lo consigue.
    async consume(tokenHash: string) {
        const { rows } = await pool.query(
            `UPDATE refresh_tokens
            SET revoked_at = now()
            WHERE token_hash = $1
            AND revoked_at IS NULL
            AND expires_at > now()
            RETURNING user_id, family_id`,
            [tokenHash]
        );
        return rows[0] ?? null;
    },

    async findByHash(tokenHash: string) {
        const { rows } = await pool.query(
            `SELECT user_id, family_id, revoked_at
            FROM refresh_tokens WHERE token_hash = $1`,
            [tokenHash]
        );

        return rows[0] ?? null;
    },

    // Cierra una sesión completa (todos los tokens de la familia)
    async revokeFamily(familyId: string) {
        await pool.query(
            `UPDATE refresh_tokens SET revoked_at = now()
            WHERE family_id = $1 AND revoked_at IS NULL`,
            [familyId]
        );
    },

    // Cierra todas las sesiones de un usuario
    async revokeAllByUser(userId: string) {
        await pool.query(
            `UPDATE refresh_tokens SET revoked_at = now()
            WHERE user_id = $1 AND revoked_at IS NULL`,
            [userId]
        );
    },
}