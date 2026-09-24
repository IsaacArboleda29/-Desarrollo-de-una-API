import { Schema, model } from 'mongoose';

export interface EmployeeDocument {
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<EmployeeDocument>(
  {
    nombre: { type: String, required: true, trim: true },
    cargo: { type: String, required: true, trim: true },
    departamento: { type: String, required: true, trim: true },
    sueldo: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, versionKey: false },
);

export const EmployeeModel = model<EmployeeDocument>('Empleado', employeeSchema);