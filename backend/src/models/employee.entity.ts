/**
 * Entidad de dominio: describe QUÉ es un empleado para el negocio.
 * No sabe nada de Mongoose, Express ni Zod.
 */
export interface Employee {
  id: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt: Date;
  updatedAt: Date;
}

/** Datos necesarios para crear un empleado. */
export type NewEmployee = Pick<Employee, 'nombre' | 'cargo' | 'departamento' | 'sueldo'>;

/** Datos permitidos en una actualización parcial. */
export type UpdateEmployee = {
  [K in keyof NewEmployee]?: NewEmployee[K] | undefined;
};