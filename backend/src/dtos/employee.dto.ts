import { z } from 'zod';

/** Reglas de negocio de un empleado (fuente única de verdad). */
const employeeFields = {
  nombre: z
    .string({ error: 'El nombre es obligatorio' })
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(80, 'El nombre no puede superar 80 caracteres'),
  cargo: z
    .string({ error: 'El cargo es obligatorio' })
    .trim()
    .min(2, 'El cargo debe tener al menos 2 caracteres')
    .max(80, 'El cargo no puede superar 80 caracteres'),
  departamento: z
    .string({ error: 'El departamento es obligatorio' })
    .trim()
    .min(2, 'El departamento debe tener al menos 2 caracteres')
    .max(80, 'El departamento no puede superar 80 caracteres'),
  sueldo: z
    .number({ error: 'El sueldo debe ser un número' })
    .positive('El sueldo debe ser mayor que cero')
    .max(1_000_000, 'El sueldo excede el máximo permitido'),
};

/** POST / PUT: todos los campos obligatorios. strictObject rechaza campos extra. */
export const createEmployeeSchema = z.strictObject(employeeFields);

/** PATCH: todos opcionales, pero al menos uno presente. */
export const updateEmployeeSchema = z
  .strictObject(employeeFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    error: 'Debe enviar al menos un campo para actualizar',
  });

/** :id debe ser un ObjectId de MongoDB (24 caracteres hexadecimales). */
export const idParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'El id no es un ObjectId válido'),
});

/** ?page=1&limit=10 llegan como texto, por eso se usa z.coerce. */
export const listQuerySchema = z.object({
  page: z.coerce
    .number({ error: 'page debe ser un número' })
    .int('page debe ser un entero')
    .min(1, 'page debe ser mayor o igual a 1')
    .default(1),
  limit: z.coerce
    .number({ error: 'limit debe ser un número' })
    .int('limit debe ser un entero')
    .min(1, 'limit debe ser mayor o igual a 1')
    .max(100, 'limit no puede ser mayor a 100')
    .default(10),
});

export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;
export type IdParamDto = z.infer<typeof idParamSchema>;
export type ListQueryDto = z.infer<typeof listQuerySchema>;