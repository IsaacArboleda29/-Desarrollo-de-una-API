import { Router } from 'express';
import type { EmployeeController } from '../controllers/employee.controller.js';
import {
  createEmployeeSchema,
  idParamSchema,
  listQuerySchema,
  updateEmployeeSchema,
} from '../dtos/employee.dto.js';
import { validate } from '../middlewares/validate.middleware.js';

export const createEmployeeRouter = (controller: EmployeeController): Router => {
  const router = Router();

  router.get('/', validate({ query: listQuerySchema }), controller.list);
  router.get('/:id', validate({ params: idParamSchema }), controller.getById);
  router.post('/', validate({ body: createEmployeeSchema }), controller.create);
  // PUT = reemplazo total (todos los campos) | PATCH = actualización parcial
  router.put('/:id', validate({ params: idParamSchema, body: createEmployeeSchema }), controller.update);
  router.patch('/:id', validate({ params: idParamSchema, body: updateEmployeeSchema }), controller.update);
  router.delete('/:id', validate({ params: idParamSchema }), controller.remove);

  return router;
};