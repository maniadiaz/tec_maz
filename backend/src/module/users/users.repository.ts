import { pool } from "../../config/db.js";

// password_hash no se incluye: nunca debe de salir en una respuesta
const COLUMNS = "id, name, email, role, is_active, created_at, updated_at";

export const usersRepository = {

    // Metodo para obtener todo los usuarios
    async findAll() {
        const { rows } = await pool.query(
            `SELECT ${COLUMNS} FROM users
            WHERE deleted_at IS NULL 
            ORDER BY created_at DESC`
        );
        return rows;
    },

    // Metodo para encontrar y retornar la información mediante el UUID
    async findById(id: string) {
        const { rows } = await pool.query(
            `SELECT ${COLUMNS} FROM users WHERE id = $1 AND deleted_at IS NULL`,
            [id]
        );
        return rows[0] ?? null;
    },

    // Metodo para encontrar y retornar la información mediante el EMAIL
    async findByEmail(email: string) {
        const { rows } = await pool.query(
            `SELECT ${COLUMNS} FROM users 
            WHERE email = $1 AND deleted_at IS NULL`,
            [email]
        );
        return rows[0] ?? null;
    },

    // Metodo para CREAR a un usuario
    async create(data: { name: string, email: string, passwordHash: string }) {
        const { rows } = await pool.query(
            `INSERT INTO users (name, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING ${COLUMNS}`,
            [data.name, data.email, data.passwordHash]
        );
        return rows[0];
    },

    // Metodo para actualizar datos del usuario
    async update(id: string, data: {name?: string, email?: string}){
        const { rows } = await pool.query(
            `UPDATE users
            SET name = COALESCE($2, name),
                email = COALESCE($3, email),
                updated_at = now()
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING ${COLUMNS}`,
            [id, data.name ?? null, data.email ?? null]
        );
        return rows[0] ?? null;
    },

    // Metodo para hacer un Soft Delete al usuario
    async delete(id: string){
        const { rowCount  } = await pool.query(
            `UPDATE users
            SET deleted_at = now(), updated_at = now()
            WHERE id = $1 AND deleted_at IS NULL`,
            [id]
        );
        return (rowCount ?? 0 ) > 0;
    }
     
}