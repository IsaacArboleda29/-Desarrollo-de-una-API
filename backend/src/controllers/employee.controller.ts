import type { Request, Response } from 'express';
import type { CreateEmployeeDto, IdParamDto, ListQueryDto, UpdateEmployeeDto } from '../dtos/employee.dto.js';
import { NotFoundError } from '../errors/app-error.js';
import type { IEmployeeRepository } from '../repositories/employee.repository.interface.js';
import { ok } from '../utils/api-response.js';

/**
 * El controlador SOLO conoce la interfaz IEmployeeRepository (Reto 1)
 * y responde SIEMPRE con el Response Wrapper (Reto 2).
 * Los datos ya vienen validados por Zod en res.locals.validated.
 * Express 5 envía automáticamente los errores async al errorHandler.
 */
export class EmployeeController {
  constructor(private readonly repository: IEmployeeRepository) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    const { page, limit } = res.locals['validated'].query as ListQueryDto;
    const { items, total } = await this.repository.findAll({ page, limit });
    res.json(
      ok(items, 'Empleados obtenidos correctamente', {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }),
    );
  };

  getById = async (_req: Request, res: Response): Promise<void> => {
    const { id } = res.locals['validated'].params as IdParamDto;
    const employee = await this.repository.findById(id);
    if (!employee) throw new NotFoundError(`No existe un empleado con id ${id}`);
    res.json(ok(employee, 'Empleado obtenido correctamente'));
  };

  create = async (_req: Request, res: Response): Promise<void> => {
    const data = res.locals['validated'].body as CreateEmployeeDto;
    const employee = await this.repository.create(data);
    res.status(201).json(ok(employee, 'Empleado creado correctamente'));
  };

  update = async (_req: Request, res: Response): Promise<void> => {
    const { id } = res.locals['validated'].params as IdParamDto;
    const data = res.locals['validated'].body as UpdateEmployeeDto;
    const employee = await this.repository.update(id, data);
    if (!employee) throw new NotFoundError(`No existe un empleado con id ${id}`);
    res.json(ok(employee, 'Empleado actualizado correctamente'));
  };

  remove = async (_req: Request, res: Response): Promise<void> => {
    const { id } = res.locals['validated'].params as IdParamDto;
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new NotFoundError(`No existe un empleado con id ${id}`);
    res.json(ok({ id }, 'Empleado eliminado correctamente'));
  };
}