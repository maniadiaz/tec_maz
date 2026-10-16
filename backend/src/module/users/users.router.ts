import { Router } from "express";
import { usersController } from "./users.controller.js";
import { validate } from "../../middlewares/validate.js";
import {
    requireAuth,
    requireRole,
    requiereSelfOrAdmin,
} from "../../middlewares/auth.middleware.js";
import {
    createUserSchema,
    updateUserSchema,
    idParamSchema,
    updateRoleSchema,
    updateStatusShema,
} from "./users.schema.js";


const router = Router();

// Todas las rutas del /user exigen estar logueado
router.use(requireAuth)

router.get("/", requireRole("admin"), usersController.list);

router.get(
    "/:id", 
    validate(idParamSchema, "params"),
    requiereSelfOrAdmin,
    usersController.getById
);

router.patch(
    "/:id",
    validate(idParamSchema, "params"),
    requiereSelfOrAdmin,
    validate(updateUserSchema),
    usersController.update
);

router.delete(
    "/:id", 
    validate(idParamSchema, "params"), 
    requiereSelfOrAdmin,
    usersController.remove
);

router.patch(
    "/:id/role",
    requireRole("admin"),
    validate(idParamSchema, "params"),
    validate(updateRoleSchema),
    usersController.updateRole
);

router.patch(
    "/:id/status",
    requireRole("admin"),
    validate(idParamSchema, "params"),
    validate(updateStatusShema),
    usersController.updateStatus
);

export default router;