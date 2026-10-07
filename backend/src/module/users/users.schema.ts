import { email, z } from "zod";
export const idParamSchema = z.object({
    id: z.uuid("El id debe ser un UUID válido")
});

export const createUserSchema = z.object({
    name: z.string().trim().min(1, "El nombre es requerido").max(100),
    email: z.email("Email inválido").toLowerCase(),
    password: z
        .string()
        .min(8, "La contraseña debe tener al manos 8 caracteres")
        .max(72, "La contraseña no puede superar 72 caracteres"),
});

export const updateUserSchema = z
    .object({
        name: z.string().min(1).max(100).optional(),
        email: z.email("Email inválido").toLowerCase().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "Envía almenos un campo para actualizar",
    });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type updateUserInput = z.infer<typeof updateUserSchema>;