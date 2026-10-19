import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { globalLimiter } from "./middlewares/rate-limit.js";


// Routers
import usersRouter from "./module/users/users.router.js";
import authRouter  from "./module/auth/auth.router.js"
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.set("trust proxy", env.TRUST_PROXY);

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));

// /health antes del limite: los monitores no debe  de consumir cuota
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
})


app.use(globalLimiter);
app.use(express.json({limit: "10kb"}));
app.use(cookieParser());


// Aquí irán las rutas de cada modulos ( Users, Auth. etc..)
app.use("/auth",authRouter);
app.use("/users", usersRouter);

app.use(notFound);
app.use(errorHandler); // Siempre ultimo

export default app;