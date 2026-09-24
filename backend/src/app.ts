import cors from 'cors';
import express, { type Express } from 'express';
import morgan from 'morgan';
import { EmployeeController } from './controllers/employee.controller.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import type { IEmployeeRepository } from './repositories/employee.repository.interface.js';
import { createEmployeeRouter } from './routes/employee.routes.js';

/** Recibe la ABSTRACCIÓN del repositorio (Inversión de Dependencias). */
export const createApp = (employeeRepository: IEmployeeRepository): Express => {
  const app = express();

  app.use(morgan('dev'));
  app.use(cors());
  app.use(express.json());

  app.use('/api/v1/employees', createEmployeeRouter(new EmployeeController(employeeRepository)));

  app.use(notFoundHandler); // rutas inexistentes (después de todas las rutas)
  app.use(errorHandler); // interceptor global: SIEMPRE el último

  return app;
};