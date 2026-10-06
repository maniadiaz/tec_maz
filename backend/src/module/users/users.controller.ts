import type { Request, Response } from "express";
import { usersService } from "./users.service.js";

export const usersController = {
    async list(_req: Request, res: Response) {
        res.json(await usersService.list());
    },

    async getById(req: Request, res: Response) {
        res.json(await usersService.getById(req.params.id as string));
    },

    async create(req: Request, res: Response) {
        const user = await usersService.create(req.body);
        res.status(201).json(user);
    },

    async update(req: Request, res: Response) {
        const user = await usersService.update(req.params.id as string, req.body);
        res.json(user);
    },

    async remove(req: Request, res: Response) {
        await usersService.remove(req.params.id as string);
        res.status(204).send();
    },
};