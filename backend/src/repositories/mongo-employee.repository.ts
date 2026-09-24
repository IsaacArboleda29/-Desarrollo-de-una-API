import type { Employee, NewEmployee, UpdateEmployee } from '../models/employee.entity.js';
import { EmployeeModel } from '../models/employee.model.js';
import type {
  IEmployeeRepository,
  PaginatedResult,
  PaginationParams,
} from './employee.repository.interface.js';

/** Convierte un documento de Mongo en la entidad de dominio (_id -> id). */
const toDomain = (doc: {
  _id: unknown;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt: Date;
  updatedAt: Date;
}): Employee => ({
  id: String(doc._id),
  nombre: doc.nombre,
  cargo: doc.cargo,
  departamento: doc.departamento,
  sueldo: doc.sueldo,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

/** Quita las claves undefined para no sobrescribir campos con "nada". */
const stripUndefined = (data: UpdateEmployee): Record<string, unknown> =>
  Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));

export class MongoEmployeeRepository implements IEmployeeRepository {
  async findAll({ page, limit }: PaginationParams): Promise<PaginatedResult<Employee>> {
    const [docs, total] = await Promise.all([
      EmployeeModel.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      EmployeeModel.countDocuments(),
    ]);
    return { items: docs.map(toDomain), total };
  }

  async findById(id: string): Promise<Employee | null> {
    const doc = await EmployeeModel.findById(id).lean();
    return doc ? toDomain(doc) : null;
  }

  async create(data: NewEmployee): Promise<Employee> {
    const doc = await EmployeeModel.create(data);
    return toDomain(doc.toObject());
  }

  async update(id: string, data: UpdateEmployee): Promise<Employee | null> {
    const doc = await EmployeeModel.findByIdAndUpdate(id, stripUndefined(data), {
      returnDocument: 'after',
      runValidators: true,
    }).lean();
    return doc ? toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const doc = await EmployeeModel.findByIdAndDelete(id).lean();
    return doc !== null;
  }
}