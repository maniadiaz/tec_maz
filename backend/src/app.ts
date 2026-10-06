import express from "express";
import cors from "cors";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
})


// Aquí irán las rutas de cada modulos ( Users, Auth. etc..)


app.use(notFound);
app.use(errorHandler); // Siempre ultimo

export default app;