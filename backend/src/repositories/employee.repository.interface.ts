import type { Employee, NewEmployee, UpdateEmployee } from '../models/employee.entity.js';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

/**
 * Patrón Repository: el controlador dependerá de ESTA interfaz,
 * nunca de Mongoose.
 */
export interface IEmployeeRepository {
  findAll(pagination: PaginationParams): Promise<PaginatedResult<Employee>>;
  findById(id: string): Promise<Employee | null>;
  create(data: NewEmployee): Promise<Employee>;
  update(id: string, data: UpdateEmployee): Promise<Employee | null>;
  delete(id: string): Promise<boolean>;
}