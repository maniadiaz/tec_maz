import express from "express";
import cors from "cors";

// Routers
import usersRouter from "./module/users/users.router.js";
import authRouter  from "./module/auth/auth.router.js"
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
})


// Aquí irán las rutas de cada modulos ( Users, Auth. etc..)
app.use("/auth",authRouter);
app.use("/users", usersRouter);

app.use(notFound);
app.use(errorHandler); // Siempre ultimo

export default app;