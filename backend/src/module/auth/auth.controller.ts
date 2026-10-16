import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { usersService } from "../users/users.service.js";

export const authController = {
    async register(req: Request, res: Response) {
        const user = await authService.register(req.body);
        res.status(201).json(user);
    },

    async login(req: Request, res: Response) {
        res.json(await authService.loging(req.body));
    },

    async me(req: Request, res: Response) {
        res.json(await usersService.getById(req.user!.id));
    },
}