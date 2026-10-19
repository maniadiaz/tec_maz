import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.js";
import { loginSchema } from "./auth.schema.js";
import { createUserSchema } from "../users/users.schema.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import {
  loginLimiter,
  registerLimiter,
  refreshLimiter,
} from "../../middlewares/rate-limit.js";

const router = Router();

router.post("/register", registerLimiter, validate(createUserSchema), authController.register);
router.post("/login", loginLimiter, validate(loginSchema), authController.login);
router.post("/refresh", refreshLimiter, authController.refresh);
router.post("/logout", authController.logout);
router.post("/logout-all", requireAuth, authController.logoutAll);
router.get("/me", requireAuth, authController.me);

export default router;