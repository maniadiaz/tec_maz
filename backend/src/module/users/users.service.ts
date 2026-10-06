import bcrypt from "bcrypt";
import { usersRepository  } from "./users.repository.js";
import { AppError } from "../../utils/AppError.js";

export const usersService = {
    list() {
        return usersRepository.findAll();
    },

    async getById(id: string) {
        const user = await usersRepository.findById(id);
        if (!user) throw new AppError("Usuario no encontrado", 404);
        return user;
    },

    async create(data: { name?: string, email?: string, password?: string }) {
        const { name, email, password } = data;

        // Revisión minima
        if (!name || !email || !password)
            throw new AppError("name, email y password son requerido", 400);

        if (await usersRepository.findByEmail(email))
            throw new AppError("El email ya esta registrado", 409);

        const passwordHash = await bcrypt.hash(password, 12);
        return usersRepository.create({ name, email, passwordHash });
    },

    async update(id: string, data: { name?: string, email?: string }) {
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