import bcrypt from "bcrypt";
import { usersRepository } from "../users/users.repository.js";
import { usersService } from "../users/users.service.js";
import type { CreateUserInput } from "../users/users.schema.js";
import type { LoginInput } from "./auth.schema.js";
import { AppError } from "../../utils/AppError.js";
import { signAccessToken } from "../../utils/jwt.js";

const DUMMY_HASH = bcrypt.hashSync("dummny-password", 12);

export const authService = {
    register(data: CreateUserInput) {
        return usersService.create(data);
    },

    async loging({ email, password }: LoginInput) {
        const user = await usersRepository.findAuthByEmail(email);

        const valid = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);
        if (!user || !valid) throw new AppError("Credenciales inválidas", 401);

        if (!user.is_active) throw new AppError("Tu cuenta está bloqueada", 403);

        const accessToken = signAccessToken({ sub: user.id, role: user.role });

        const { password_hash, ...safeUser } = user;
        return { accessToken, user: safeUser };
    }
}