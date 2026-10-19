import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { usersService } from "../users/users.service.js";
import { env } from "../../config/env.js";

const COOKIE_NAME = "refreshToken";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/auth", // el navegador solo la envía a /auth/*
  maxAge: env.JWT_REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
};

const { maxAge, ...clearOptions } = cookieOptions;

export const authController = {
  async register(req: Request, res: Response) {
    res.status(201).json(await authService.register(req.body));
  },

  async login(req: Request, res: Response) {
    const { accessToken, refreshToken, user } = await authService.login(req.body);
    res.cookie(COOKIE_NAME, refreshToken, cookieOptions);
    res.json({ accessToken, user });
  },

  async refresh(req: Request, res: Response) {
    const { accessToken, refreshToken } = await authService.refresh(
      req.cookies?.[COOKIE_NAME]
    );
    res.cookie(COOKIE_NAME, refreshToken, cookieOptions);
    res.json({ accessToken });
  },

  async logout(req: Request, res: Response) {
    await authService.logout(req.cookies?.[COOKIE_NAME]);
    res.clearCookie(COOKIE_NAME, clearOptions);
    res.status(204).send();
  },

  async logoutAll(req: Request, res: Response) {
    await authService.logoutAll(req.user!.id);
    res.clearCookie(COOKIE_NAME, clearOptions);
    res.status(204).send();
  },

  async me(req: Request, res: Response) {
    res.json(await usersService.getById(req.user!.id));
  },
};