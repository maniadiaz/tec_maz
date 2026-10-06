import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

async function start() {
    await connectDB();
    app.listen(env.PORT, () => {
        console.log(`API escuchando en http://localhost:${env.PORT}`);
    });
}

start().catch((err) => {
    console.log("Error al iniciar:", err);
    process.exit(1);
});