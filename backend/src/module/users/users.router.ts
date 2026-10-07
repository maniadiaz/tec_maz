import { Router } from "express";
import { usersController } from "./users.controller.js";
import { validate } from "../../middlewares/validate.js";
import {
    createUserSchema,
    updateUserSchema,
    idParamSchema,
} from "./users.schema.js";

const router = Router();

router.get("/", usersController.list);
router.get("/:id", validate(idParamSchema, "params"), usersController.getById);
router.post("/", validate(createUserSchema), usersController.create);
router.patch(
    "/:id",
    validate(idParamSchema, "params"),
    validate(updateUserSchema),
    usersController.update);
router.delete("/:id", validate(idParamSchema, "params"), usersController.remove);

export default router;