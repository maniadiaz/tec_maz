import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pool } from "../config/db.js";

const MIGRATIONS_DIR = path.resolve(process.cwd(), "db/migrations");
const LOCK_ID = 727274; // evita que dos ejecuciones corran a la vez

async function migrate() {
    const client = await pool.connect();

    try {
        await client.query("SELECT pg_advisory_lock($1)", [LOCK_ID]);

        // Tabla que registra qué migraciones ya se aplicaron
        await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name       TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

        const { rows } = await client.query("SELECT name FROM schema_migrations");
        const applied = new Set(rows.map((r) => r.name));

        const files = (await readdir(MIGRATIONS_DIR))
            .filter((f) => f.endsWith(".sql"))
            .sort();

        let count = 0;

        for (const file of files) {
            if (applied.has(file)) continue;

            const sql = await readFile(path.join(MIGRATIONS_DIR, file), "utf8");

            try {
                await client.query("BEGIN");
                await client.query(sql);
                await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
                await client.query("COMMIT");
                console.log(`Aplicada: ${file}`);
                count++;
            } catch (err) {
                await client.query("ROLLBACK");
                console.error(`Falló la migración ${file}`);
                throw err;
            }
        }

        console.log(
            count === 0
                ? "No hay migraciones pendientes"
                : `${count} migración(es) aplicada(s)`
        );
    } finally {
        await client.query("SELECT pg_advisory_unlock($1)", [LOCK_ID]).catch(() => { });
        client.release();
    }
}

migrate()
    .then(() => pool.end())
    .catch(async (err) => {
        console.error(err);
        await pool.end();
        process.exit(1);
    });