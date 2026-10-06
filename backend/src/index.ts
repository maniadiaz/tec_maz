import "dotenv/config";
import express from "express";  
import cors from "cors";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: 'ok'});
});

async function start() {
    await connectDB();
    app.listen(env.PORT, () =>{
        console.log(`API escuchando http://localhost:${env.PORT}`);
    });
}

start().catch((err) => {
    console.log("Error al iniciar:", err);
    process.exit(1);
});