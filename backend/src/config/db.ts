import pg from "pg";
import { env } from "./env.js";

export const pool = new pg.Pool({
    connectionString: env.DATABASE_URL,
});

export async function connectDB() {
    const client = await pool.connect();
    try {
        await client.query("SELECT 1");
        console.log("Conectado a PostgreSQL");
    } finally {
        client.release();
    }
}