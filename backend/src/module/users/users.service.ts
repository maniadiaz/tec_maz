import bcrypt from "bcrypt";
import { usersRepository  } from "./users.repository.js";
import { AppError } from "../../utils/AppError.js";
import type { CreateUserInput, updateUserInput } from "./users.schema.js";

export const usersService = {
    list() {
        return usersRepository.findAll();
    },

    async getById(id: string) {
        const user = await usersRepository.findById(id);
        if (!user) throw new AppError("Usuario no encontrado", 404);
        return user;
    },

    async create(data: CreateUserInput) {

        if (await usersRepository.findByEmail(data.email))
            throw new AppError("El email ya esta registrado", 409);

        const passwordHash = await bcrypt.hash(data.password, 12);
        return usersRepository.create({
            name: data.name,
            email: data.email,
            passwordHash,
        });
    },

    async update(id: string, data: updateUserInput) {
        if (data.email) {
            const existing = await usersRepository.findByEmail(data.email);
            if (existing && existing.id !== id)
                throw new AppError("El email ya esta registrado", 409);
        }

        const user = await usersRepository.update(id, {
            name: data.name,
            email: data.email,
        });

        if (!user) throw new AppError("Usuario no encontrado", 404);
        return user;
    },

    async remove(id: string) {
        const deleted = await usersRepository.delete(id);
        if (!deleted) throw new AppError("Usuario no encontrado", 404);
    },
};